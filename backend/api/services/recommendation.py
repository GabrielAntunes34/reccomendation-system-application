from collections import Counter
from typing import Iterable

from sqlalchemy import Integer, cast, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.interaction import Interaction as InteractionModel
from models.product import Product as ProductModel


# Pesos de engajamento (ordem de importância para score implícito)
W_VIEW = 1    # peso para ver
W_LIKE = 3    # peso para like
W_CONTACT = 5 # peso para entrar em contato

# Pesos híbridos sessão + conteúdo (re-rank final)
SESSION_WEIGHT = 0.7
CONTENT_WEIGHT = 0.3

# Config SKNN
MAX_SESSIONS_SCAN = 500 #máximo de sessões a escanear para similaridade
TOP_K_NEIGHBORS = 50 # número de vizinhos similares a considerar
RECENCY_DECAY = 0.1  # quanto maior, maior o peso da recência (1/(1+gap*decay))

#Calcula o score da interação
def score_interaction(inter: InteractionModel) -> int:
    # Score implícito baseado no tipo de ação (view < like < contact)
    return (inter.times_viewed * W_VIEW) + (int(inter.liked) * W_LIKE) + (int(inter.contacted) * W_CONTACT)

async def get_session_products(db: AsyncSession, user_id: int, session_id: int) -> list[InteractionModel]:
    res = await db.execute(
        select(InteractionModel).where(
            (InteractionModel.user_id == user_id) & (InteractionModel.session_id == session_id)
        )
    )
    return res.scalars().all()


# Top populares globais (contato > like > view, apenas disponibles)
async def get_popular_products(db: AsyncSession, limit: int = 10)-> list[ProductModel]:
    res = await db.execute(
        select(ProductModel)
        .join(InteractionModel, InteractionModel.product_id == ProductModel.id, isouter=True)
        .where(ProductModel.disponible == True)
        .group_by(ProductModel.id)
        .order_by(
            desc(func.coalesce(func.sum(cast(InteractionModel.contacted, Integer)), 0)),
            desc(func.coalesce(func.sum(cast(InteractionModel.liked, Integer)), 0)),
            desc(func.coalesce(func.sum(InteractionModel.times_viewed), 0)),
        ).limit(limit)
    )
    return res.scalars().all()

# Similaridade de conjuntos (usada para sessões e conteúdo)
def jaccard(a: Iterable, b: Iterable) -> float:
    sa, sb = set(a), set(b)
    if not sa and not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def price_bucket(price: float | None) -> str:
    """Discretiza preço em faixas para comparação de conteúdo."""
    if price is None:
        return "price:unknown"
    if price < 80:
        return "price:low"
    if price < 160:
        return "price:mid"
    return "price:high"


def product_signature(product: ProductModel | None) -> set[str]:
    """Transforma atributos do produto em tokens categóricos simples para similaridade de conteúdo."""
    if not product:
        return set()

    sig: set[str] = set()
    if product.category:
        sig.add(f"cat:{product.category}".lower())
    if product.collection_id:
        sig.add(f"col:{product.collection_id}")
    if product.size:
        sig.add(f"size:{product.size}".lower())
    sig.add(price_bucket(getattr(product, "price", None)))

    colors = getattr(product, "color", None) or []
    if isinstance(colors, list):
        for c in colors:
            name = None
            if isinstance(c, dict):
                name = c.get("name") or c.get("color") or c.get("value")
            else:
                name = str(c)
            if name:
                sig.add(f"color:{str(name).lower()}")

    return sig


def content_similarity(a: ProductModel | None, b: ProductModel | None) -> float:
    """Similaridade de conteúdo baseada em Jaccard das assinaturas categóricas."""
    sa, sb = product_signature(a), product_signature(b)
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


async def get_product_by_id(db: AsyncSession, product_id: int) -> ProductModel | None:
    res = await db.execute(
        select(ProductModel).where(ProductModel.id == product_id)
    )
    return res.scalar_one_or_none()


async def get_similar_session(
    db: AsyncSession,
    target_prod_ids: set[int],
    current_session_id: int,
    limit_sessions: int = MAX_SESSIONS_SCAN,
) -> list[tuple[int, float]]:
    """Retorna [(session_id, score)] das sessões mais parecidas por coocorrencia de produtos.

    Usa Jaccard como base e aplica decaimento por distância de session_id,
    limitando os vizinhos mais similares (TOP_K_NEIGHBORS).
    """

    res = await db.execute(
        select(InteractionModel.session_id, InteractionModel.product_id)
        .order_by(desc(InteractionModel.session_id))
        .limit(limit_sessions * 10)
    )

    by_session: dict[int, set[int]] = {}
    for sess_id, prod_id in res:
        bucket = by_session.setdefault(sess_id, set())
        if prod_id is not None:
            bucket.add(prod_id)

    scored: list[tuple[int, float]] = []
    for sess_id, prods in by_session.items():
        if not prods:
            continue
        sim = jaccard(target_prod_ids, prods)
        if sim <= 0:
            continue
        gap = max(current_session_id - sess_id, 0)
        recency = 1 / (1 + gap * RECENCY_DECAY)
        scored.append((sess_id, sim * recency))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:TOP_K_NEIGHBORS]

async def get_recommendations(
    db: AsyncSession,
    user_id: int,
    user_session_id: int,
    product_id: int | None = None,
    limit: int = 10,
) -> list[ProductModel]:
    """
    Pipeline híbrido sessão + conteúdo:
    1. Coleta contexto (itens da sessão atual + produto em foco como âncora).
    2. Se não há contexto, retorna populares.
    3. Busca sessões similares por coocorrencia (Jaccard + recência).
    4. Soma scores implícitos dos itens dessas sessões como candidatos.
    5. Dá boost de popularidade global.
    6. Se nada foi gerado, tenta conteúdo puro (similaridade à âncora).
    7. Reordena candidatos combinando score colaborativo e similaridade de conteúdo.
    """
    # 1) contexto: produtos interagidos na sessão atual (itens do usuário)
    current_interactions = await get_session_products(db, user_id, user_session_id)
    current_prod_ids = {i.product_id for i in current_interactions}

    if product_id is not None:
        current_prod_ids.add(product_id)

    # Âncora de conteúdo (produto atual tem prioridade, depois qualquer da sessão)
    anchor_product = None
    anchor_candidates = []
    if product_id is not None:
        anchor_candidates.append(product_id)
    anchor_candidates.extend([pid for pid in current_prod_ids if pid not in anchor_candidates])
    for pid in anchor_candidates:
        anchor_product = await get_product_by_id(db, pid)
        if anchor_product:
            break

    # 2) se não há interação e nem produto âncora, devolver populares (fallback)
    if not current_prod_ids and not anchor_product:
        return await get_popular_products(db, limit=limit)

    # 3) sessões similares por coocorrencia (sessões com conjuntos de itens parecidos + decaimento temporal)
    similar_sessions = await get_similar_session(
        db,
        current_prod_ids,
        current_session_id=user_session_id,
        limit_sessions=MAX_SESSIONS_SCAN,
    )

    # 4) coletar candidatos das sessões similares, ponderando por peso da sessão e tipo de interação
    candidate_counts = Counter()
    for sess_id, weight in similar_sessions:
        res = await db.execute(
            select(InteractionModel).where(InteractionModel.session_id == sess_id)
        )
        for inter in res.scalars().all():
            if inter.product_id in current_prod_ids:
                continue
            candidate_counts[inter.product_id] += weight * score_interaction(inter)

    # 5) popularidade global como reforço (boost leve para itens elegíveis)
    popular = await get_popular_products(db, limit=limit * 2)

    for p in popular:
        if p.id not in current_prod_ids:
            candidate_counts[p.id] += 1  # pequeno boost

    # Se não há candidatos de sessão/popularidade, tenta conteúdo puro (mais parecido com a âncora), depois popular
    if not candidate_counts:
        if anchor_product:
            res = await db.execute(
                select(ProductModel).where(ProductModel.disponible == True)
            )
            pool = [
                p for p in res.scalars().all()
                if p.id not in current_prod_ids and p.id != getattr(anchor_product, "id", None)
            ]
            pool.sort(
                key=lambda p: content_similarity(anchor_product, p),
                reverse=True,
            )
            if pool:
                return pool[:limit]
        return popular[:limit]

    # 6) re-rank final: combina score colaborativo (sessão) com similaridade de conteúdo relativa à âncora
    candidate_ids = list(candidate_counts.keys())
    res = await db.execute(
        select(ProductModel).where(
            (ProductModel.id.in_(candidate_ids)) & (ProductModel.disponible == True)
        )
    )
    products = res.scalars().all()

    if anchor_product:
        blended_scores: dict[int, float] = {}
        for p in products:
            session_score = candidate_counts.get(p.id, 0)
            content_score = content_similarity(anchor_product, p)
            blended_scores[p.id] = (SESSION_WEIGHT * session_score) + (CONTENT_WEIGHT * content_score)
        products.sort(key=lambda p: blended_scores.get(p.id, 0), reverse=True)
    else:
        products.sort(key=lambda p: candidate_counts.get(p.id, 0), reverse=True)
    return products[:limit]

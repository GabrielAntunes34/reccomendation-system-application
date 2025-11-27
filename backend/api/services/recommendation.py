from collections import Counter
from typing import Iterable
from sqlalchemy import select, func, desc, cast, Integer
from sqlalchemy.ext.asyncio import AsyncSession
from models.interaction import Interaction as InteractionModel
from models.product import Product as ProductModel


# Pesos
W_VIEW = 1 #peso para ver
W_LIKE = 3  #peso para like
W_CONTACT = 5 #peso para entrar em contato

# Config SKNN
MAX_SESSIONS_SCAN = 500
TOP_K_NEIGHBORS = 50
RECENCY_DECAY = 0.1  # quanto maior, maior o peso da recência (1/(1+gap*decay))

#Calcula o score da interação
def score_interaction(inter: InteractionModel) -> int:
    return (inter.times_viewed * W_VIEW) + (int(inter.liked) * W_LIKE) + (int(inter.contacted) * W_CONTACT)

async def get_session_products(db: AsyncSession, user_id: int, session_id: int) -> list[InteractionModel]:
    res = await db.execute(
        select(InteractionModel).where(
            (InteractionModel.user_id == user_id) & (InteractionModel.session_id == session_id)
        )
    )
    return res.scalars().all()


#obter produtos populares
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

def jaccard(a: Iterable[int], b: Iterable[int]) -> float:
    sa, sb = set(a), set(b)
    if not sa and not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)

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
    
    # 1) produtos interagidos na sessão atual
    current_interactions = await get_session_products(db, user_id, user_session_id)
    current_prod_ids = {i.product_id for i in current_interactions}

    # 2) se não há interação, devolver populares (fallback)
    if not current_prod_ids and product_id is None:
        return await get_popular_products(db, limit=limit)
    
    # 3) contexto: produto atual opcional
    if product_id:
        current_prod_ids.add(product_id)

    # 4) sessões similares por coocorrencia
    similar_sessions = await get_similar_session(
        db,
        current_prod_ids,
        current_session_id=user_session_id,
        limit_sessions=MAX_SESSIONS_SCAN,
    )

    # 5) coletar candidatos das sessões similares
    candidate_counts = Counter()
    for sess_id, weight in similar_sessions:
        res = await db.execute(
            select(InteractionModel).where(InteractionModel.session_id == sess_id)
        )
        for inter in res.scalars().all():
            if inter.product_id in current_prod_ids:
                continue
            candidate_counts[inter.product_id] += weight * score_interaction(inter)

    # 6) popularidade global como reforço
    popular = await get_popular_products(db, limit=limit * 2)

    for p in popular:
        if p.id not in current_prod_ids:
            candidate_counts[p.id] += 1 # pequeno boost
    
    if not candidate_counts:
        return popular[:limit]
    
    # 7) pegar produtos e ordenar pelo score
    candidate_ids = list(candidate_counts.keys())
    res = await db.execute(
        select(ProductModel).where(
            (ProductModel.id.in_(candidate_ids)) & (ProductModel.disponible == True)
        )
    )
    products = res.scalars().all()
    products.sort(key=lambda p: candidate_counts.get(p.id, 0), reverse = True)
    return products[:limit]

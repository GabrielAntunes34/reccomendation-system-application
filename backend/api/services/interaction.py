from models.interaction import Interaction as InteractionModel
from schemas.interaction import InteractionCreate, InteractionUpdate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def create_interaction(db: AsyncSession, data: InteractionCreate):
    """Controller da rota que regitra um novo interação na base de dados"""

    interaction = InteractionModel(**data.model_dump())
    db.add(interaction)

    await db.commit()
    await db.refresh(interaction)
    return interaction


async def list_all_interactions(db: AsyncSession):
    """Controller da rota que retorna todos os interaçãos da base de dados"""

    interaction_list = await db.execute(select(InteractionModel))
    return interaction_list.scalars().all()


async def get_interaction_by_id(db: AsyncSession, user_id: int, product_id: int):
    """Controller da rota que retorna um interação especifico da base de dados"""

    # Obtendo o registro único da interação daquele usuário com aquele produto
    result = await db.execute(
        select(InteractionModel).where(
            InteractionModel.user_id == user_id
            and InteractionModel.product_id == product_id
        )
    )
    return result.scalar_one_or_none()


async def get_all_user_interactions(db: AsyncSession, user_id: int):
    """Dado um id de usuário retorna todos as suas interações com os produtos em estoque"""

    results = await db.execute(
        select(InteractionModel).where(InteractionModel.user_id == user_id)
    )

    return results.scalars().all()


async def get_all_product_interactions(db: AsyncSession, product_id: int):
    """Dado um id de produto retorna todos as interações de usários sobre ele"""

    results = await db.execute(
        select(InteractionModel).where(InteractionModel.product_id == product_id)
    )

    return results.scalars().all()


async def update_interaction(
    db: AsyncSession, user_id: int, product_id: int, data: InteractionUpdate
):
    """Atualiza um registro de interação com as novas ações do usuário coletadas no frontend"""

    # Buscando a interação no BD
    interaction = await get_interaction_by_id(db, user_id, product_id)
    if not interaction:
        return None

    # Atualizando em interaction apenas com os campos enviados em data
    updated_data = data.model_dump(exclude_none=True)
    for key, value in updated_data.items():
        setattr(interaction, key, value)

    # Refletindo essas mudanças no BD
    await db.commit()
    await db.refresh(interaction)
    return interaction


async def delete_interaction(db: AsyncSession, user_id: int, product_id: int):
    """Controller da rota que deleta um prodto da base de dados"""
    interaction = await get_interaction_by_id(db, user_id, product_id)

    if not interaction:
        return None

    await db.delete(interaction)
    await db.commit()

    return interaction

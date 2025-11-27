from models.user import User as UserModel
from schemas.user import UserCreate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def create_user(db: AsyncSession, data: UserCreate):
    """Cria um usuário ou retorna o já existente para o mesmo phone_nmr."""

    # Idempotente: se já existe o número, retorna o usuário existente
    existing = await db.execute(
        select(UserModel).where(UserModel.phone_nmr == data.phone_nmr)
    )
    existing_user = existing.scalar_one_or_none()
    if existing_user:
        return existing_user

    user = UserModel(**data.model_dump())
    db.add(user)

    await db.commit()
    await db.refresh(user)
    return user


async def list_all_users(db: AsyncSession):
    """Controller da rota que retorna todos os produtos da base de dados"""

    user_list = await db.execute(select(UserModel))
    return user_list.scalars().all()


async def get_user_by_id(db: AsyncSession, id: int):
    """Controller da rota que retorna um produto especifico da base de dados"""

    result = await db.execute(select(UserModel).where(UserModel.id == id))
    return result.scalar_one_or_none()


async def delete_user(db: AsyncSession, id: int):
    """Controller da rota que deleta um prodto da base de dados"""
    user = await get_user_by_id(db, id)

    if not user:
        return None

    await db.delete(user)
    await db.commit()

    return user

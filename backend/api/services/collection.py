from models.collection import Collection as CollectionModel
from schemas.collection import CollectionCreate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def create_collection(db: AsyncSession, data: CollectionCreate):
    """Controller da rota que regitra um novo produto na base de dados"""

    collection = CollectionModel(**data.model_dump())
    db.add(collection)

    await db.commit()
    await db.refresh(collection)
    return collection


async def list_all_collections(db: AsyncSession):
    """Controller da rota que retorna todos os produtos da base de dados"""

    collection_list = await db.execute(select(CollectionModel))
    return collection_list.scalars().all()


async def get_collection_by_id(db: AsyncSession, id: int):
    """Controller da rota que retorna um produto especifico da base de dados"""

    result = await db.execute(select(CollectionModel).where(CollectionModel.id == id))
    return result.scalar_one_or_none()


async def delete_collection(db: AsyncSession, id: int):
    """Controller da rota que deleta um prodto da base de dados"""
    collection = await get_collection_by_id(db, id)

    if not collection:
        return None

    await db.delete(collection)
    await db.commit()

    return collection

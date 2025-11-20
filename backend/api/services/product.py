from models.product import Product as ProductModel
from schemas.product import ProductCreate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def create_product(db: AsyncSession, data: ProductCreate):
    """Controller da rota que regitra um novo produto na base de dados"""

    product = ProductModel(**data.model_dump())
    db.add(product)

    await db.commit()
    await db.refresh(product)
    return product


async def list_all_products(db: AsyncSession):
    """Controller da rota que retorna todos os produtos da base de dados"""

    product_list = await db.execute(select(ProductModel))
    return product_list.scalars().all()


async def get_product_by_id(db: AsyncSession, id: int):
    """Controller da rota que retorna um produto especifico da base de dados"""

    result = await db.execute(select(ProductModel).where(ProductModel.id == id))
    return result.scalar_one_or_none()


async def delete_product(db: AsyncSession, id: int):
    """Controller da rota que deleta um prodto da base de dados"""
    product = await get_product_by_id(db, id)

    if not product:
        return None

    await db.delete(product)
    await db.commit()

    return product

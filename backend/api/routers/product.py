from core.bdConnection import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas.product import Product, ProductCreate
from services.product import (
    create_product,
    delete_product,
    get_product_by_id,
    list_all_products,
)
from sqlalchemy.ext.asyncio import AsyncSession

# Criando um router para User
router = APIRouter()


@router.post("/", response_model=Product)
async def create(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    await create_product(db, product)


@router.get("/", response_model=list[Product])
async def read_all(db: AsyncSession = Depends(get_db)):
    products = await list_all_products(db)
    return products


@router.get("/{product_id}", response_model=Product)
async def read(product_id: int, db: AsyncSession = Depends(get_db)):
    product = await get_product_by_id(db, product_id)

    if not product:
        raise HTTPException(404, "prodcuct not found")
    return product


@router.delete("/{product_id}")
async def remove(product_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await delete_product(db, product_id)

    if not deleted:
        raise HTTPException(404, "product not foind")

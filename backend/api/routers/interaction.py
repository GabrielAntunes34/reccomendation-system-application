from core.bdConnection import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas.interaction import Interaction, InteractionCreate
from services.interaction import (
    create_interaction,
    delete_interaction,
    get_all_product_interactions,
    get_all_user_interactions,
    get_interaction_by_id,
    list_all_interactions,
)
from sqlalchemy.ext.asyncio import AsyncSession

# Criando um router para Interaction
router = APIRouter()


@router.post("/", response_model=Interaction)
async def create(interaction: InteractionCreate, db: AsyncSession = Depends(get_db)):
    interaction = await create_interaction(db, interaction)
    return interaction


@router.get("/", response_model=list[Interaction])
async def read_all(db: AsyncSession = Depends(get_db)):
    interactions = await list_all_interactions(db)
    return interactions


@router.get("/{user_id}/{product_id}", response_model=Interaction)
async def read(user_id: int, product_id: int, db: AsyncSession = Depends(get_db)):
    interaction = await get_interaction_by_id(db, user_id, product_id)

    if not interaction:
        raise HTTPException(404, "interaction not found")
    return interaction


@router.get("user/{user_id}", response_model=Interaction)
async def read_from_user(user_id: int, db: AsyncSession = Depends(get_db)):
    interactions = await get_all_user_interactions(db, user_id)

    if not interactions:
        raise HTTPException(404, f"interactions for user {user_id} not found")
    return interactions


@router.get("product/{product_id}", response_model=Interaction)
async def read_from_product(product_id: int, db: AsyncSession = Depends(get_db)):
    interactions = await get_all_product_interactions(db, product_id)

    if not interactions:
        raise HTTPException(404, f"interactions for product {product_id} not found")
    return interactions


@router.delete("/{user_id}/{product_id}")
async def remove(user_id: int, product_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await delete_interaction(db, user_id, product_id)

    if not deleted:
        raise HTTPException(404, "interaction not found")

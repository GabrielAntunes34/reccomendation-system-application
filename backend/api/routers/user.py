from core.bdConnection import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas.user import User, UserCreate
from services.user import (
    create_user,
    delete_user,
    get_user_by_id,
    list_all_users,
)
from sqlalchemy.ext.asyncio import AsyncSession

# Criando um router para User
router = APIRouter()


@router.post("/", response_model=User)
async def create(user: UserCreate, db: AsyncSession = Depends(get_db)):
    product = await create_user(db, user)
    return product


@router.get("/", response_model=list[User])
async def read_all(db: AsyncSession = Depends(get_db)):
    users = await list_all_users(db)
    return users


@router.get("/{user_id}", response_model=User)
async def read(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(404, "prodcuct not found")
    return user


@router.delete("/{user_id}")
async def remove(user_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await delete_user(db, user_id)

    if not deleted:
        raise HTTPException(404, "user not foind")

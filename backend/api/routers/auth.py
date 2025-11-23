from core.bdConnection import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas.auth import LoginRequest, TokenResponse
from services.auth import generate_authentication_token
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    token = await generate_authentication_token(db, credentials)

    if not token:
        raise HTTPException(401, "Invalid credentials")

    return TokenResponse(access_token=token)

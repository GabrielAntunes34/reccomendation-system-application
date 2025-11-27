from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.bdConnection import get_db
from core.security import get_current_user
from schemas.product import Product
from services.recommendation import get_recommendations

router = APIRouter()

@router.get("", response_model=list[Product])

async def recommend(
    product_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    return await get_recommendations(db, user.id, user_session_id=user.session_id, product_id=product_id)
from core.security import create_access_token
from models.user import User as UserModel
from schemas.auth import LoginRequest, TokenResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def generate_authentication_token(db: AsyncSession, credentials: LoginRequest):
    """Dado o número de telefone de um login válido, gera um token de authenticação válido"""

    # Reavendo o usuário da base de dados
    result = await db.execute(
        select(UserModel).where(UserModel.phone_nmr == credentials.phone_nmr)
    )
    user = result.scalar_one_or_none()

    if not user:
        return None

    # Gerando o token
    token = create_access_token({"id": user.id, "phone_nmr": user.phone_nmr})
    return token

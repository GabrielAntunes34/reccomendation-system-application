from datetime import datetime, timedelta, timezone

from core.security import create_access_token
from models.user import User as UserModel
from schemas.auth import LoginRequest
from services.interaction import create_interaction, get_user_last_session_id
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def generate_authentication_token(db: AsyncSession, credentials: LoginRequest):
    """Dado o número de telefone de um login válido, gera um token de autenticação válido"""

    # Reavendo o usuário da base de dados
    result = await db.execute(
        select(UserModel).where(UserModel.phone_nmr == credentials.phone_nmr)
    )
    user = result.scalar_one_or_none()

    if not user:
        return None

    # Obtendo a última sessao e gerando o token
    last_session = await get_user_last_session_id(db, user.id)
    session_id = 1 + last_session

    token = create_access_token(
        {"id": user.id, "session_id": session_id, "phone_nmr": user.phone_nmr}
    )

    return token

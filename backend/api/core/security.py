from datetime import datetime, timedelta, timezone

from core.bdConnection import AsyncSession, get_db
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from models.user import User as UserModel
from passlib.context import CryptContext
from sqlalchemy import select

# Constantes para a criação do token
SECRET_KEY = "chave_secreta_do_ponto_env"
ALGORITHM = "HS256"

ACCESS_EXPIRE_MIN = 0.5

# Parte do protocolo de autenticação proposto
bearer_scheme = HTTPBearer()

# Hash helper
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# IMPORTANTE, ESSA FUNÇÃO PROVAVELMENTE SÓ SERÁ USADA NO FUTURO
def hash_password(password: str) -> str:
    """Retorna o hash de uma senha para ser guardada na base de dados"""

    return pwd_context.hash(password)


def verify_password(password: str, stored_hash: str) -> bool:
    """Dada a senha de um login e o par na base da respectiva conta, verifica se o hash de ambas equivale"""

    return pwd_context.verify(password, stored_hash)


# Cria o token de acesso a autenticação e acesso a sessão do usuário
def create_access_token(payload: dict):
    """usa JWT para criar um token de authorização que verifica o usuario"""

    # Criando o payload final com a data de expisação
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_EXPIRE_MIN)
    payload["exp"] = expire

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# Middleware para verificar se o cliente possui um token de sessão
async def get_current_user(
    db: AsyncSession = Depends(get_db), token=Depends(bearer_scheme)
):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        session_id = payload.get("session_id")

        if not user_id:
            raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")

    user = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = user.scalar_one_or_none()

    if not user:
        raise HTTPException(401, "User not found")
    
    user.session_id = session_id
    return user

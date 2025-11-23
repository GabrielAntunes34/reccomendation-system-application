from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext

# Constantes para a criação do token
SECRET_KEY = "chave_secreta_do_ponto_env"
ALGORITHM = "HS256"


# Hash helper
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# IMPORTANTE, ESSA FUNÇÃO PROVAVELMENTE SÓ SERÁ USADA NO FUTURO
def hash_password(password: str) -> str:
    """Retorna o hash de uma senha para ser guardada na base de dados"""

    return pwd_context.hash(password)


def verify_password(password: str, stored_hash: str) -> bool:
    """Dada a senha de um login e o par na base da respectiva conta, verifica se o hash de ambas equivale"""

    return pwd_context.verify(password, stored_hash)


# IMPORTANTE: FUTURAMENTE É POSSÍVEL ADCIONAR UMA LÓGICA DE EXPIRAÇÃO NO TOKEN
def create_access_token(payload: dict):
    """usa JWT para criar um token de authorização que verifica o usuario"""

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

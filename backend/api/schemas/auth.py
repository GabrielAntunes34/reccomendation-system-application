from pydantic import BaseModel


# Rota dos usuários comuns, sendo reaproveitada no rastreamento da sessão
class LoginRequest(BaseModel):
    phone_nmr: str


# Mais discreta, visando garantir a autorização de rotas críticas (PARA O FUTURO?)
class AdminRequest(BaseModel):
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

from pydantic import BaseModel


class InteractionBase(BaseModel):
    user_id: int
    product_id: int
    session_id: int
    times_viewed: int
    liked: bool
    contacted: bool


class InteractionCreate(InteractionBase):
    """Classe para a criação das interactions em requisições POST"""

    pass


class InteractionUpdate(BaseModel):
    """Classe para a atualização das interactions em requisições PATCH"""

    times_viewed: int | None = None
    liked: bool | None = None
    contacted: bool | None = None


class Interaction(InteractionBase):
    """Classe do tipo Interaction para se conectar com as models do ORM"""

    # Permitindo a leitura do ORM
    class Config:
        from_attributes = True

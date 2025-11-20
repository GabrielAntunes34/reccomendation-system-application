from pydantic import BaseModel, Field


class UserBase(BaseModel):
    """Classe base para definir o tipo User em memória"""

    name: str
    phone_nmr: str


class UserCreate(UserBase):
    """Apenas usado para aciraçao com POST, nao possuindo o campo id"""

    pass


class User(UserBase):
    """Classe do tipo Usuario para ser conectar com as models do ORM"""

    id: int

    # Permitindo que o ORM leia objeto final
    class Config:
        from_attributes = True

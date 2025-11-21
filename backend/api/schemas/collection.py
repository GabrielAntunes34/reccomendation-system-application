from pydantic import BaseModel, Field


# Classe base para definir o tipo User em memória
class CollectionBase(BaseModel):
    name: str
    quantity: int  # Número de itens em uma coleção


class CollectionCreate(CollectionBase):
    """Apenas usado para aciraçao com POST, nao possuindo o campo id"""

    pass


# Classe para ser usada em todos os métodos (por hora :))
class Collection(CollectionBase):
    """Classe do tipo Coleçao para ser conectar com as models do ORM"""

    id: int

    class Config:
        from_attributes = True

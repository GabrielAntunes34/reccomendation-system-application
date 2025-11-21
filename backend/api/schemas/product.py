from typing import List
from typing import Optional

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    """Classe base para definir o tipo User em memória"""

    name: str
    price: float
    color: List[str]
    category: str
    size: str
    description: str
    image: str
    model: str  # nao sei porque isso é um inteiro...
    collection_id: int


class ProductCreate(ProductBase):
    """Classe para a utilização dos produtos em requisições POST"""

    pass


class Product(ProductBase):
    """Classe do tipo Produto para ser conectar com as models do ORM"""

    id: int

    # Permitindo a leitura do ORM
    class Config:
        from_attributes = True


class ProductUpdate(BaseModel):
    """Campos opcionais para atualização parcial"""

    name: Optional[str] = None
    price: Optional[float] = None
    color: Optional[List[str]] = None
    category: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    model: Optional[str] = None
    collection_id: Optional[int] = None

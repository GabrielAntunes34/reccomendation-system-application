from typing import List, Optional

from pydantic import BaseModel


class Color(BaseModel):
    name: str
    hex: str


class ProductBase(BaseModel):
    """Classe base para definir o tipo Product em memória"""

    name: str
    price: float
    color: List[Color]
    category: str
    size: str
    description: str
    image: str
    model: str
    collection_id: int


class ProductCreate(ProductBase):
    """Classe para a utilização dos produtos em requisições POST"""

    pass


class Product(ProductBase):
    """Classe do tipo Produto para ser conectar com as models do ORM"""

    id: int

    class Config:
        from_attributes = True


class ProductUpdate(BaseModel):
    """Campos opcionais para atualização parcial"""

    name: Optional[str] = None
    price: Optional[float] = None
    color: Optional[List[Color]] = None
    category: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    model: Optional[str] = None
    collection_id: Optional[int] = None

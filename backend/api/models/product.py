from core.bdConnection import Base
from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    color = Column(ARRAY(String), nullable=False)
    category = Column(String, nullable=False)
    size = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image = Column(String, nullable=False)
    model = Column(Integer, nullable=False)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=False)

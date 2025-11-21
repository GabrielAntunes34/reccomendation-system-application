from core.bdConnection import Base
from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship


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
    model = Column(String, nullable=False)
    disponible = Column(Boolean, nullable=False, default=True)

    # For the 1-to-many realtionship with Collection
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=False)

    # For the many-to-many relationship with interaction
    interactions = relationship(
        "Interaction", back_populates="product", cascade="all, delete"
    )

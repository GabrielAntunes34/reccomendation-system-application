from core.bdConnection import Base
from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    PrimaryKeyConstraint,
)
from sqlalchemy.orm import relationship


class Interaction(Base):
    __tablename__ = "interactions"

    # Many-to-many relation
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    product_id = Column(
        Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )

    # Definindo os dois ids como a chave primaria
    __table_args__ = (PrimaryKeyConstraint("user_id", "product_id"),)

    # Types of interaction
    times_viewed = Column(Integer, nullable=False, default=0)
    liked = Column(
        Boolean, nullable=False, default=False
    )  # Usuário clicou no botão do coração
    contacted = Column(
        Boolean, nullable=False, default=False
    )  # Usuário tentou comprar o produto!

    # Definindo a relação
    product = relationship("Product", back_populates="interactions")
    user = relationship("User", back_populates="interactions")

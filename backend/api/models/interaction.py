from core.bdConnection import Base
from sqlalchemy import Boolean, Column, ForeignKey, Integer
from sqlalchemy.orm import relationship


class Interaction(Base):
    __tablename__ = "interactions"

    # Relação muitos para muitos
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    session_id = Column(Integer, primary_key=True, nullable=False)

    # Tipos de interação
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

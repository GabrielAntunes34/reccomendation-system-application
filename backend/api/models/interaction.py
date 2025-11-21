from core.bdConnection import Base
from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    PrimaryKeyConstraint,
    String,
)


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
    times_viewd = Column(Integer, nullable=False)
    liked = Column(String, nullable=False)  # User clicked at the heart button
    contacted = Column(Boolean, nullable=False)  # User tried to bought it!

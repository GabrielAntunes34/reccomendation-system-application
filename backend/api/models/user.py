from core.bdConnection import Base
from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone_nmr = Column(String, unique=True, nullable=False)

    # For the many-to-many realstion in interaction
    interactions = relationship(
        "Interaction", back_populates="user", cascade="all, delete"
    )

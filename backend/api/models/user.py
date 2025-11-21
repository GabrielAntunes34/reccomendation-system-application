from core.bdConnection import Base
from sqlalchemy import Column, Integer, String
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

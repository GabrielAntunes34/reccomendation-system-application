from core.bdConnection import Base
from sqlalchemy import Column, Integer, String


class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

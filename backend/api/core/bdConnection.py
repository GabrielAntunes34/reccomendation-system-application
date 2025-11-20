from decouple import config
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Criando a URL que conecta ao banco de dados
# DATABASE_URL = config("postgresql+psycopg://user:pass@localhost:5434/aeldb")
DATABASE_URL = "postgresql+psycopg://user:pass@localhost:5434/aeldb"
# Exemplo:
# postgresql+psycopg2://user:password@localhost:5432/meubanco

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Função auxiliar para gerenciar a conexão com o BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

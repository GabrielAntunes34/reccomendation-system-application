from decouple import config
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

# Criando a URL que conecta ao banco de dados (config esperaria uma variável de ambiente)
# DATABASE_URL = config("postgresql+psycopg://user:pass@localhost:5434/aeldb")
DATABASE_URL = "postgresql+psycopg://user:pass@localhost:5434/aeldb"

# Criando o conector do BD e sua sessão assíncrons
engine = create_async_engine(DATABASE_URL)

AsyncSessionLocal = async_sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

Base = declarative_base()


# Função auxiliar para gerenciar a conexão com o BD nos routers
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

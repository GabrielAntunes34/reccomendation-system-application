from pathlib import Path

# Leitura de variáveis de ambiente (procura .env no diretório backend)
from decouple import AutoConfig
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base


# Base do projeto (backend/)
BASE_DIR = Path(__file__).resolve().parent.parent
config = AutoConfig(search_path=BASE_DIR)

# Monta a URL a partir do .env (ou usa DATABASE_URL diretamente se definido)
db_user = config("POSTGRES_USER", default="user")
db_password = config("POSTGRES_PASSWORD", default="pass")
db_host = config("POSTGRES_HOST", default="localhost")
db_port = config("POSTGRES_PORT", default="5435")
db_name = config("POSTGRES_DB", default="aeldb")

DATABASE_URL = config(
    "DATABASE_URL",
    default=f"postgresql+psycopg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}",
)

# Criando o conector do BD e sua sessão assíncrona
engine = create_async_engine(DATABASE_URL)

AsyncSessionLocal = async_sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

Base = declarative_base()


# Função auxiliar para gerenciar a conexão com o BD nos routers
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

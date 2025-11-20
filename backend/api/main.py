from contextlib import asynccontextmanager

from core.bdConnection import Base, engine
from fastapi import FastAPI
from models import collection, product
from routers.product import router as product_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Executado no startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("== BD INICIALIZADA ==")

    yield  # <-- entrega o controle à aplicação

    # Executado no shutdown (opcional)
    await engine.dispose()
    print("== BD CONECTADA A API ==")


# Instanciando a API
app = FastAPI(
    title="Arte em Laço's recommender Web API", version="1.0.0", lifespan=lifespan
)


# Rotas da API
app.include_router(product_router, prefix="/product", tags=["Products"])

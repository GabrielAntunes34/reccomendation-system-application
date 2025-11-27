from contextlib import asynccontextmanager

from core.bdConnection import Base, engine
from decouple import config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importando as models
from models import collection, product, user
from routers.auth import router as auth_router
from routers.collection import router as collection_router

# Importando os routers
from routers.interaction import router as interaction_router
from routers.product import router as product_router
from routers.user import router as user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Executado no startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("== BD INICIALIZADA ==")

    # Entregando o controle para a aplicação
    yield

    # Executado no shutdown
    await engine.dispose()
    print("== BD DESCONECTADA ==")


# Instanciando a API
app = FastAPI(
    title="Arte em Laço's recommender Web API", version="1.0.0", lifespan=lifespan
)

# Configuração de CORS para permitir o frontend (ajuste via env se precisar)
frontend_origin = config("FRONTEND_ORIGIN", default="http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas da API
app.include_router(user_router, prefix="/users", tags=["User"])
app.include_router(product_router, prefix="/products", tags=["Product"])
app.include_router(collection_router, prefix="/collections", tags=["Collection"])
app.include_router(interaction_router, prefix="/interactions", tags=["Interaction"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

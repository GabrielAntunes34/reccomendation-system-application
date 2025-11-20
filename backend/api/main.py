from core.bdConnection import Base, engine
from fastapi import FastAPI

# from routers.product import product

# Instancia a API e suas dependências
app = FastAPI(title="Arte em Laço's recommender Web API", version="1.0.0")

# criando tabelas das classes que heradm de Base automaticamente
Base.metadata.create_all(bind=engine)


# Rotas da API
@app.get("/")
def welcome():
    return {"message": "IT'S ALIVE!!!!"}

# Recommendation System Application

Trabalho final extensivo da disciplina SCC0284 (Sistemas de Recomendação), com backend FastAPI + Postgres (SQLAlchemy assíncrono) e frontend React. O foco é um recomendador híbrido baseado em sessões com reforço de popularidade e reranqueamento por conteúdo leve (FBC-KNN).

**Integrantes**
- Gabriel Antunes Afonso de Araujo
- Gabriel Barbosa dos Santos

---

## Recomendador em Destaque
- **Sinais**: interações implícitas (view, like, contact) por sessão; só considera produtos `disponible=True`.
- **Score de engajamento**: `1*view + 3*like + 5*contact`.
- **Similaridade de sessão**: Jaccard de conjuntos de produtos com decaimento temporal (`RECENCY_DECAY`), cortando em `TOP_K_NEIGHBORS` e `MAX_SESSIONS_SCAN`.
- **Candidatos**: somatório do peso da sessão vizinha × score de engajamento; pequeno boost de popularidade global (contato > like > view).
- **Conteúdo**: assinatura categórica (categoria, coleção, tamanho, faixa de preço, cores) com Jaccard; usada para rerank e fallback.
- **Re-rank híbrido**: `SESSION_WEIGHT * score_colaborativo + CONTENT_WEIGHT * sim_conteúdo` relativo ao produto âncora (produto em foco ou visto na sessão). Sem candidatos, tenta conteúdo puro; sem contexto, retorna populares.
- **Parâmetros chave**: `W_VIEW/W_LIKE/W_CONTACT`, `SESSION_WEIGHT/CONTENT_WEIGHT`, `RECENCY_DECAY`, `TOP_K_NEIGHBORS`, `MAX_SESSIONS_SCAN`. Endpoint `/recommendations` aceita `product_id` opcional para definir âncora/contexto.

---

## Stack
- Backend: FastAPI, SQLAlchemy (async), PostgreSQL, JWT (python-jose), bcrypt.
- Frontend: React + Vite.
- Infra: Docker Compose (Postgres + pgAdmin).

---

## Como Rodar

### Backend
1) Subir banco e pgAdmin
```bash
cd backend
./start.sh         # carrega .env, sobe docker e cria venv se faltando
docker compose ps  # opcional: verificar containers
```
pgAdmin: http://localhost:5051 (login: admin@example.com / senha: admin123)  
Acesso direto ao banco:
```bash
docker exec -it postgres_sr psql -U $POSTGRES_USER -d $POSTGRES_DB
```

2) Ativar venv e instalar deps (se necessário)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

3) Rodar a API
```bash
cd backend/api
uvicorn main:app --host 0.0.0.0 --port 3000 --reload
```
Docs: http://localhost:3000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
# abre em http://localhost:5173
```

---

## Observações
- Instale novas libs dentro do venv e depois atualize `requirements.txt`:
  ```bash
  pip freeze > requirements.txt
  ```
- Para sair do venv: `deactivate`.

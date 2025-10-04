# reccomendation-system-application

Trabalho final extencionista da disciplina de sistemas de recomendação SCC0284, o qual visa o desenvolvimento de um sistema de recomendação para resolver uma necessidade de uma empresa, ONG ou entidade externa a universidade.

**Integrantes:**

- Gabriel Antunes Afonso de Araujo
- Gabriel Barbosa dos Santos

## Descrição do projeto

## Como rodar

### Backend

- Executar docker
  ```docker compose up -d```
- Verificar se os containers foram criados
  ```docker compose ps```
- Acesso direto ao postgress
  ```docker exec -it postgres_sr psql -U $POSTGRES_USER -d $POSTGRES_DB```

**pgAdmin:**
- Site: [http://localhost:5051/](http://localhost:5051/)
- Login: admin@example.com
- Senha: admin123

- Criar o venv do python
  `python3 -m venv .venv`
- Entrar no venv
  `source .venv/bin/activate`
- Installar as dependencias
  `pip install -r requirements.txt`

**Observações:**

1. Se instalar alguma biblioteca a mais na .venv, após a instalação é necessário jogar seus dados em `requirements`:

`pip freeze > requirements.txt`

2. Para sair do ambiente virtual do python

`deactivate`


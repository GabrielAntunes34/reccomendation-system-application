#!/bin/sh

# Executando o docker
echo "-- DOCKER --"
echo "* Subindo o container..."
docker compose up -d

echo "* Verificando containers criados..."
docker compose ps

echo "-> Concluído!\n"


echo "-- VENV --"
if [ ! -d .venv ]; then
	# Caso o venv não exista, deve-se instalar as dependências
    echo "* Criando o ambiente virtual..."
    python3 -m venv .venv
    source .venv/bin/activate

    echo "* Instalando as dependencias..."
    pip install -r requirements.txt
else
    echo "* .venv já criado"
fi
echo "--> Concluído\n"
echo "Ative o ambiente virtual com source .venv/bin/activate"
#!/usr/bin/env bash

set -euo pipefail

API_ROOT="http://localhost:3000"
BASE_URL="$API_ROOT/products"
COLLECTIONS_URL="$API_ROOT/collections"
COLLECTION_NAMES=("Novidades" "Mais Vendidos" "Ofertas")
COLLECTIONS=() # preenchido dinamicamente abaixo

CATEGORIES=("Vestidos" "Blusas & Camisetas" "Calças & Saias" "Calçados" "Bolsas" "Acessórios")

COLORS=("rosa" "branco" "preto" "azul" "verde" "bege" "vermelho" "jeans azul" "nude")
# mapa nome->hex para backend
declare -A COLOR_HEX=(
  [rosa]="#FFC0CB"
  [branco]="#FFFFFF"
  [preto]="#000000"
  [azul]="#3B82F6"
  [verde]="#22C55E"
  [bege]="#F5E3C3"
  [vermelho]="#EF4444"
  ["jeans azul"]="#4B5563"
  [nude]="#E7D4C0"
)
SIZES_VESTIDOS="PP,P,M,G,GG"
SIZES_BLUSAS="PP,P,M,G,GG"
SIZES_CALCAS="36,38,40,42,44"
SIZES_CALCADOS="34,35,36,37,38,39"
SIZE_UNICO="Único"

DESCS=(
  "Peça versátil para o dia a dia."
  "Estilo casual e confortável."
  "Ótima opção para festas."
  "Modelagem moderna com ótimo caimento."
)

TOTAL=60   # quantos produtos você quer gerar

# Busca ou cria coleções sem causar erro de chave duplicada
ensure_collections() {
  local existing_json
  existing_json=$(curl -s "$COLLECTIONS_URL")

  declare -A COLLECTION_IDS

  for name in "${COLLECTION_NAMES[@]}"; do
    # tenta pegar ID existente pelo nome
    local id
    id=$(JSON_INPUT="$existing_json" python3 - "$name" <<'PY'
import sys, json, os
name = sys.argv[1]
try:
    data = json.loads(os.environ.get("JSON_INPUT") or "[]")
except Exception:
    data = []
for item in data or []:
    if item.get("name") == name:
        print(item.get("id", ""))
        sys.exit(0)
PY
)

    # se não existir, cria
    if [ -z "$id" ]; then
      response=$(curl -s -X POST "$COLLECTIONS_URL" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$name\",\"quantity\":0}" )
      id=$(python3 - <<'PY' <<<"$response"
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get("id", ""))
except Exception:
    sys.exit(1)
PY
)
    fi

    if [ -z "$id" ]; then
      echo "Não foi possível obter/criar a coleção: $name" >&2
      exit 1
    fi

    COLLECTION_IDS["$name"]="$id"
  done

  COLLECTIONS=(
    "${COLLECTION_IDS["Novidades"]}"
    "${COLLECTION_IDS["Mais Vendidos"]}"
    "${COLLECTION_IDS["Ofertas"]}"
  )
}

ensure_collections


# catálogos de imagens por categoria (randomiza entre as opções listadas nos comentários acima)
VESTIDOS_IMAGES=(
  "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=500&fit=crop"
  "https://images.unsplash.com/photo-1596783047904-4000addd05cd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
  "https://images.unsplash.com/photo-1632262049811-86d23941618b?q=80&w=656&auto=format&fit=crop&ixlib=rb-4.1.0"
  "https://plus.unsplash.com/premium_photo-1683134633584-55abb712f9a6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
)
BLUSAS_IMAGES=(
  "https://images.unsplash.com/photo-1623052760790-9605a8579730?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0"
  "https://images.unsplash.com/photo-1685278463760-cd2134ab9d8a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
  "https://plus.unsplash.com/premium_photo-1764107149698-a4e17ad20e03?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0"
)
CALCAS_IMAGES=(
  "https://images.unsplash.com/photo-1646054224885-f978f5798312?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://plus.unsplash.com/premium_photo-1671149028241-8e25ffee90dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://images.unsplash.com/photo-1591948083708-6edc852d7275?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
)
CALCADOS_IMAGES=(
  "https://images.unsplash.com/photo-1737396405960-36862814ee3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://images.unsplash.com/photo-1727561141808-f350b27b5f17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://images.unsplash.com/photo-1590080877777-9dcbf6b5f5b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://plus.unsplash.com/premium_photo-1729788891863-0d9b6f2b453b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
)
BOLSAS_IMAGES=(
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://images.unsplash.com/photo-1711548244653-72219aa9ac27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
)
ACESSORIOS_IMAGES=(
  "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://plus.unsplash.com/premium_photo-1681276170092-446cd1b5b32d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  "https://plus.unsplash.com/premium_photo-1709033404514-c3953af680b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
)

get_image_for_category () {
  local category="$1"
  local imgs
  case "$category" in
    "Vestidos") imgs=("${VESTIDOS_IMAGES[@]}") ;;
    "Blusas & Camisetas") imgs=("${BLUSAS_IMAGES[@]}") ;;
    "Calças & Saias") imgs=("${CALCAS_IMAGES[@]}") ;;
    "Calçados") imgs=("${CALCADOS_IMAGES[@]}") ;;
    "Bolsas") imgs=("${BOLSAS_IMAGES[@]}") ;;
    "Acessórios") imgs=("${ACESSORIOS_IMAGES[@]}") ;;
    *) imgs=("https://loremflickr.com/400/400/girl,fashion") ;;
  esac
  local idx=$((RANDOM % ${#imgs[@]}))
  echo "${imgs[$idx]}"
}


get_size_for_category () {
  local category="$1"
  case "$category" in
    "Vestidos")
      echo "$SIZES_VESTIDOS"
      ;;
    "Blusas & Camisetas")
      echo "$SIZES_BLUSAS"
      ;;
    "Calças & Saias")
      echo "$SIZES_CALCAS"
      ;;
    "Calçados")
      echo "$SIZES_CALCADOS"
      ;;
    "Bolsas"|"Acessórios")
      echo "$SIZE_UNICO"
      ;;
    *)
      echo "$SIZE_UNICO"
      ;;
  esac
}

for ((i=1; i<=TOTAL; i++)); do
  category=${CATEGORIES[$RANDOM % ${#CATEGORIES[@]}]}
  collection_id=${COLLECTIONS[$RANDOM % ${#COLLECTIONS[@]}]}
  color=${COLORS[$RANDOM % ${#COLORS[@]}]}
  hex=${COLOR_HEX[$color]:-#000000}
  desc=${DESCS[$RANDOM % ${#DESCS[@]}]}
  size=$(get_size_for_category "$category")
  image=$(get_image_for_category "$category")

  # monta um nome simples
  name="$category Modelo $i"

  # modelo baseado na categoria
  prefix=$(echo "$category" | cut -c1-4 | tr '[:lower:]' '[:upper:]' | tr 'ÇÃÂÁÀÉÊÍÓÔÕÚÜ ' '-')
  model="${prefix}-$(printf "%03d" $i)"

  # preço aleatório entre 59.90 e 299.90 (ponto decimal garantido)
  price=$(python3 - <<'PY'
import random
print(f"{random.uniform(59.90, 299.90):.2f}")
PY
)

  # monta payload JSON de forma segura
  payload=$(NAME="$name" PRICE="$price" COLOR="$color" HEX="$hex" CATEGORY="$category" SIZE="$size" DESC="$desc" IMAGE="$image" MODEL="$model" COLLECTION="$collection_id" python3 - <<'PY'
import json, os
payload = {
    "name": os.environ["NAME"],
    "price": float(os.environ["PRICE"]),
    "color": [{"name": os.environ["COLOR"], "hex": os.environ["HEX"]}],
    "category": os.environ["CATEGORY"],
    "size": os.environ["SIZE"],
    "description": os.environ["DESC"],
    "image": os.environ["IMAGE"],
    "model": os.environ["MODEL"],
    "collection_id": int(os.environ["COLLECTION"]),
}
print(json.dumps(payload))
PY
)

  response_file=$(mktemp)
  http_code=$(
    curl -s -o "$response_file" -w "%{http_code}" \
      -X POST "$BASE_URL" \
      -H "Content-Type: application/json" \
      -d "$payload"
  )

  if [[ "$http_code" != "200" && "$http_code" != "201" ]]; then
    echo "Falha ao criar produto #$i (HTTP $http_code):"
    cat "$response_file"
    rm -f "$response_file"
    exit 1
  fi

  rm -f "$response_file"
  echo "Criado: $name ($category) – coleção $collection_id"
done

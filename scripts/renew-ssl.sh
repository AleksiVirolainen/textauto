#!/bin/bash
set -euo pipefail

COMPOSE_FILE="docker-compose.prod.yml"

cd "$(dirname "$0")/.."

echo "==> 续签证书..."
sudo docker run --rm \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot renew --quiet

echo "==> 重载 nginx..."
sudo docker compose -f "$COMPOSE_FILE" exec web nginx -s reload || true

echo "续签完成。"

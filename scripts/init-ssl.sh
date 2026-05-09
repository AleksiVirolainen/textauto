#!/bin/bash
set -euo pipefail

DOMAIN="textauto.site"
COMPOSE_FILE="docker-compose.prod.yml"

cd "$(dirname "$0")/.."

echo "==> 1/5 创建证书目录..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

echo "==> 2/5 停止当前 web 容器（释放 80 端口）..."
sudo docker compose -f "$COMPOSE_FILE" stop web || true
sudo docker compose -f "$COMPOSE_FILE" rm -f web || true

echo "==> 3/5 通过 Let's Encrypt 申请证书（standalone 模式）..."
sudo docker run --rm \
  -p 80:80 \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --standalone \
    --register-unsafely-without-email \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" -d "www.$DOMAIN"

echo "==> 4/5 用新的 HTTPS 配置重建 web 镜像..."
sudo docker compose -f "$COMPOSE_FILE" build --no-cache web

echo "==> 5/5 启动 web 容器..."
sudo docker compose -f "$COMPOSE_FILE" up -d web

echo ""
echo "============================================"
echo "  HTTPS 部署完成"
echo "  浏览器访问 https://$DOMAIN 测试"
echo "  HTTP 会自动 301 跳转到 HTTPS"
echo "============================================"

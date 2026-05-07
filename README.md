# Messenger System (V1 Scaffold)

A starter enterprise messenger platform inspired by your target admin UI.

## Tech Stack

- Backend: NestJS (TypeScript)
- Frontend: Vue 3 + Vite + Element Plus + Vue Router + Pinia
- Database: MySQL 8
- Queue/Cache: Redis
- Infra: Docker Compose

## V1 Scope

- Admin login (mock token flow)
- Customer management API and list page
- Message task creation API and list page
- Recipient queue table design for async delivery
- Delivery status fields and retry-ready data model

## Project Structure

```text
messenger-system/
  backend/            # NestJS API
  frontend/           # Vue admin panel
  infra/
    init.sql          # MySQL schema for V1
  docker-compose.yml
```

## Quick Start

1. Start infra:

```bash
docker compose up -d
```

2. Backend:

```bash
cd backend
npm install
npm run start:dev
```

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Default URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MySQL: localhost:3306
- Redis: localhost:6379

## 分享给他人（对方也能用到你这台电脑的后端）

原理：前端请求的接口统一走 **`/api/...`**，由本机 **Vite 开发服务器** 转发到 **`http://127.0.0.1:3000/...`**。你只要把 **`5173` 这一个端口** 用内网穿透暴露出去即可，对方页面上的增删查都会打到**你电脑上正在跑的 Nest**，数据是一致的。

前提：本机同时运行后端 (`npm run start:dev`) 和前端 (`npm run dev`，需能监听 `0.0.0.0`，当前 Vite 已 `host: true`)。

1. 安装并登录任一穿透工具（示例 [ngrok](https://ngrok.com/)）  
2. 在本机开一个隧道，指向前端端口：
   ```bash
   ngrok http 5173
   ```
3. 复制终端里的 **`https://……ngrok……`**（或服务商给你的公网 HTTPS 地址），发给对方浏览器打开。
4. 对方打开后，前端会请求 **`https://你的域名/api/customers`** 等路径，请求经隧道回到你电脑的 Vite，再代理到 **`localhost:3000`**，因此和你在本机操作看到的是同一套后端状态。

若要改为「前端静态部署 + API 单独域名」，在项目根设置环境变量后重新打包前端，例如：`VITE_API_BASE=https://api.example.com`（不要结尾斜杠），此时不再依赖 Vite 代理。

## Next Milestones

- Integrate real SMS channel provider client
- Add JWT + RBAC
- Add async worker for delivery and retry
- Add dashboard metrics and export

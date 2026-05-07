import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

/** 浏览器同源走 /api，由 Vite 转发到本机 Nest，外链分享只需穿透 5173 一个端口 */
const apiProxy = {
  "/api": {
    target: "http://127.0.0.1:3000",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, "")
  }
};

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    // 允许经 ngrok 等穿透访问（否则可能出现 GET / → 403）
    allowedHosts: [".ngrok-free.dev", ".ngrok-free.app", ".ngrok.io"],
    proxy: apiProxy
  },
  preview: {
    host: true,
    port: 4173,
    proxy: apiProxy
  }
});

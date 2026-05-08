import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

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
    allowedHosts: [".ngrok-free.dev", ".ngrok-free.app", ".ngrok.io"],
    proxy: apiProxy
  },
  preview: {
    host: true,
    port: 4173,
    proxy: apiProxy
  },
  build: {
    target: "es2018",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("element-plus") || id.includes("@element-plus")) {
              return "vendor-element";
            }
            if (id.includes("vue-router") || id.includes("/vue/") || id.includes("pinia")) {
              return "vendor-vue";
            }
            if (id.includes("axios")) return "vendor-axios";
            return "vendor";
          }
        }
      }
    }
  }
});

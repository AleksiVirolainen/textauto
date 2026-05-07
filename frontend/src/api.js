import axios from "axios";
import { auth } from "./auth";

/**
 * 默认走相对路径 /api（开发/Vite 代理或同源部署）。
 * 若静态站与 API 不同域，打包前设置环境变量：`VITE_API_BASE=https://你的后端域名`
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE?.trim()
    ? import.meta.env.VITE_API_BASE.replace(/\/$/, "")
    : "/api",
  timeout: 8000
});

client.interceptors.request.use((config) => {
  const token = auth.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.clear();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  login(payload) {
    return client.post("/auth/login", payload).then((r) => r.data);
  },
  listCustomers() {
    return client.get("/customers").then((r) => r.data);
  },
  createCustomer(payload) {
    return client.post("/customers", payload).then((r) => r.data);
  },
  listTasks() {
    return client.get("/tasks").then((r) => r.data);
  },
  createTask(payload) {
    return client.post("/tasks", payload).then((r) => r.data);
  }
};

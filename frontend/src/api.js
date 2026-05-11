import axios from "axios";
import { auth } from "./auth";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE?.trim()
    ? import.meta.env.VITE_API_BASE.replace(/\/$/, "")
    : "/api",
  timeout: 15000
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

  // 短信余额
  listBalances() {
    return client.get("/balances").then((r) => r.data);
  },
  getBalance(username) {
    return client.get(`/balances/${encodeURIComponent(username)}`).then((r) => r.data);
  },
  setBalance(username, balance) {
    return client.put(`/balances/${encodeURIComponent(username)}`, { balance }).then((r) => r.data);
  },

  // 首页任务
  listHomeTasks(username) {
    const params = username ? { username } : {};
    return client.get("/home-tasks", { params }).then((r) => r.data);
  },
  createHomeTask(payload) {
    return client.post("/home-tasks", payload).then((r) => r.data);
  },
  updateHomeTask(id, payload) {
    return client.patch(`/home-tasks/${id}`, payload).then((r) => r.data);
  },
  deleteHomeTask(id) {
    return client.delete(`/home-tasks/${id}`).then((r) => r.data);
  },

  // 通讯录
  listContacts(username) {
    const params = username ? { username } : {};
    return client.get("/address-book", { params }).then((r) => r.data);
  },
  createContact(payload) {
    return client.post("/address-book", payload).then((r) => r.data);
  },
  bulkCreateContacts(payload) {
    return client.post("/address-book/bulk", payload).then((r) => r.data);
  },
  updateContact(id, payload) {
    return client.patch(`/address-book/${id}`, payload).then((r) => r.data);
  },
  deleteContact(id) {
    return client.delete(`/address-book/${id}`).then((r) => r.data);
  },
  clearContacts(username) {
    return client.delete(`/address-book/user/${encodeURIComponent(username)}`).then((r) => r.data);
  },

  // 投放任务（按节奏自动加联系人）
  listCampaigns() {
    return client.get("/campaigns").then((r) => r.data);
  },
  getCampaign(id) {
    return client.get(`/campaigns/${id}`).then((r) => r.data);
  },
  createCampaign(payload) {
    return client.post("/campaigns", payload).then((r) => r.data);
  },
  pauseCampaign(id) {
    return client.post(`/campaigns/${id}/pause`).then((r) => r.data);
  },
  resumeCampaign(id) {
    return client.post(`/campaigns/${id}/resume`).then((r) => r.data);
  },
  cancelCampaign(id) {
    return client.post(`/campaigns/${id}/cancel`).then((r) => r.data);
  },
  deleteCampaign(id) {
    return client.delete(`/campaigns/${id}`).then((r) => r.data);
  }
};

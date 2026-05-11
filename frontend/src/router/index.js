import { createRouter, createWebHistory } from "vue-router";
import AdminPage from "../views/AdminPage.vue";
import AppCenterPage from "../views/AppCenterPage.vue";
import ContactsPage from "../views/ContactsPage.vue";
import CustomersPage from "../views/CustomersPage.vue";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import SecurityPage from "../views/SecurityPage.vue";
import SubscriptionsPage from "../views/SubscriptionsPage.vue";
import SystemPage from "../views/SystemPage.vue";
import TasksPage from "../views/TasksPage.vue";
import ValueAddedPage from "../views/ValueAddedPage.vue";
import { auth } from "../auth";

const routes = [
  { path: "/login", component: LoginPage, meta: { public: true } },
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomePage },
  { path: "/send-messages", component: TasksPage },
  { path: "/subscriptions", component: SubscriptionsPage },
  { path: "/value-added", component: ValueAddedPage },
  { path: "/app", component: AppCenterPage },
  { path: "/customers", component: CustomersPage },
  { path: "/contacts", component: ContactsPage },
  { path: "/system", component: SystemPage },
  { path: "/security", component: SecurityPage },
  { path: "/admin", component: AdminPage, meta: { adminOnly: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  if (to.meta.public) {
    if (to.path === "/login" && auth.isLoggedIn()) {
      return { path: "/home" };
    }
    return true;
  }
  if (!auth.isLoggedIn()) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
  if (to.meta.adminOnly && auth.state.user?.role !== "admin") {
    return { path: "/home" };
  }
  return true;
});

export default router;

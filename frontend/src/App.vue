<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth } from "./auth";

const route = useRoute();
const router = useRouter();
const showLayout = computed(() => !route.meta.public);
const username = computed(() => auth.state.user?.username || "用户");

function logout() {
  auth.clear();
  router.replace("/login");
}
</script>

<template>
  <div v-if="showLayout" class="layout">
    <aside class="sidebar">
      <div class="sidebar-title">
        <span class="logo-badge">◉</span>
        <span>企业信使</span>
      </div>
      <el-menu
        :default-active="$route.path"
        :default-openeds="['message', 'customer', 'admin']"
        background-color="#1f2a3d"
        text-color="#d8deea"
        active-text-color="#4ea1ff"
        router
      >
        <el-menu-item index="/home">
          <span class="menu-dot"></span>
          首页
        </el-menu-item>
        <el-sub-menu index="message">
          <template #title>
            <span class="menu-dot"></span>
            消息中心
          </template>
          <el-menu-item index="/send-messages">发短信</el-menu-item>
          <el-menu-item index="/subscriptions">订阅短信</el-menu-item>
          <el-menu-item index="/value-added">增值信使</el-menu-item>
          <el-menu-item index="/app">APP</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="customer">
          <template #title>
            <span class="menu-dot"></span>
            客户中心
          </template>
          <el-menu-item index="/customers">客户管理</el-menu-item>
          <el-menu-item index="/contacts">通讯录</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="admin">
          <template #title>
            <span class="menu-dot"></span>
            平台配置
          </template>
          <el-menu-item index="/system">系统管理</el-menu-item>
          <el-menu-item index="/security">信息安全策略</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>
    <main class="main">
      <header class="topbar">
        <div class="topbar-title">企业信息服务平台</div>
        <div class="topbar-user">
          <span>欢迎你，{{ username }}</span>
          <el-button link type="primary" @click="logout">退出</el-button>
        </div>
      </header>
      <router-view />
    </main>
  </div>
  <router-view v-else />
</template>

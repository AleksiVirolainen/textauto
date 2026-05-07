<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { api } from "../api";
import { auth } from "../auth";

const router = useRouter();
const loading = ref(false);
const form = ref({
  username: "",
  password: ""
});

async function submit() {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }
  loading.value = true;
  try {
    const result = await api.login(form.value);
    auth.setSession(result.token, result.user);
    const redirect = router.currentRoute.value.query.redirect;
    router.replace(typeof redirect === "string" && redirect ? redirect : "/home");
  } catch (error) {
    const message = error?.response?.data?.message || "登录失败，请稍后重试";
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <span class="logo-badge">◉</span>
        <span>企业信使系统</span>
      </div>
      <div class="login-subtitle">请登录以继续访问平台</div>
      <el-form @submit.prevent="submit" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="如 admin" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
            show-password
            @keyup.enter="submit"
          />
        </el-form-item>
        <el-button type="primary" :loading="loading" class="login-button" @click="submit">
          登录
        </el-button>
      </el-form>
      <div class="login-tip">默认账号：admin / admin123</div>
    </div>
  </div>
</template>

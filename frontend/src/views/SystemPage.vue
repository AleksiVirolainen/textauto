<script setup>
import { ref } from "vue";

const users = ref([
  { username: "admin", role: "超级管理员", status: "启用", lastLogin: "2026-05-01 17:10:20" },
  { username: "operator01", role: "运营", status: "启用", lastLogin: "2026-05-01 16:42:09" }
]);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>系统管理</h3>
      <el-button type="primary">新增账号</el-button>
    </div>
    <el-table :data="users">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="lastLogin" label="最后登录" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button link type="primary">权限</el-button>
          <el-button link>重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

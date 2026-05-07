<script setup>
import { ref } from "vue";

const strategies = ref([
  { name: "同手机号频控", rule: "60秒内最多1条", status: "启用", updatedAt: "2026-05-01 10:00:00" },
  { name: "敏感词过滤", rule: "命中后拦截并审计", status: "启用", updatedAt: "2026-05-01 09:20:00" }
]);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>信息安全策略</h3>
      <el-button type="primary">新增策略</el-button>
    </div>
    <el-table :data="strategies">
      <el-table-column prop="name" label="策略名称" />
      <el-table-column prop="rule" label="规则" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="updatedAt" label="更新时间" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button link type="primary">编辑</el-button>
          <el-button link>查看日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

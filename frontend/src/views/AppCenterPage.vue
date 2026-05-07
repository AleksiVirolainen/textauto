<script setup>
import { ref } from "vue";

const clients = ref([
  { appId: "APP-001", appName: "客户门户", platform: "iOS/Android", pushStatus: "已启用", version: "1.5.0" }
]);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>APP</h3>
      <el-button type="primary">新增应用</el-button>
    </div>
    <el-table :data="clients">
      <el-table-column prop="appId" label="AppID" />
      <el-table-column prop="appName" label="应用名" />
      <el-table-column prop="platform" label="平台" />
      <el-table-column prop="pushStatus" label="推送状态" />
      <el-table-column prop="version" label="当前版本" width="120" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button link type="primary">配置</el-button>
          <el-button link>日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

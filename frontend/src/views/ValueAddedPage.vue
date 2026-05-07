<script setup>
import { ref } from "vue";

const products = ref([
  { code: "VAS001", name: "国际短信包", price: "0.38/条", status: "上架", updatedAt: "2026-05-01 09:30:00" },
  { code: "VAS002", name: "语音通知", price: "0.25/次", status: "上架", updatedAt: "2026-05-01 11:10:00" }
]);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>增值信使</h3>
      <el-button type="primary">新增服务</el-button>
    </div>
    <el-table :data="products">
      <el-table-column prop="code" label="服务编码" />
      <el-table-column prop="name" label="服务名称" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="updatedAt" label="更新时间" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button link type="primary">编辑</el-button>
          <el-button link>下架</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

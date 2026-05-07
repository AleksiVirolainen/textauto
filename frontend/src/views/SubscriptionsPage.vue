<script setup>
import { ref } from "vue";

const rows = ref([
  { id: 1, name: "会员到期提醒", cycle: "每天 10:00", status: "启用", lastRun: "2026-05-01 10:00:00" }
]);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>订阅短信</h3>
      <el-button type="primary">新建订阅</el-button>
    </div>
    <el-form :inline="true">
      <el-form-item label="任务名">
        <el-input placeholder="请输入任务名" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select style="width: 120px">
          <el-option label="全部" value="all" />
          <el-option label="启用" value="enabled" />
          <el-option label="停用" value="disabled" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="rows">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="订阅任务" />
      <el-table-column prop="cycle" label="触发周期" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="lastRun" label="最近执行时间" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button link type="primary">编辑</el-button>
          <el-button link>停用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

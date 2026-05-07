<script setup>
import { ref } from "vue";

const contacts = ref([
  { id: 1, name: "王明", phone: "13900000001", group: "VIP客户", tags: "高价值" },
  { id: 2, name: "刘洁", phone: "13900000002", group: "普通客户", tags: "活跃" }
]);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>通讯录</h3>
      <div>
        <el-button>导入</el-button>
        <el-button type="primary">新增联系人</el-button>
      </div>
    </div>
    <el-form :inline="true">
      <el-form-item label="姓名">
        <el-input placeholder="联系人姓名" />
      </el-form-item>
      <el-form-item label="分组">
        <el-input placeholder="如 VIP客户" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="contacts">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="group" label="分组" />
      <el-table-column prop="tags" label="标签" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button link type="primary">编辑</el-button>
          <el-button link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

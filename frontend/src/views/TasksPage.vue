<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api";

const tasks = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const form = ref({
  taskName: "",
  customerCode: "",
  channel: "sms",
  content: "",
  scheduleTime: ""
});

async function load() {
  loading.value = true;
  try {
    tasks.value = await api.listTasks();
  } finally {
    loading.value = false;
  }
}

async function createTask() {
  const payload = { ...form.value };
  if (!payload.scheduleTime) {
    delete payload.scheduleTime;
  }
  await api.createTask(payload);
  dialogVisible.value = false;
  form.value = {
    taskName: "",
    customerCode: "",
    channel: "sms",
    content: "",
    scheduleTime: ""
  };
  await load();
}

onMounted(load);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>发送任务</h3>
      <el-button type="primary" @click="dialogVisible = true">新建任务</el-button>
    </div>

    <el-table :data="tasks" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="任务ID" width="90" />
      <el-table-column prop="taskName" label="任务名称" />
      <el-table-column prop="customerCode" label="客户编号" />
      <el-table-column prop="channel" label="通道" width="100" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="createdAt" label="创建时间" />
    </el-table>

    <el-dialog v-model="dialogVisible" title="新建发送任务" width="620">
      <el-form label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="form.taskName" />
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input v-model="form.customerCode" placeholder="如 CUST001" />
        </el-form-item>
        <el-form-item label="通道">
          <el-select v-model="form.channel">
            <el-option label="短信" value="sms" />
            <el-option label="站内信" value="internal" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送内容">
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="定时时间">
          <el-input v-model="form.scheduleTime" placeholder="YYYY-MM-DD HH:mm:ss (可选)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createTask">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

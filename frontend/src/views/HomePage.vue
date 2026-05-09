<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { auth } from "../auth";
import { api } from "../api";

const route = useRoute();

const query = ref({
  status: "全部",
  keyword: "",
  content: ""
});

const rows = ref([]);
const loading = ref(false);

async function load() {
  const u = auth.state.user?.username;
  if (!u) {
    rows.value = [];
    return;
  }
  loading.value = true;
  try {
    rows.value = await api.listHomeTasks(u);
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => auth.state.user?.username, load);
watch(() => route.fullPath, () => {
  if (route.path === "/home") load();
});

const filteredRows = computed(() =>
  rows.value.filter((item) => {
    if (query.value.status !== "全部" && item.status !== query.value.status) {
      return false;
    }
    if (query.value.keyword && !String(item.taskId || "").includes(query.value.keyword)) {
      return false;
    }
    if (query.value.content && !String(item.content || "").includes(query.value.content)) {
      return false;
    }
    return true;
  })
);
</script>

<template>
  <div class="panel">
    <div class="page-title">我的已完成</div>

    <el-form :inline="true" @submit.prevent>
      <el-form-item label="任务状态">
        <el-select v-model="query.status" style="width: 120px">
          <el-option label="全部" value="全部" />
          <el-option label="成功" value="成功" />
          <el-option label="失败" value="失败" />
        </el-select>
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="query.keyword" placeholder="任务编号" style="width: 150px" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="query.content" placeholder="短信内容关键词" style="width: 220px" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-input placeholder="2026-05-07 00:00:00" style="width: 190px" />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-input placeholder="2026-05-07 23:59:59" style="width: 190px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
        <el-button>导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="filteredRows" v-loading="loading" style="width: 100%">
      <el-table-column prop="taskId" label="任务ID" width="120" />
      <el-table-column prop="customerAccount" label="客户账号" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="reportCount" label="号码数" width="100" />
      <el-table-column prop="meteringCount" label="计费数" width="100" />
      <el-table-column prop="submitTime" label="提交时间" />
      <el-table-column prop="sendTime" label="发送时间" />
      <el-table-column prop="content" label="发送内容(双击复制)" />
      <el-table-column prop="action" label="操作" width="100" />
      <template #empty>
        <el-empty description="暂无任务" />
      </template>
    </el-table>
  </div>
</template>

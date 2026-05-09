<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { auth } from "../auth";
import { api } from "../api";

const route = useRoute();

const contacts = ref([]);
const loading = ref(false);

async function load() {
  const u = auth.state.user?.username;
  if (!u) {
    contacts.value = [];
    return;
  }
  loading.value = true;
  try {
    contacts.value = await api.listContacts(u);
  } catch {
    contacts.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => auth.state.user?.username, load);
watch(() => route.fullPath, () => {
  if (route.path === "/contacts") load();
});

const tableRows = computed(() =>
  contacts.value.map((row, index) => ({
    rowNo: index + 1,
    name: row.name ?? "",
    phone: row.phone,
    groupName: row.groupName ?? "",
    tags: row.tags ?? "",
    op: row.op ?? ""
  }))
);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>通讯录</h3>
    </div>
    <el-form :inline="true">
      <el-form-item label="姓名">
        <el-input placeholder="联系人姓名" />
      </el-form-item>
      <el-form-item label="分组">
        <el-input placeholder="如 VIP客户" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableRows" v-loading="loading">
      <el-table-column prop="rowNo" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="groupName" label="分组" />
      <el-table-column prop="tags" label="标签" />
      <el-table-column prop="op" label="操作" width="120" />
      <template #empty>
        <el-empty description="暂无联系人" />
      </template>
    </el-table>
  </div>
</template>

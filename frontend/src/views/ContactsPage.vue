<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
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

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function todayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function downloadContacts() {
  if (tableRows.value.length === 0) {
    ElMessage.warning("通讯录为空，没有可下载的内容");
    return;
  }
  const header = ["序号", "姓名", "手机号", "分组", "标签", "操作"];
  const lines = [header.join(",")];
  for (const row of tableRows.value) {
    lines.push(
      [row.rowNo, row.name, row.phone, row.groupName, row.tags, row.op]
        .map(csvEscape)
        .join(",")
    );
  }
  // UTF-8 BOM 让 Excel/WPS 正确识别中文
  const bom = "\uFEFF";
  const blob = new Blob([bom + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;"
  });
  const username = auth.state.user?.username || "user";
  const filename = `通讯录_${username}_${todayString()}.csv`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  ElMessage.success(`已下载 ${tableRows.value.length} 条联系人`);
}
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>通讯录</h3>
      <div>
        <el-button type="primary" :disabled="tableRows.length === 0" @click="downloadContacts">
          下载通讯录
        </el-button>
        <el-button @click="load">刷新</el-button>
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

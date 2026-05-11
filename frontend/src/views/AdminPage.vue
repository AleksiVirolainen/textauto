<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { api } from "../api";
import RevenueAdminPanel from "../components/RevenueAdminPanel.vue";

const knownAccounts = [
  "13057799720",
  "15058303899",
  "19157997572",
  "15957736312",
  "operator"
];

const tab = ref("balance");
const targetUser = ref(knownAccounts[0]);

// ---------------- 短信余额 ----------------
const balanceForm = ref({ balance: 0 });
const balanceLoading = ref(false);
const balanceList = ref([]);

async function refreshBalance() {
  balanceLoading.value = true;
  try {
    const data = await api.getBalance(targetUser.value);
    balanceForm.value.balance = Number(data?.balance ?? 0);
    balanceList.value = await api.listBalances();
  } finally {
    balanceLoading.value = false;
  }
}

async function saveBalance() {
  await api.setBalance(targetUser.value, Number(balanceForm.value.balance));
  ElMessage.success("余额已保存");
  await refreshBalance();
}

// ---------------- 首页任务 ----------------
const tasks = ref([]);
const taskLoading = ref(false);
const taskDialog = ref(false);
const taskForm = ref(emptyTask());

function emptyTask() {
  return {
    id: null,
    taskId: "",
    customerAccount: targetUser.value,
    status: "成功",
    reportCount: 0,
    meteringCount: 0,
    submitTime: "",
    sendTime: "",
    content: ""
  };
}

async function refreshTasks() {
  taskLoading.value = true;
  try {
    tasks.value = await api.listHomeTasks(targetUser.value);
  } finally {
    taskLoading.value = false;
  }
}

function openCreateTask() {
  taskForm.value = emptyTask();
  taskForm.value.customerAccount = targetUser.value;
  const today = new Date();
  const date = today.toISOString().slice(0, 10);
  taskForm.value.submitTime = `${date} 10:00:00`;
  taskForm.value.sendTime = `${date} 10:01:30`;
  taskForm.value.taskId = "T" + date.replace(/-/g, "") + "001";
  taskDialog.value = true;
}

function openEditTask(row) {
  taskForm.value = { ...row };
  taskDialog.value = true;
}

async function saveTask() {
  const payload = {
    username: targetUser.value,
    taskId: taskForm.value.taskId,
    customerAccount: taskForm.value.customerAccount || targetUser.value,
    status: taskForm.value.status,
    reportCount: Number(taskForm.value.reportCount) || 0,
    meteringCount: Number(taskForm.value.meteringCount) || 0,
    submitTime: taskForm.value.submitTime,
    sendTime: taskForm.value.sendTime || "-",
    content: taskForm.value.content
  };
  if (taskForm.value.id) {
    await api.updateHomeTask(taskForm.value.id, payload);
  } else {
    await api.createHomeTask(payload);
  }
  ElMessage.success("已保存");
  taskDialog.value = false;
  await refreshTasks();
}

async function deleteTask(row) {
  await ElMessageBox.confirm(`删除任务 ${row.taskId}？`, "提示", { type: "warning" });
  await api.deleteHomeTask(row.id);
  ElMessage.success("已删除");
  await refreshTasks();
}

// ---------------- 通讯录 ----------------
const contacts = ref([]);
const contactLoading = ref(false);
const bulkDialog = ref(false);
const bulkForm = ref({
  groupName: "农业银行",
  op: "",
  defaultTags: "1",
  replace: false,
  text: ""
});

async function refreshContacts() {
  contactLoading.value = true;
  try {
    contacts.value = await api.listContacts(targetUser.value);
  } finally {
    contactLoading.value = false;
  }
}

async function deleteContact(row) {
  await ElMessageBox.confirm(`删除手机号 ${row.phone}？`, "提示", { type: "warning" });
  await api.deleteContact(row.id);
  ElMessage.success("已删除");
  await refreshContacts();
}

async function clearAllContacts() {
  await ElMessageBox.confirm(`清空 ${targetUser.value} 的全部联系人？`, "危险操作", {
    type: "warning",
    confirmButtonText: "确定清空"
  });
  await api.clearContacts(targetUser.value);
  ElMessage.success("已清空");
  await refreshContacts();
}

function openBulk() {
  bulkForm.value = {
    groupName: "农业银行",
    op: "",
    defaultTags: "1",
    replace: false,
    text: ""
  };
  bulkDialog.value = true;
}

function parseBulkText(text, defaults) {
  const lines = text.split(/\r?\n/);
  const items = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split(/[,\t，；; ]+/).map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) continue;
    const phone = parts[0];
    if (!/^\d{6,}$/.test(phone)) continue;
    items.push({
      phone,
      tags: parts[1] ?? defaults.defaultTags ?? "",
      groupName: parts[2] ?? defaults.groupName ?? "",
      op: parts[3] ?? defaults.op ?? "",
      name: ""
    });
  }
  return items;
}

const previewItems = computed(() => parseBulkText(bulkForm.value.text, bulkForm.value));

async function submitBulk() {
  const items = previewItems.value;
  if (items.length === 0) {
    ElMessage.warning("没有解析到任何手机号");
    return;
  }
  await api.bulkCreateContacts({
    username: targetUser.value,
    replace: bulkForm.value.replace,
    items
  });
  ElMessage.success(`成功导入 ${items.length} 条`);
  bulkDialog.value = false;
  await refreshContacts();
}

// ---------------- 投放任务（定时加联系人）----------------
const campaigns = ref([]);
const campaignLoading = ref(false);
const campaignDialog = ref(false);
const campaignForm = ref(emptyCampaign());
let campaignTimer = null;

function emptyCampaign() {
  return {
    title: "",
    ratePerHourMin: 2,
    ratePerHourMax: 3,
    workHourStart: 9,
    workHourEnd: 22,
    defaultGroupName: "农业银行",
    defaultTags: "1",
    defaultOp: "",
    text: ""
  };
}

async function refreshCampaigns() {
  campaignLoading.value = true;
  try {
    campaigns.value = await api.listCampaigns();
  } finally {
    campaignLoading.value = false;
  }
}

function openCreateCampaign() {
  campaignForm.value = emptyCampaign();
  campaignForm.value.defaultOp = todayShort();
  campaignDialog.value = true;
}

function todayShort() {
  const d = new Date();
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

const campaignPreview = computed(() => {
  const lines = campaignForm.value.text.split(/\r?\n/);
  let n = 0;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const phone = line.split(/[,\t，；; ]+/)[0]?.trim() ?? "";
    if (/^\d{6,}$/.test(phone)) n += 1;
  }
  return n;
});

const campaignEtaHours = computed(() => {
  if (campaignPreview.value === 0) return 0;
  const avgRate = (campaignForm.value.ratePerHourMin + campaignForm.value.ratePerHourMax) / 2;
  if (avgRate <= 0) return 0;
  return Math.ceil(campaignPreview.value / avgRate);
});

async function submitCampaign() {
  if (campaignPreview.value === 0) {
    ElMessage.warning("没有解析到任何手机号");
    return;
  }
  if (campaignForm.value.ratePerHourMin > campaignForm.value.ratePerHourMax) {
    ElMessage.warning("每小时下限不能大于上限");
    return;
  }
  await api.createCampaign({
    username: targetUser.value,
    title: campaignForm.value.title,
    ratePerHourMin: Number(campaignForm.value.ratePerHourMin),
    ratePerHourMax: Number(campaignForm.value.ratePerHourMax),
    workHourStart: Number(campaignForm.value.workHourStart),
    workHourEnd: Number(campaignForm.value.workHourEnd),
    defaultGroupName: campaignForm.value.defaultGroupName,
    defaultTags: campaignForm.value.defaultTags,
    defaultOp: campaignForm.value.defaultOp,
    text: campaignForm.value.text
  });
  ElMessage.success(`已创建投放任务（${campaignPreview.value} 条，预计 ${campaignEtaHours.value} 小时跑完）`);
  campaignDialog.value = false;
  await refreshCampaigns();
}

async function pauseCampaign(row) {
  await api.pauseCampaign(row.id);
  await refreshCampaigns();
}
async function resumeCampaign(row) {
  await api.resumeCampaign(row.id);
  await refreshCampaigns();
}
async function cancelCampaign(row) {
  await ElMessageBox.confirm("取消任务后剩余号码不再投放，确定？", "提示", { type: "warning" });
  await api.cancelCampaign(row.id);
  await refreshCampaigns();
}
async function deleteCampaign(row) {
  await ElMessageBox.confirm("删除任务及全部投放记录，确定？", "危险操作", {
    type: "warning",
    confirmButtonText: "确定删除"
  });
  await api.deleteCampaign(row.id);
  ElMessage.success("已删除");
  await refreshCampaigns();
}

function campaignStatusText(s) {
  return { running: "进行中", paused: "已暂停", done: "已完成", canceled: "已取消" }[s] || s;
}
function campaignStatusType(s) {
  return { running: "success", paused: "warning", done: "info", canceled: "danger" }[s] || "";
}
function formatTime(t) {
  return t ? new Date(t).toLocaleString() : "-";
}

// ---------------- 切换用户/Tab 时联动刷新 ----------------
async function refreshAll() {
  await Promise.all([refreshBalance(), refreshTasks(), refreshContacts(), refreshCampaigns()]);
}

onMounted(() => {
  refreshAll();
  campaignTimer = setInterval(refreshCampaigns, 30_000);
});

onBeforeUnmount(() => {
  if (campaignTimer) clearInterval(campaignTimer);
});

watch(targetUser, refreshAll);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>管理后台</h3>
      <div>
        当前操作账号：
        <el-select v-model="targetUser" filterable allow-create style="width: 200px">
          <el-option v-for="u in knownAccounts" :key="u" :label="u" :value="u" />
        </el-select>
      </div>
    </div>

    <el-tabs v-model="tab">
      <!-- 余额 -->
      <el-tab-pane label="短信余额" name="balance">
        <el-form :inline="true" v-loading="balanceLoading">
          <el-form-item :label="`账号 ${targetUser} 的余额`">
            <el-input-number
              v-model="balanceForm.balance"
              :min="0"
              :step="1000"
              style="width: 200px"
            />
            <span style="margin-left: 8px;">条</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveBalance">保存余额</el-button>
            <el-button @click="refreshBalance">刷新</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="balanceList" style="width: 100%; max-width: 600px;">
          <el-table-column prop="username" label="账号" />
          <el-table-column prop="balance" label="余额(条)">
            <template #default="{ row }">{{ Number(row.balance).toLocaleString() }}</template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="更新时间">
            <template #default="{ row }">
              {{ row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-" }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 任务 -->
      <el-tab-pane label="首页任务" name="tasks">
        <div style="margin-bottom: 12px;">
          <el-button type="primary" @click="openCreateTask">新增任务</el-button>
          <el-button @click="refreshTasks">刷新</el-button>
        </div>
        <el-table :data="tasks" v-loading="taskLoading">
          <el-table-column prop="taskId" label="任务ID" width="140" />
          <el-table-column prop="customerAccount" label="客户账号" width="140" />
          <el-table-column prop="status" label="状态" width="80" />
          <el-table-column prop="reportCount" label="号码数" width="90" />
          <el-table-column prop="meteringCount" label="计费数" width="90" />
          <el-table-column prop="submitTime" label="提交时间" width="170" />
          <el-table-column prop="sendTime" label="发送时间" width="170" />
          <el-table-column prop="content" label="发送内容" show-overflow-tooltip />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEditTask(row)">编辑</el-button>
              <el-button link type="danger" @click="deleteTask(row)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无任务" />
          </template>
        </el-table>
      </el-tab-pane>

      <!-- 投放任务 -->
      <el-tab-pane label="投放任务" name="campaigns">
        <div style="margin-bottom: 12px;">
          <el-button type="primary" @click="openCreateCampaign">新建投放任务</el-button>
          <el-button @click="refreshCampaigns">刷新</el-button>
          <span style="margin-left: 12px; color: #888;">
            自动按设定的节奏给通讯录加号码（默认 9:00 ~ 22:00 才跑）
          </span>
        </div>
        <el-table :data="campaigns" v-loading="campaignLoading" max-height="600">
          <el-table-column prop="id" label="#" width="60" />
          <el-table-column prop="username" label="目标账号" width="130" />
          <el-table-column prop="title" label="标题" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="campaignStatusType(row.status)">
                {{ campaignStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="进度" width="160">
            <template #default="{ row }">
              {{ row.insertedCount }} / {{ row.totalCount }}
              <span v-if="row.failedCount" style="color:#f56c6c;">（失败 {{ row.failedCount }}）</span>
            </template>
          </el-table-column>
          <el-table-column label="速率/小时" width="100">
            <template #default="{ row }">{{ row.ratePerHourMin }}~{{ row.ratePerHourMax }}</template>
          </el-table-column>
          <el-table-column label="工作时段" width="110">
            <template #default="{ row }">{{ row.workHourStart }}:00 ~ {{ row.workHourEnd }}:00</template>
          </el-table-column>
          <el-table-column label="上次投放" width="170">
            <template #default="{ row }">{{ formatTime(row.lastInsertedAt) }}</template>
          </el-table-column>
          <el-table-column label="下次投放" width="170">
            <template #default="{ row }">{{ formatTime(row.nextScheduledAt) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-button v-if="row.status === 'running'" link type="warning" @click="pauseCampaign(row)">暂停</el-button>
              <el-button v-if="row.status === 'paused'" link type="success" @click="resumeCampaign(row)">继续</el-button>
              <el-button
                v-if="['running','paused'].includes(row.status)"
                link
                type="danger"
                @click="cancelCampaign(row)"
              >取消</el-button>
              <el-button link type="danger" @click="deleteCampaign(row)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无投放任务" />
          </template>
        </el-table>
      </el-tab-pane>

      <!-- 通讯录 -->
      <el-tab-pane label="通讯录" name="contacts">
        <div style="margin-bottom: 12px;">
          <el-button type="primary" @click="openBulk">批量粘贴导入</el-button>
          <el-button @click="refreshContacts">刷新</el-button>
          <el-button type="danger" plain @click="clearAllContacts">清空当前账号联系人</el-button>
          <span style="margin-left: 12px; color: #888;">
            共 {{ contacts.length }} 条
          </span>
        </div>
        <el-table :data="contacts" v-loading="contactLoading" max-height="600">
          <el-table-column type="index" label="序号" width="70" />
          <el-table-column prop="phone" label="手机号" width="160" />
          <el-table-column prop="groupName" label="分组" width="160" />
          <el-table-column prop="tags" label="标签" width="100" />
          <el-table-column prop="op" label="操作内容" width="120" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link type="danger" @click="deleteContact(row)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无联系人" />
          </template>
        </el-table>
      </el-tab-pane>

      <!-- 营收识别 -->
      <el-tab-pane label="营收识别" name="revenues">
        <RevenueAdminPanel :default-point-name="targetUser" />
      </el-tab-pane>
    </el-tabs>

    <!-- 任务编辑对话框 -->
    <el-dialog v-model="taskDialog" :title="taskForm.id ? '编辑任务' : '新增任务'" width="640px">
      <el-form label-position="top">
        <el-form-item label="任务ID">
          <el-input v-model="taskForm.taskId" />
        </el-form-item>
        <el-form-item label="客户账号">
          <el-input v-model="taskForm.customerAccount" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="taskForm.status" style="width: 100%">
            <el-option label="成功" value="成功" />
            <el-option label="失败" value="失败" />
            <el-option label="进行中" value="进行中" />
          </el-select>
        </el-form-item>
        <el-form-item label="号码数">
          <el-input-number v-model="taskForm.reportCount" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="计费数">
          <el-input-number v-model="taskForm.meteringCount" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-input v-model="taskForm.submitTime" placeholder="2026-05-09 10:00:00" />
        </el-form-item>
        <el-form-item label="发送时间">
          <el-input v-model="taskForm.sendTime" placeholder="2026-05-09 10:01:30" />
        </el-form-item>
        <el-form-item label="发送内容">
          <el-input v-model="taskForm.content" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="taskDialog = false">取消</el-button>
        <el-button type="primary" @click="saveTask">保存</el-button>
      </template>
    </el-dialog>

    <!-- 创建投放任务对话框 -->
    <el-dialog v-model="campaignDialog" title="新建定时投放任务" width="760px">
      <el-form label-position="top">
        <el-form-item label="目标账号">
          <el-input :model-value="targetUser" disabled />
          <div style="font-size:12px;color:#888;">从顶部下拉框选择不同账号</div>
        </el-form-item>
        <el-form-item label="任务标题（可选）">
          <el-input v-model="campaignForm.title" placeholder="如 农行5月批次" />
        </el-form-item>
        <el-form-item label="速率（每小时投放条数）">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-input-number v-model="campaignForm.ratePerHourMin" :min="1" :max="60" style="width:100%" />
              <div style="font-size:12px;color:#888;">最少</div>
            </el-col>
            <el-col :span="12">
              <el-input-number v-model="campaignForm.ratePerHourMax" :min="1" :max="60" style="width:100%" />
              <div style="font-size:12px;color:#888;">最多</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="工作时段（24小时制）">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-input-number v-model="campaignForm.workHourStart" :min="0" :max="23" style="width:100%" />
              <div style="font-size:12px;color:#888;">开始小时</div>
            </el-col>
            <el-col :span="12">
              <el-input-number v-model="campaignForm.workHourEnd" :min="0" :max="23" style="width:100%" />
              <div style="font-size:12px;color:#888;">结束小时（不含）</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="分组默认值（行内第3列可覆盖）">
          <el-input v-model="campaignForm.defaultGroupName" />
        </el-form-item>
        <el-form-item label="标签默认值（行内第2列可覆盖）">
          <el-input v-model="campaignForm.defaultTags" placeholder="1 / 2 / TD" />
        </el-form-item>
        <el-form-item label="操作内容默认值（行内第4列可覆盖）">
          <el-input v-model="campaignForm.defaultOp" placeholder="如 5.11" />
        </el-form-item>
        <el-form-item label="粘贴号码（每行一条；列顺序：手机号 / 标签 / 分组 / 操作）">
          <el-input
            v-model="campaignForm.text"
            type="textarea"
            :rows="10"
            :placeholder="'13800000001\n13800000002,2\n13800000003,TD,农业银行,5.11'"
          />
        </el-form-item>
      </el-form>
      <div style="color:#666; font-size:13px;">
        将创建一个排队任务：共 <b>{{ campaignPreview }}</b> 条，预计
        <b>{{ campaignEtaHours }}</b> 小时跑完（仅在工作时段计费）。
      </div>
      <template #footer>
        <el-button @click="campaignDialog = false">取消</el-button>
        <el-button type="primary" :disabled="campaignPreview === 0" @click="submitCampaign">
          创建任务（{{ campaignPreview }} 条）
        </el-button>
      </template>
    </el-dialog>

    <!-- 通讯录批量粘贴对话框 -->
    <el-dialog v-model="bulkDialog" title="批量粘贴导入手机号" width="720px">
      <el-form label-position="top">
        <el-form-item label="分组（默认值，单行第3列可覆盖）">
          <el-input v-model="bulkForm.groupName" />
        </el-form-item>
        <el-form-item label="标签默认值（单行第2列可覆盖）">
          <el-input v-model="bulkForm.defaultTags" placeholder="1 / 2 / TD" />
        </el-form-item>
        <el-form-item label="操作内容默认值（单行第4列可覆盖）">
          <el-input v-model="bulkForm.op" placeholder="如 5.8" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="bulkForm.replace">
            <span style="color:#f56c6c;">（危险）导入前先清空该账号原有联系人</span>
          </el-checkbox>
          <div style="font-size:12px;color:#888;">不勾选时为追加导入，原有数据不会被删除</div>
        </el-form-item>
        <el-form-item label="粘贴区（每行一条，支持只粘手机号；逗号/空格/Tab 分隔列）">
          <el-input
            v-model="bulkForm.text"
            type="textarea"
            :rows="12"
            :placeholder="'13800000001\n13800000002,2\n13800000003,TD,农业银行,5.8'"
          />
        </el-form-item>
      </el-form>
      <div style="color:#666; font-size:12px;">
        预计导入：<b>{{ previewItems.length }}</b> 条；列顺序：手机号 / 标签 / 分组 / 操作
      </div>
      <template #footer>
        <el-button @click="bulkDialog = false">取消</el-button>
        <el-button type="primary" :disabled="previewItems.length === 0" @click="submitBulk">
          导入 {{ previewItems.length }} 条
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

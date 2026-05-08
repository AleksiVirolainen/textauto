<script setup>
import { computed, ref } from "vue";
import { auth } from "../auth";

const query = ref({
  status: "全部",
  keyword: "",
  content: ""
});

const defaultRows = [
  {
    taskId: "T20260430001",
    customerAccount: "CUST001",
    status: "成功",
    reportCount: 1200,
    meteringCount: 1200,
    submitTime: "2026-04-30 09:12:01",
    sendTime: "2026-04-30 09:13:20",
    content: "五一活动通知：全场8折。"
  },
  {
    taskId: "T20260430002",
    customerAccount: "CUST008",
    status: "失败",
    reportCount: 300,
    meteringCount: 0,
    submitTime: "2026-04-30 10:00:18",
    sendTime: "-",
    content: "系统升级维护提醒。"
  }
];

const presetByUser = {
  "13057799720": [
    {
      taskId: "T20260508001",
      customerAccount: "13057799720",
      status: "成功",
      reportCount: 20000,
      meteringCount: 20000,
      submitTime: "2026-05-08 10:00:00",
      sendTime: "2026-05-08 10:01:30",
      content:
        "【农业银行】尊敬的客户您好，您在我行可以申领一笔368000元授额，期限3年随用随还，如有需要请及时回复，回复1查利率，回复2办理，退订回T"
    },
    {
      taskId: "T20260507001",
      customerAccount: "13057799720",
      status: "成功",
      reportCount: 12000,
      meteringCount: 12000,
      submitTime: "2026-05-07 10:00:00",
      sendTime: "2026-05-07 10:01:30",
      content:
        "【农业银行】尊敬的客户您好，您在我行可以申领一笔368000元授额，期限3年随用随还，如有需要请及时回复，回复1查利率，回复2办理，退订回T"
    }
  ],
  "15957736312": [
    {
      taskId: "T20260508101",
      customerAccount: "15957736312",
      status: "成功",
      reportCount: 16000,
      meteringCount: 16000,
      submitTime: "2026-05-08 10:00:00",
      sendTime: "2026-05-08 10:01:30",
      content:
        "【农业银行】尊敬的客户您好，您在我行可以申领一笔368000元授额，期限3年随用随还，如有需要请及时回复，回复1查利率，回复2办理，退订回T"
    }
  ]
};

const rows = computed(() => {
  const username = auth.state.user?.username;
  if (username && presetByUser[username]) {
    return presetByUser[username];
  }
  return defaultRows;
});

const filteredRows = computed(() =>
  rows.value.filter((item) => {
    if (query.value.status !== "全部" && item.status !== query.value.status) {
      return false;
    }
    if (query.value.keyword && !item.taskId.includes(query.value.keyword)) {
      return false;
    }
    if (query.value.content && !item.content.includes(query.value.content)) {
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
        <el-button type="primary">查询</el-button>
        <el-button>导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="filteredRows" style="width: 100%">
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

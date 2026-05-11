<script setup>
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { api } from "../api";

const props = defineProps({
  defaultPointName: {
    type: String,
    default: ""
  }
});

const loading = ref(false);
const points = ref([]);
const records = ref([]);
const filterPointName = ref("");

const pointForm = ref({
  pointName: "",
  commissionRatePercent: 0
});

const scanForm = ref({
  pointName: ""
});
const selectedFile = ref(null);

function formatYuan(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

function setDefaultPointName() {
  if (scanForm.value.pointName) return;
  const fromProps = props.defaultPointName?.trim();
  if (fromProps) {
    scanForm.value.pointName = fromProps;
  }
}

async function refreshPoints() {
  points.value = await api.listRevenuePoints();
  if (!filterPointName.value && points.value.length > 0) {
    filterPointName.value = points.value[0].pointName;
  }
  if (!scanForm.value.pointName && points.value.length > 0) {
    scanForm.value.pointName = points.value[0].pointName;
  }
  setDefaultPointName();
}

async function refreshRecords() {
  records.value = await api.listRevenueRecords(filterPointName.value || undefined);
}

async function refreshAll() {
  loading.value = true;
  try {
    await refreshPoints();
    await refreshRecords();
  } finally {
    loading.value = false;
  }
}

function applyPoint(row) {
  pointForm.value.pointName = row.pointName;
  pointForm.value.commissionRatePercent = Number(row.commissionRatePercent ?? 0);
  scanForm.value.pointName = row.pointName;
  filterPointName.value = row.pointName;
  refreshRecords();
}

async function savePoint() {
  const pointName = pointForm.value.pointName.trim();
  if (!pointName) {
    ElMessage.warning("请先填写点位名称");
    return;
  }
  const rate = Number(pointForm.value.commissionRatePercent);
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    ElMessage.warning("抽成比例需在 0 到 100 之间");
    return;
  }
  await api.upsertRevenuePoint(pointName, rate);
  ElMessage.success("点位抽成已保存");
  await refreshPoints();
}

function onFileChange(event) {
  const file = event?.target?.files?.[0];
  selectedFile.value = file ?? null;
}

async function submitScan() {
  const pointName = scanForm.value.pointName.trim();
  if (!pointName) {
    ElMessage.warning("请填写点位名称");
    return;
  }
  if (!selectedFile.value) {
    ElMessage.warning("请先选择二维码图片");
    return;
  }
  const formData = new FormData();
  formData.append("pointName", pointName);
  formData.append("file", selectedFile.value);

  const result = await api.scanRevenue(formData);
  ElMessage.success(
    `识别成功：收款 ${formatYuan(Number(result.amountYuan))} 元，抽成 ${formatYuan(
      Number(result.commissionYuan)
    )} 元`
  );

  selectedFile.value = null;
  await refreshRecords();
}

watch(
  () => props.defaultPointName,
  () => {
    setDefaultPointName();
  }
);

onMounted(refreshAll);
</script>

<template>
  <div class="revenue-panel" v-loading="loading">
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span>点位抽成配置</span>
              <el-button link type="primary" @click="refreshPoints">刷新</el-button>
            </div>
          </template>

          <el-form label-position="top">
            <el-form-item label="点位名称">
              <el-input v-model="pointForm.pointName" placeholder="如：A区商场" />
            </el-form-item>
            <el-form-item label="抽成比例（%）">
              <el-input-number
                v-model="pointForm.commissionRatePercent"
                :min="0"
                :max="100"
                :step="0.1"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="savePoint">保存点位抽成</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="points" max-height="280">
            <el-table-column prop="pointName" label="点位" />
            <el-table-column prop="commissionRatePercent" label="抽成(%)" width="120" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button link type="primary" @click="applyPoint(row)">使用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never">
          <template #header>二维码识别入账</template>
          <el-form label-position="top">
            <el-form-item label="点位名称">
              <el-input v-model="scanForm.pointName" placeholder="必须为已配置点位" />
            </el-form-item>
            <el-form-item label="二维码图片">
              <input type="file" accept="image/*" @change="onFileChange" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitScan">上传并识别</el-button>
            </el-form-item>
          </el-form>
          <div style="font-size:12px;color:#888;">
            说明：系统会从二维码内容中自动提取金额参数，并按点位抽成比例计算你的分成。
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-top: 16px;">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span>识别记录（最新 200 条）</span>
          <div>
            <el-select v-model="filterPointName" clearable style="width: 200px; margin-right: 8px;">
              <el-option v-for="item in points" :key="item.pointName" :value="item.pointName" />
            </el-select>
            <el-button @click="refreshRecords">刷新</el-button>
          </div>
        </div>
      </template>

      <el-table :data="records" max-height="420">
        <el-table-column prop="pointName" label="点位" width="140" />
        <el-table-column prop="amountYuan" label="收款(元)" width="120">
          <template #default="{ row }">{{ formatYuan(Number(row.amountYuan)) }}</template>
        </el-table-column>
        <el-table-column prop="commissionRatePercent" label="抽成(%)" width="100" />
        <el-table-column prop="commissionYuan" label="抽成金额(元)" width="130">
          <template #default="{ row }">{{ formatYuan(Number(row.commissionYuan)) }}</template>
        </el-table-column>
        <el-table-column prop="netAmountYuan" label="到手(元)" width="120">
          <template #default="{ row }">{{ formatYuan(Number(row.netAmountYuan)) }}</template>
        </el-table-column>
        <el-table-column prop="detectStrategy" label="识别方式" width="180" />
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">
            {{ row.createdAt ? new Date(row.createdAt).toLocaleString() : "-" }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

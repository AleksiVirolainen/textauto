<script setup>
import RevenueAdminPanel from "../components/RevenueAdminPanel.vue";
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>营收后台</h3>
      <div style="color:#888;font-size:13px;">
        上传收款二维码后自动识别金额，并按点位计算抽成
      </div>
    </div>

    <el-alert
      title="使用说明：先配置点位抽成比例，再上传二维码图片进行识别入账。"
      type="info"
      :closable="false"
      style="margin-bottom: 12px;"
    />

    <RevenueAdminPanel />
  </div>
</template>

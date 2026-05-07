<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "模块建设中。"
  }
});
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>{{ title }}</h3>
    </div>
    <el-alert :title="description" type="info" show-icon :closable="false" />
  </div>
</template>

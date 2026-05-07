<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api";

const customers = ref([]);
const loading = ref(false);
const form = ref({
  customerCode: "",
  name: "",
  contactPhone: ""
});

async function load() {
  loading.value = true;
  try {
    customers.value = await api.listCustomers();
  } finally {
    loading.value = false;
  }
}

async function createCustomer() {
  await api.createCustomer(form.value);
  form.value = { customerCode: "", name: "", contactPhone: "" };
  await load();
}

onMounted(load);
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>客户管理</h3>
    </div>

    <el-form :inline="true" @submit.prevent>
      <el-form-item label="客户编号">
        <el-input v-model="form.customerCode" placeholder="如 CUST002" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="form.name" placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.contactPhone" placeholder="手机号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createCustomer">新增客户</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="customers" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="customerCode" label="客户编号" />
      <el-table-column prop="name" label="客户名称" />
      <el-table-column prop="contactPhone" label="联系电话" />
    </el-table>
  </div>
</template>

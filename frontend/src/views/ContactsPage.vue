<script setup>
import { computed } from "vue";
import { auth } from "../auth";

const contactsByUser = {
  "13057799720": [
    { id: 1, name: "", phone: "15657769129", group: "农业银行", tags: "1" },
    { id: 2, name: "", phone: "13868395048", group: "农业银行", tags: "1" },
    { id: 3, name: "", phone: "13057758880", group: "农业银行", tags: "1" },
    { id: 4, name: "", phone: "15158681686", group: "农业银行", tags: "1" },
    { id: 5, name: "", phone: "15858723981", group: "农业银行", tags: "2" },
    { id: 6, name: "", phone: "15657738344", group: "农业银行", tags: "1" },
    { id: 7, name: "", phone: "15068297914", group: "农业银行", tags: "1" },
    { id: 8, name: "", phone: "13587963678", group: "农业银行", tags: "1" },
    { id: 9, name: "", phone: "13291723158", group: "农业银行", tags: "1" },
    { id: 10, name: "", phone: "13868439418", group: "农业银行", tags: "1" },
    { id: 11, name: "", phone: "13262351263", group: "农业银行", tags: "1" },
    { id: 12, name: "", phone: "13868768899", group: "农业银行", tags: "2" },
    { id: 13, name: "", phone: "15669822397", group: "农业银行", tags: "1" },
    { id: 14, name: "", phone: "15858854933", group: "农业银行", tags: "1" },
    { id: 15, name: "", phone: "13075779920", group: "农业银行", tags: "1" },
    { id: 16, name: "", phone: "18006692538", group: "农业银行", tags: "1" },
    { id: 17, name: "", phone: "13285777378", group: "农业银行", tags: "2" },
    { id: 18, name: "", phone: "17326793694", group: "农业银行", tags: "1" },
    { id: 19, name: "", phone: "13057700651", group: "农业银行", tags: "1" },
    { id: 20, name: "", phone: "15224107647", group: "农业银行", tags: "1" },
    { id: 21, name: "", phone: "15558707072", group: "农业银行", tags: "1" },
    { id: 22, name: "", phone: "13868476769", group: "农业银行", tags: "1" },
    { id: 23, name: "", phone: "13057811233", group: "农业银行", tags: "1" },
    { id: 24, name: "", phone: "13736392768", group: "农业银行", tags: "1" },
    { id: 25, name: "", phone: "15558809051", group: "农业银行", tags: "1" },
    { id: 26, name: "", phone: "15158581100", group: "农业银行", tags: "1" },
    { id: 27, name: "", phone: "13115862513", group: "农业银行", tags: "1" },
    { id: 28, name: "", phone: "15067871113", group: "农业银行", tags: "2" },
    { id: 29, name: "", phone: "15557580399", group: "农业银行", tags: "1" }
  ]
};

const contacts = computed(() => {
  const u = auth.state.user?.username;
  return contactsByUser[u] ?? [];
});
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <h3>通讯录</h3>
      <div>
        <el-button>导入</el-button>
        <el-button type="primary">新增联系人</el-button>
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
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="contacts">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="group" label="分组" />
      <el-table-column prop="tags" label="标签" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button link type="primary">编辑</el-button>
          <el-button link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { auth } from "../auth";

const contactsByUser = {
  "13057799720": [
    { id: 1, name: "", phone: "15657769129", group: "农业银行", tags: "1", op: "" },
    { id: 2, name: "", phone: "13868395048", group: "农业银行", tags: "1", op: "" },
    { id: 3, name: "", phone: "13057758880", group: "农业银行", tags: "1", op: "" },
    { id: 4, name: "", phone: "15158681686", group: "农业银行", tags: "1", op: "" },
    { id: 5, name: "", phone: "15858723981", group: "农业银行", tags: "2", op: "" },
    { id: 6, name: "", phone: "15657738344", group: "农业银行", tags: "1", op: "" },
    { id: 7, name: "", phone: "15068297914", group: "农业银行", tags: "1", op: "" },
    { id: 8, name: "", phone: "13587963678", group: "农业银行", tags: "1", op: "" },
    { id: 9, name: "", phone: "13291723158", group: "农业银行", tags: "1", op: "" },
    { id: 10, name: "", phone: "13868439418", group: "农业银行", tags: "1", op: "" },
    { id: 11, name: "", phone: "13262351263", group: "农业银行", tags: "1", op: "" },
    { id: 12, name: "", phone: "13868768899", group: "农业银行", tags: "2", op: "" },
    { id: 13, name: "", phone: "15669822397", group: "农业银行", tags: "1", op: "" },
    { id: 14, name: "", phone: "15858854933", group: "农业银行", tags: "1", op: "" },
    { id: 15, name: "", phone: "13075779920", group: "农业银行", tags: "1", op: "" },
    { id: 16, name: "", phone: "18006692538", group: "农业银行", tags: "1", op: "" },
    { id: 17, name: "", phone: "13285777378", group: "农业银行", tags: "2", op: "" },
    { id: 18, name: "", phone: "17326793694", group: "农业银行", tags: "1", op: "" },
    { id: 19, name: "", phone: "13057700651", group: "农业银行", tags: "1", op: "" },
    { id: 20, name: "", phone: "15224107647", group: "农业银行", tags: "1", op: "" },
    { id: 21, name: "", phone: "15558707072", group: "农业银行", tags: "1", op: "" },
    { id: 22, name: "", phone: "13868476769", group: "农业银行", tags: "1", op: "" },
    { id: 23, name: "", phone: "13057811233", group: "农业银行", tags: "1", op: "" },
    { id: 24, name: "", phone: "13736392768", group: "农业银行", tags: "1", op: "" },
    { id: 25, name: "", phone: "15558809051", group: "农业银行", tags: "1", op: "" },
    { id: 26, name: "", phone: "15158581100", group: "农业银行", tags: "1", op: "" },
    { id: 27, name: "", phone: "13115862513", group: "农业银行", tags: "1", op: "" },
    { id: 28, name: "", phone: "15067871113", group: "农业银行", tags: "2", op: "" },
    { id: 29, name: "", phone: "15557580399", group: "农业银行", tags: "1", op: "" }
  ],
  "15957736312": [
    { id: 1, name: "", phone: "13587873993", group: "农业银行", tags: "1", op: "5.8" },
    { id: 2, name: "", phone: "13606872183", group: "农业银行", tags: "1", op: "5.8" },
    { id: 3, name: "", phone: "13566212801", group: "农业银行", tags: "1", op: "5.8" },
    { id: 4, name: "", phone: "13868722666", group: "农业银行", tags: "1", op: "5.8" },
    { id: 5, name: "", phone: "15258057677", group: "农业银行", tags: "1", op: "5.8" },
    { id: 6, name: "", phone: "13587783863", group: "农业银行", tags: "TD", op: "5.8" },
    { id: 7, name: "", phone: "13757731221", group: "农业银行", tags: "1", op: "5.8" },
    { id: 8, name: "", phone: "18958822582", group: "农业银行", tags: "1", op: "5.8" },
    { id: 9, name: "", phone: "15858505098", group: "农业银行", tags: "1", op: "5.8" },
    { id: 10, name: "", phone: "13107777600", group: "农业银行", tags: "1", op: "5.8" },
    { id: 11, name: "", phone: "15869489811", group: "农业银行", tags: "2", op: "5.8" },
    { id: 12, name: "", phone: "18906641383", group: "农业银行", tags: "1", op: "5.8" },
    { id: 13, name: "", phone: "18657789575", group: "农业银行", tags: "2", op: "5.8" },
    { id: 14, name: "", phone: "13353345999", group: "农业银行", tags: "1", op: "5.8" },
    { id: 15, name: "", phone: "18758782668", group: "农业银行", tags: "TD", op: "5.8" },
    { id: 16, name: "", phone: "13091995000", group: "农业银行", tags: "1", op: "5.8" },
    { id: 17, name: "", phone: "18815052861", group: "农业银行", tags: "2", op: "5.8" },
    { id: 18, name: "", phone: "13587855121", group: "农业银行", tags: "1", op: "5.8" },
    { id: 19, name: "", phone: "18767793030", group: "农业银行", tags: "1", op: "5.8" },
    { id: 20, name: "", phone: "15867749993", group: "农业银行", tags: "1", op: "5.8" },
    { id: 21, name: "", phone: "18806778570", group: "农业银行", tags: "1", op: "5.8" },
    { id: 22, name: "", phone: "18066398788", group: "农业银行", tags: "2", op: "5.8" },
    { id: 23, name: "", phone: "13336956187", group: "农业银行", tags: "1", op: "5.8" },
    { id: 24, name: "", phone: "18968995000", group: "农业银行", tags: "TD", op: "5.8" },
    { id: 25, name: "", phone: "15305779038", group: "农业银行", tags: "1", op: "5.8" },
    { id: 26, name: "", phone: "18815005881", group: "农业银行", tags: "1", op: "5.8" },
    { id: 27, name: "", phone: "18968881387", group: "农业银行", tags: "2", op: "5.8" },
    { id: 28, name: "", phone: "18757758677", group: "农业银行", tags: "1", op: "5.8" },
    { id: 29, name: "", phone: "13506871768", group: "农业银行", tags: "1", op: "5.8" },
    { id: 30, name: "", phone: "18368748098", group: "农业银行", tags: "2", op: "5.8" },
    { id: 31, name: "", phone: "13506542117", group: "农业银行", tags: "1", op: "5.8" },
    { id: 32, name: "", phone: "13506876255", group: "农业银行", tags: "TD", op: "5.8" },
    { id: 33, name: "", phone: "13355882368", group: "农业银行", tags: "1", op: "5.8" },
    { id: 34, name: "", phone: "13388599500", group: "农业银行", tags: "1", op: "5.8" },
    { id: 35, name: "", phone: "18968992826", group: "农业银行", tags: "1", op: "5.8" },
    { id: 36, name: "", phone: "18989781929", group: "农业银行", tags: "1", op: "5.8" },
    { id: 37, name: "", phone: "13362727850", group: "农业银行", tags: "1", op: "5.8" }
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
      <el-table-column prop="op" label="操作" width="120" />
    </el-table>
  </div>
</template>

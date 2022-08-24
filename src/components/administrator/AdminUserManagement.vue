<script setup>
import {ref} from "vue";
import axios2 from "../../utils/request2";

defineExpose({
  name: "AdminUserManagement"
})

const userList = ref([])
const loading = ref(true)

axios2.get('/administrator/get/users', null, (data) => {
  userList.value = data
  loading.value = false
})

const changeUserVisible = ref(false)

function changeUser(account) {
  alert(account)
}

function handleClose() {

}

function balanceFormatter(row) {
  return row.balance.toFixed(2)
}

function identityNumberFormatter(row) {
  return row.identityNumber.substring(0, 3) + '**************' +
      row.identityNumber.substring(17)
}
</script>

<template>
  <div class="container">
    <h1>用户管理</h1>
    <el-table :data="userList"
              class="my-el-table"
              v-loading="loading"
              max-height="calc(100vh - 200px)"
              highlight-current-row
              stripe
              lazy
              :default-sort="{ prop: 'account', order: 'descending' }"
    >
      <el-table-column prop="account" label="卡号" width="100" align="center" sortable/>
      <el-table-column prop="name" label="姓名" width="90" align="center"/>
      <el-table-column prop="mobilePhone" label="手机号" width="120" align="center"/>
      <el-table-column prop="identityNumber" label="身份证号" width="180"
                       align="center" :formatter="identityNumberFormatter"/>
      <el-table-column prop="balance" label="余额" width="100" sortable
                       align="center" :formatter="balanceFormatter"/>
      <el-table-column prop="rewardPoints" label="积分" width="70" align="center"/>
      <el-table-column prop="level" label="会员等级" width="110" align="center" sortable/>
      <el-table-column prop="id" label="操作" width="100" align="center">
        <template v-slot:default='info'>
          <el-button text class="text-button" @click="changeUser(info.row.account)">
            修改信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="changeUserVisible" center :modal="true"
             title="订单商品详情" :before-close="handleClose" width="530px">
    nmsl
  </el-dialog>
</template>

<style scoped>
h1 {
  text-align: center;
}

.my-el-table {
  height: auto;
  margin: auto;
  max-width: 870px;
}

.text-button {
  margin: auto -5px;
}

.commodity-table {
  max-width: 480px;
  margin: auto;
}
</style>
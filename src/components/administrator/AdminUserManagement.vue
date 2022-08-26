<script setup>
import {ref, inject} from "vue";
import axios2 from "../../utils/request2";
import {ElMessage, ElMessageBox} from "element-plus";

defineExpose({
  name: "AdminUserManagement"
})

const axios = inject('axios')

const userList = ref([])
const loading = ref(true)

axios2.get('/administrator/get/users', null, (data) => {
  userList.value = data
  loading.value = false
})

const changeUserFormRef = ref()
const changeUserData = ref({
  account: null,
  password: null,
  name: null,
  mobilePhone: null,
  identityNumber: null,
  balance: null,
  rewardPoints: null,
  level: null
})
const changeUserDataLoading = ref(true)
const changeUserVisible = ref(false)

function changeUser(account) {
  changeUserVisible.value = true
  changeUserData.value.account = account
  for (const userListElement of userList.value) {
    if (userListElement.account === account) {
      changeUserData.value.name = userListElement.name
      changeUserData.value.mobilePhone = userListElement.mobilePhone
      changeUserData.value.identityNumber = userListElement.identityNumber
      // changeUserData.value.balance = userListElement.balance
      // changeUserData.value.rewardPoints = userListElement.rewardPoints
      // changeUserData.value.level = userListElement.level
      break
    }
  }
  changeUserDataLoading.value = false
}

async function submitChangeUser(formEl) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (!valid) {
      ElMessage({
        showClose: true,
        message: '输入的信息不符合要求',
        type: 'error'
      })
      return -1
    }
  })
  await ElMessageBox.prompt('请输入当前管理员密码', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputType: 'password'
  })
      .then(({value}) => {
        axios2.post('/administrator/change/user', {
          user: changeUserData.value,
          password: value
        }, () => {
          for (const userListElement of userList.value) {
            if (userListElement.account === changeUserData.value.account) {
              userListElement.name = changeUserData.value.name
              userListElement.mobilePhone = changeUserData.value.mobilePhone
              userListElement.identityNumber = changeUserData.value.identityNumber
              break
            }
          }
          changeUserData.value.account = null
          ElMessage.success('修改成功')
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消修改',
        })
      })
  changeUserVisible.value = false
  changeUserDataLoading.value = true
}

const checkIdentityNumber = (rule, value, callback) => {
  const re = /\d{18}/
  if (!re.test(value)) {
    callback(new Error('身份证号必须都是数字'))
  } else {
    callback()
  }
}
const checkMobilePhone = (rule, value, callback) => {
  const re = /\d{11}/
  if (!re.test(value)) {
    callback(new Error('手机号必须都是数字'))
  } else {
    callback()
  }
}

const rules = ref({
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 30,
      message: '姓名长度为2-30位'
    }
  ],
  identityNumber: [
    {
      required: true,
      message: '请输入身份证号',
      trigger: 'blur'
    },
    {
      min: 18,
      max: 18,
      message: '身份证号长度应为18位'
    },
    {
      validator: checkIdentityNumber,
      trigger: 'blur'
    }
  ],
  mobilePhone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      min: 11,
      max: 11,
      message: '手机号长度应为11位'
    },
    {
      validator: checkMobilePhone,
      trigger: 'blur'
    }
  ],
  password: [
    {
      min: 6,
      max: 25,
      message: '密码长度应该为6-25位',
      trigger: 'blur'
    }
  ]
})

function getRechargeRecords(account) {
  return axios.get('/charge/administrator', {params: {account}})
}

function getUserOrders(account) {
  return axios.get('/order/administrator', {params: {account}})
}

function getRedeemRecords(account) {
  return axios.get('/redeem/administrator', {params: {account}})
}

const checkedUserAccount = ref(null)
const checkUserBillDetailsVisible = ref(false)
const checkUserBillDetailsData = ref([])
const checkUserBillDetailsLoading = ref(true)

function checkUserBillDetails(account) {
  checkedUserAccount.value = account
  checkUserBillDetailsVisible.value = true
  Promise.all([getRechargeRecords(account),
    getUserOrders(account), getRedeemRecords(account)])
      .then((response) => {
        if (response[0].state === 0) {
          if (response[1].state === 0) {
            if (response[2].state === 0) {
              for (const rechargeRecord of response[0].data) {
                const temp = {
                  date: rechargeRecord.time,
                  balanceChange: '+' + rechargeRecord.amount.toFixed(2),
                  pointChange: '—',
                  id: rechargeRecord.id,
                  type: '充值'
                }
                checkUserBillDetailsData.value.push(temp)
              }
              for (const userOrder of response[1].data.UserOrderList) {
                const temp = {
                  date: userOrder.time,
                  balanceChange: '-' + userOrder.paymentAmount.toFixed(2),
                  pointChange: '+' + userOrder.rewardPoints,
                  id: userOrder.id,
                  type: '购物订单'
                }
                checkUserBillDetailsData.value.push(temp)
              }
              for (const redeemRecord of response[2].data) {
                const temp = {
                  date: redeemRecord.time,
                  balanceChange: '—',
                  pointChange: '-' + redeemRecord.value,
                  id: redeemRecord.id,
                  type: '满减券兑换'
                }
                checkUserBillDetailsData.value.push(temp)
              }
              checkUserBillDetailsData.value.sort(function (x, y) {
                if (x.date < y.date) {
                  return 1
                } else if (x.date > y.date) {
                  return -1
                } else {
                  return 0
                }
              })
              checkUserBillDetailsLoading.value = false
            } else {
              ElMessage.error(response[2].message)
            }
          } else {
            ElMessage.error(response[1].message)
          }
        } else {
          ElMessage.error(response[0].message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
}

function handleClose() {
  changeUserVisible.value = false
  changeUserDataLoading.value = true
  checkUserBillDetailsVisible.value = false
  checkUserBillDetailsLoading.value = true
  checkUserBillDetailsData.value = []
}

function balanceFormatter(row) {
  return row.balance ? row.balance.toFixed(2) : ''
}

function identityNumberFormatter(row) {
  return row.identityNumber ? row.identityNumber.substring(0, 3) + '**************' +
      row.identityNumber.substring(17) : ''
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
          <el-button text class="text-button" @click="checkUserBillDetails(info.row.account)">
            查看动态
          </el-button>
          <el-button text class="text-button" @click="changeUser(info.row.account)">
            修改信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="changeUserVisible" center :modal="true"
             :title="'用户修改 当前用户卡号：' + changeUserData.account"
             :before-close="handleClose" width="530px">
    <el-form v-loading="changeUserDataLoading" label-width="84px" ref="changeUserFormRef"
             :model="changeUserData" :label-position="'right'" :rules="rules"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="changeUserData.name" minlength="2" maxlength="30"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="identityNumber">
        <el-input v-model="changeUserData.identityNumber" minlength="18" maxlength="18"/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobilePhone">
        <el-input v-model="changeUserData.mobilePhone" minlength="11" maxlength="11"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="changeUserData.password" type="password"
                  show-password minlength="6"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitChangeUser(changeUserFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="checkUserBillDetailsVisible" center draggable :modal="false"
             :title="'用户动态 当前用户卡号：' + checkedUserAccount" width="700px"
             :before-close="handleClose">
    <el-table :data="checkUserBillDetailsData"
              v-loading="checkUserBillDetailsLoading"
              highlight-current-row
              stripe
              max-height="calc(90vh - 200px)"
              lazy
              class="table">
      <el-table-column prop="date" label="日期" width="170" align="center"/>
      <el-table-column prop="balanceChange" label="余额变动" width="120" align="center"/>
      <el-table-column prop="pointChange" label="积分变动" width="120" align="center"/>
      <el-table-column prop="id" label="事项单号" width="120"/>
      <el-table-column prop="type" label="事项备注" width="120"/>
    </el-table>
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

.table {
  text-align: center;
  margin: auto;
  max-width: 650px;
}
</style>
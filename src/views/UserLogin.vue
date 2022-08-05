<script setup>
import {ref, reactive} from 'vue'
import { ElMessage } from 'element-plus'

defineExpose({
  name: 'UserLogin'
})

const form = ref({
  account: '',
  password: '',
})

const rules = reactive({
  account: [
    {
      required: true,
      message: '请输入卡号',
      trigger: 'blur'
    },
    {
      min: 8,
      max: 8,
      message: '卡号长度应该为8位',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 25,
      message: '密码长度应该为6-25位',
      trigger: 'blur'
    }
  ]
})

const ruleFormRef = ref()

async function login(formEl) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      this.axios.post('/user/login', form.value)
          .then(function (response) {
            alert(response)
          })
          .catch(function (error) {
            alert(error)
          })
    } else {
      ElMessage({
        showClose: true,
        message: '输入的信息不符合要求',
        type: 'error'
      })
    }
  })
}
</script>

<template>
  <div class="border-div">
    <el-form :model="form" :rules="rules" ref="ruleFormRef" class="my-form">
      <el-form-item label="卡号" prop="account">
        <el-input v-model="form.account"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login(ruleFormRef)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.my-form {
  text-align: center;
  align-items: center;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 8px;
  margin: auto auto;
  width: 20rem;
  height: 150px;
  display: block;
}

.border-div {
  display: block;
  position: relative;
  top: 20%;
  text-align: center;
  margin: auto;
}

.el-button {
  margin: auto;
}
</style>

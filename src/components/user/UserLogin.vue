<script setup>
import {ref, reactive, inject} from 'vue'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
import {userStore} from "../../stores/userStore";
import Header from "./Header.vue";

const router = useRouter()

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
      trigger: 'blur',
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
const axios = inject('axios')  // inject axios

async function login(formEl) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit', fields)
      axios.post('/user/login', form.value)
          .then(function (response) {
            console.log(response)
            if (response.state === 0) {
              sessionStorage.setItem('user', JSON.stringify(response.data.user))
              sessionStorage.setItem('token', response.data.authorization)
              //再次发出请求去请求会员等级信息
              axios.get('/membership_level/all')
                  .then(function (levelResponse) {
                    console.log(levelResponse)
                    if (levelResponse.state === 0) {
                      sessionStorage.setItem('membership_level_all', JSON.stringify(levelResponse.data))
                      userStore.value.user = response.data.user
                      userStore.value.membershipLevel = levelResponse.data
                      router.push({
                        name: "UserHome",
                        params: {
                          account: response.data.user.account
                        }
                      })
                    } else {
                      ElMessage({
                        showClose: true,
                        message: response.message,
                        type: 'error'
                      })
                    }
                  })
                  .catch(function (error) {
                    console.log(error)
                  })
            } else {
              ElMessage({
                showClose: true,
                message: response.message,
                type: 'error'
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    } else {
      console.log('error submit!', fields)
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
  <el-container>
    <el-header>
      <Header/>
    </el-header>

    <el-main>
      <div class="border-div">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" class="my-form">
          <el-form-item class="my-form-item" label="卡号" prop="account">
            <el-input v-model="form.account" maxlength="8" @input="form.account=form.account.replace(/\D/,'')"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" show-password maxlength="25"/>
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                @click="login(ruleFormRef)"
                style="margin: auto"
            >登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>

</template>

<style>
.my-form {
  text-align: center;
  text-align: -webkit-center;
  align-items: center;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 8px;
  margin: auto auto;
  width: 20rem;
  height: 150px;
  display: block;
  background-color: rgba(255, 255, 255, 0.89);
  opacity: 0.92;
}

html.dark .my-form {
  background-color: rgba(34, 34, 35, 0.8);
}

.border-div {
  display: block;
  text-align: center;
  margin-top: 8rem;
}

html.dark .el-header {
  background-color: rgba(34, 34, 35, 0.9);
}

.el-header {
  background-color: rgba(202, 202, 213, 0.82)
}
</style>

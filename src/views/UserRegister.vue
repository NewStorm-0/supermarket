<template>
  <el-container>
    <el-header>
      <UserHeader/>
    </el-header>
    <el-main>
      <router-link to="/" class="my-router-link">
        <el-icon>
          <Back/>
        </el-icon>
        已有账号？返回初始页
      </router-link>
      <div class="border-div">
        <el-form ref="formRef"
                 v-loading="loading"
                 :model="form"
                 :rules="rules"
                 status-icon
                 :label-position="'right'"
                 label-width="84px"
                 class="register-form"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" minlength="2" maxlength="30"/>
          </el-form-item>
          <el-form-item label="身份证号" prop="identityNumber">
            <el-input v-model="form.identityNumber" minlength="18" maxlength="18"/>
          </el-form-item>
          <el-form-item label="手机号" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" minlength="11" maxlength="11"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" show-password minlength="6"/>
          </el-form-item>
          <el-form-item label="会员等级" prop="level">
            <el-select v-model.number="form.level" @change="levelChanged">
              <el-option
                  v-for="item in membershipLevels"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="缴纳金额" prop="balance">
            <el-input v-model.number="form.balance" disabled/>
          </el-form-item>
          <el-form-item>
            <div style="width: 25px"/>
            <el-button type="primary" @click="register(formRef)">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import {ref, reactive, inject, onBeforeMount} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRouter} from 'vue-router'
import UserHeader from "../components/user/UserHeader.vue";
const axios = inject('axios')  // inject axios
defineExpose({
  name: 'UserLogin',
})
const membershipLevels = ref(null)
const loading = ref(true)
onBeforeMount(() => {
  axios.get('membership_level/all')
      .then((response) => {
        if (response.state === 0) {
          membershipLevels.value = response.data
          form.value.level = membershipLevels.value[0].type
          form.value.balance = membershipLevels.value[0].requiredAmount
          loading.value = false
        } else {
          ElMessage({
            type: 'error',
            message: response.message
          })
        }
      })
      .catch((error) => console.log(error))
})
const formRef = ref()
const form = ref({
  name: '',
  identityNumber: '',
  mobilePhone: '',
  password: '',
  level: 0,
  balance: 0,
  rewardPoints: 0
})

function levelChanged(val) {
  for (const level of membershipLevels.value) {
    if (level.type === val) {
      form.value.balance = level.requiredAmount
    }
  }
}

const router = useRouter()

async function register(formEl) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      axios.post('/user/register', form.value)
          .then((response) => {
            ElMessageBox.alert('您已成功成为超市会员!您的会员卡号为: ' + response.data.account +
                ' 请牢记您的卡号以便登录，如果忘记卡号，请线下至超市查询卡号'
                , '恭喜', {
                  confirmButtonText: '我记住了',
                  callback: (action) => {
                    formEl.resetFields
                    router.push({name: 'UserLogin'})
                  }
                })
          })
    } else {
      console.log('error submit!')
      ElMessage({
        showClose: true,
        message: '输入的信息不符合要求',
        type: 'error'
      })
    }
    console.log(fields)
  })
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

const rules = reactive({
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
      required: true,
      message: "请输入密码",
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
</script>

<style lang="scss" scoped>
.register-form {
  max-width: 40rem;
  width: 18rem;
  margin: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 40px 40px 0px 35px;
  display: block;
  background-color: rgba(255, 255, 255, 0.89);
  opacity: 0.92;
}

.border-div {
  display: block;
  margin: auto;
  width: 40%;
  text-align: center;
}

.my-router-link {
  color: #d3dce6;
  text-decoration: none;
}

html.dark {
  .register-form {
    background-color: rgba(34, 34, 35, 0.8);
  }
}
</style>
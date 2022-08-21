<script setup>
import {ElMessage, ElMessageBox} from 'element-plus'
import {ref, reactive, inject} from 'vue'
import {useRouter} from 'vue-router'
import {userStore} from "../../stores/userStore";

const axios = inject('axios')  // inject axios
defineExpose({
  name: 'UserInformation'
});

const userData = userStore.value.user

const router = useRouter();
const dialogFormVisible = ref(false);
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

function show_time() {
  dialogFormVisible.value = !dialogFormVisible.value;
}

function clear_time() {
  dialogFormVisible.value = !dialogFormVisible.value;
  form.value.oldPassword = '';
  form.value.newPassword = '';
  form.value.confirmNewPassword = '';
}

const onSubmit = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      axios.post('/user/change_password', form.value)
          .then(function (response) {
            if (response.state === 0) {
              dialogFormVisible.value = !dialogFormVisible.value;
              ElMessage({
                type: 'success',
                message: '您已成功修改密码',
              })
            } else {
              ElMessageBox.alert(response.message)
            }
            formEl.resetFields()
          })
          .catch(function (error) {
            console.log(error)
          })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const checkNewPassword = (rule, value, callback) => {
  if (value !== form.value.newPassword) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const rules = ref({
  oldPassword: [
    {
      required: true,
      message: '请输入旧密码',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 25,
      message: '密码长度应该为6-25位',
      trigger: 'blur'
    }
  ],
  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 25,
      message: '密码长度应该为6-25位',
      trigger: 'blur'
    }
  ],
  confirmNewPassword: [
    {
      required: true,
      message: '请再次输入新密码',
      trigger: 'blur'
    },
    {
      validator: checkNewPassword,
      trigger: 'blur'
    }
  ]
})
const ruleFormRef = ref()
</script>

<template>
  <div align="center">
    <h1>会员信息</h1>
    <el-card class="my-el-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">会员卡号</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">{{ userData.account }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">会员姓名</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">{{ userData.name }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">身份证号</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">{{ userData.identityNumber }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">卡内余额</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">{{ userData.balance }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">剩余积分</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">{{ userData.rewardPoints }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content ep-bg-purple">会员等级</div>
        </el-col>
        <el-col :span="10">
          <el-rate
              v-model="userData.level"
              text-color="#ff9900"
              disabled
              show-score
          />
        </el-col>
      </el-row>
      <el-button class="my-el-button" type="primary" @click="show_time">更改密码</el-button>
      <!--      <h1 v-if="dialogFormVisible">此时应有弹窗</h1>-->
    </el-card>
    <el-dialog title="修改密码" v-model="dialogFormVisible" custom-class="my-el-dialog1">
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" show-password></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" show-password></el-input>
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmNewPassword">
          <el-input v-model="form.confirmNewPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button1" type="primary" @click="onSubmit(ruleFormRef)">确认修改</el-button>
          <el-button @click="clear_time">取消修改</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  /* min-height: 36px; */
}

.my-el-button {
  border-radius: 4px;
  margin-top: 25px;
}

.my-el-card {
  width: 600px;
  text-align: center;
  border-radius: 10px;
  opacity: 0.8;
}

.el-form {
  max-width: 300px;

}

.button1 {
  margin-left: -35px;
}
</style>

<style>
.my-el-dialog1 {
  border-radius: 20px;
  width: 35%;
  min-width: 300px;
}
</style>
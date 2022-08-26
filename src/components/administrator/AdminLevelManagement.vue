<script setup>
import {ref} from "vue";
import axios2 from "../../utils/request2";
import {ElMessage, ElMessageBox} from "element-plus";

defineExpose({
  name: "AdminLevelManagement"
})

const membershipLevels = ref([])
const loading = ref(true)

axios2.get('/membership_level/all', null, (data) => {
  membershipLevels.value = data
  loading.value = false
})

const changeLevelVisible = ref(false)
const changeLevelFormRef = ref()
const changeLevelData = ref({
  type: null,
  name: null,
  requiredAmount: null,
  discount: null
})

function changeLevel(type) {
  changeLevelData.value.type = type
  for (const membershipLevel of membershipLevels.value) {
    if (membershipLevel.type === type) {
      changeLevelData.value.name = membershipLevel.name
      changeLevelData.value.requiredAmount = membershipLevel.requiredAmount
      changeLevelData.value.discount = membershipLevel.discount
      break
    }
  }
  changeLevelVisible.value = true
}

async function submitChangeLevel(formEl) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await ElMessageBox.prompt('请输入当前管理员密码', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: 'password'
      }).then(({value}) => {
        axios2.post('/administrator/change/membership_level', {
          membershipLevel: changeLevelData.value,
          password: value
        }, () => {
          for (const membershipLevel of membershipLevels.value) {
            if (membershipLevel.type === changeLevelData.value.type) {
              membershipLevel.name = changeLevelData.value.name
              membershipLevel.requiredAmount = changeLevelData.value.requiredAmount
              membershipLevel.discount = changeLevelData.value.discount
              break
            }
          }
          ElMessage.success('修改成功')
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消修改',
        })
      })
      changeLevelVisible.value = false
    } else {
      ElMessage({
        showClose: true,
        message: '输入的信息不符合要求',
        type: 'error'
      })
    }
  })
}

const rules = ref({
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入名称'
    }
  ],
  requiredAmount: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入初始金额'
    }
  ],
  discount: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入折扣'
    }
  ]
})
</script>

<template>
  <div class="right-top">会员等级及权益一览</div>
  <el-scrollbar class="scroll" v-loading="loading">
    <div style="display: flex;">
      <el-card
          v-for="i in membershipLevels"
          :key="i.type"
          class="box-card"
          :class="'level' + i.type"
      >
        <template #header>
          <div class="card-header">
              <span class="text">
                {{ i.name }}会员
              </span>
            <div style="margin-top: 100px; margin-right: 0px;">
              <el-button size="large" text style="font-size: 2rem"
                         @click="changeLevel(i.type)"
              >
                编辑
              </el-button>
            </div>
          </div>
        </template>
        <div class="card-content">
          <div class="clause">初始金额为{{ i.requiredAmount }}元</div>
          <div class="clause">
            结算折扣为{{ i.discount }}折
          </div>
          <div class="clause">购买享受积分回馈</div>
        </div>
      </el-card>
    </div>
  </el-scrollbar>
  <el-dialog v-model="changeLevelVisible" center :modal="true"
             :title="'VIP等级修改'" width="330px">
    <el-form label-width="84px" ref="changeLevelFormRef"
             :model="changeLevelData" :label-position="'right'" :rules="rules"
    >
      <el-form-item label="等级" prop="type">
        <el-input v-model="changeLevelData.type" disabled/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="changeLevelData.name"/>
      </el-form-item>
      <el-form-item label="初始金额" prop="requiredAmount">
        <el-input-number
            v-model="changeLevelData.requiredAmount"
            :precision="2"
            :step="100"
            :max="999999999"
            style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="折扣" prop="discount">
        <el-input-number
            v-model="changeLevelData.discount"
            :precision="2"
            :step="0.01"
            :max="1"
            :min="0"
            style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <div style="width: 30px"/>
        <el-button type="primary" @click="submitChangeLevel(changeLevelFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped>
div.card-header {
  font-size: 30px;
  font-weight: bolder;
  text-align: center;
}

div.card-content {
  text-align: center;
  font-size: 20px;
}

div.right-top {
  text-align: center;
  font-size: 30px;
  margin: -5px 20px 20px 20px;
}

div.clause {
  font-size: 20px;
  margin: 25px auto;
}

.scroll {
  padding: 10px;
  border-radius: 10px;
  height: auto;
  margin-top: 8%;
}

.box-card {
  display: flex;
  margin: auto 20px;
  min-width: 400px;
  height: 230px;
}

@import "../../assets/membership_level";
</style>
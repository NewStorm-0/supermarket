<script setup>
import {inject, ref} from "vue";
import {userStore} from "../../stores/userStore";
import {ElMessage} from "element-plus";

defineExpose({
  name: "UserRedeem"
})

const axios = inject('axios')
let loading = ref(null)
let couponsInformation = ref([])
axios.get('/coupon/all')
    .then((response) => {
      if (response.state === 0) {
        couponsInformation.value = response.data
        loading.value = false
      } else {
        ElMessage({
          type: 'error',
          message: response.message
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })

const chooseNumberDialogVisible = ref(false)
const couponNumber = ref(1)
let couponType = null

function chooseType(type) {
  couponType = type
  chooseNumberDialogVisible.value = true
}

function redeem() {
  axios.get('/user/redeem', {
    params: {
      couponType,
      number: couponNumber.value
    }
  }).then((response) => {
    if (response.state === 0) {
      let cost = null
      for (const information of couponsInformation.value) {
        if (couponType === information.type) {
          cost = information.cost
          break
        }
      }
      userStore.value.user.rewardPoints -= cost
      ElMessage({
        type: 'success',
        message: '兑换成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message: response.message
      })
    }
  }).catch((error) => {
    console.log(error)
  })
  chooseNumberDialogVisible.value = false
  setTimeout(() => {
    couponNumber.value = 1
  }, 200)
}
</script>

<template>
  <div class="top-content">
    您的积分：{{ userStore.user.rewardPoints }}
  </div>
  <div class="my-scrollbar">
    <el-scrollbar class="scroll" v-loading="loading" height="calc(100% - 1rem)">
      <el-space wrap>
        <el-card
            v-for="i in couponsInformation"
            :key="i.type"
            class="box-card"
        >
          <template #header>
            <div class="card-header">
              <span>
                满{{ i.lowestAmount }}减{{ i.reliefAmount }}
              </span>
              <el-button
                  class="my-el-button"
                  plain text
                  size="small"
                  @click="chooseType(i.type)"
              >
                兑换
              </el-button>
            </div>
          </template>
          <div class="card-content">
            {{ i.cost }}积分/张
          </div>
        </el-card>
      </el-space>
    </el-scrollbar>
  </div>
  <el-dialog v-model="chooseNumberDialogVisible" title="请输入以下信息" width="30%">
    <el-form :inline="true">
      <el-form-item label="兑换数量">
        <el-input-number v-model="couponNumber" :min="1" :max="99"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="redeem">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
div.top-content {
  text-align: center;
  font-size: 2rem;
  margin: -10px auto auto auto;
  font-weight: bold;
}

.scroll {
  padding: 10px;
  border-radius: 10px;

}

.my-scrollbar {
  height: calc(100% - 2rem - 2px);
}

.my-el-button {
  font-size: 20px;
  padding: 0 5px;
  margin: 3px -5px 0 8px;
}

.box-card {
  background-image: linear-gradient(to bottom right,
  rgb(141, 224, 99), rgb(19, 217, 51), rgb(141, 224, 99));
  /*border: 5px solid;*/
  /*border-image: linear-gradient(130deg,*/
  /*rgb(36, 198, 220),*/
  /*rgb(84, 51, 255) 41.07%,*/
  /*rgb(255, 0, 153) 76.05%) 1;*/
}

.card-header {
  font-size: 1.5rem;
  font-weight: bolder;
  text-align: center;
}

.card-content {
  text-align: right;
  font-size: 1rem;
}

html.dark .box-card {
  background-image: linear-gradient(to bottom right,
  rgb(72, 114, 50), rgb(14, 154, 37), rgb(72, 114, 50));
}
</style>
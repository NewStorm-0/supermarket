<script setup>
import axios2 from "../../utils/request2";
import {ref} from "vue";
import {ElMessage} from "element-plus";

defineExpose({
  name: "AdminCouponManagement"
})

const couponsData = ref([])
const loading = ref(true)

axios2.get('/coupon/all', null, (data) => {
  couponsData.value = data
  loading.value = false
})

const addCouponVisible = ref(false)
const addCouponData = ref({
  type: null,
  reliefAmount: 0,
  lowestAmount: 0,
  cost: 0
})

function addCoupon() {
  addCouponData.value.reliefAmount = 0
  addCouponData.value.lowestAmount = 0
  addCouponData.value.cost = 0
  addCouponVisible.value = true
}

function submitAddCoupon() {
  axios2.post('/coupon/add', {
    type: null,
    reliefAmount: addCouponData.value.reliefAmount,
    lowestAmount: addCouponData.value.lowestAmount,
    cost: addCouponData.value.cost,
  }, (data) => {
    couponsData.value.push({
      type: data,
      reliefAmount: addCouponData.value.reliefAmount,
      lowestAmount: addCouponData.value.lowestAmount,
      cost: addCouponData.value.cost
    })
    ElMessage.success('添加满减券成功')
  })
  addCouponVisible.value = false
}

function deleteCoupon(type) {
  axios2.get('/coupon/delete', {
    params: {
      couponId: type
    }
  }, () => {
    for (let i = 0; i < couponsData.value.length; i++) {
      if (couponsData.value[i].type === type) {
        couponsData.value.splice(i, 1)
        break
      }
    }
    ElMessage.success('删除成功')
  })
}
</script>

<template>
  <div class="top-content">
    <el-button type="primary" @click="addCoupon" size="large" class="my-button">
      添加满减券
    </el-button>
    满减券一览
  </div>
  <div class="my-scrollbar">
    <el-scrollbar class="scroll" v-loading="loading" height="calc(100% - 1rem)">
      <el-space wrap>
        <el-card
            v-for="i in couponsData"
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
                  @click="deleteCoupon(i.type)"
              >
                删除
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
  <el-dialog v-model="addCouponVisible" center :modal="true"
             title="请输入满减券信息" width="300px">
    <el-form
        :model="addCouponData"
        label-position="right"
        label-width="80px"
    >
      <el-form-item label="使用价格" prop="lowestAmount">
        <el-input-number v-model="addCouponData.lowestAmount" :min="0" :precision="2"/>
      </el-form-item>
      <el-form-item label="减免价格" prop="reliefAmount">
        <el-input-number v-model="addCouponData.reliefAmount" :min="0" :precision="2"/>
      </el-form-item>
      <el-form-item label="花费积分" prop="cost">
        <el-input-number v-model="addCouponData.cost" :min="0"
                         :precision="0" :step="1" step-strictly/>
      </el-form-item>
      <el-form-item>
        <div style="width: 20px"/>
        <el-button type="primary" @click="submitAddCoupon">
          提交
        </el-button>
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

.my-button {
  float: left;
  margin-left: 12px;
}
</style>
<script setup>
import {computed, ref} from "vue";
import axios2 from "../utils/request2";
import {ElMessage} from "element-plus";

defineExpose({
  name: "GenerateOrder"
})

// 所有的满减券信息
const couponInfo = ref([])
const couponLoading = ref(true)
axios2.get('/coupon/all', null, (data) => {
  couponInfo.value = data
  couponLoading.value = false
})

// 所有的商品信息
const commoditiesInfo = ref([])
const commodityLoading = ref(true)
// 当前要向订单商品列表中增加的商品的信息
const currentCommodity = ref({
  id: null,
  name: null,
  price: null,
  quantity: 1
})
axios2.get('/commodity/all', null, (data) => {
  commoditiesInfo.value = data
  commodityLoading.value = false
})
// 能够向订单商品列表中增加的商品列表，即总的商品信息减去订单商品列表中已存在的信息
const availableCommoditiesList = computed(() => {
  return commoditiesInfo.value.filter((commodity) => {
    for (const usedCommodity of commoditiesList.value) {
      if (commodity.id === usedCommodity.id) {
        return false
      }
    }
    return true
  })
})

//获取当前要向订单商品列表中增加的商品的原价
const getCommodityPrice = computed(() => {
  if (currentCommodity.value.id === null) {
    return null
  }
  for (const commodity of commoditiesInfo.value) {
    if (commodity.id === currentCommodity.value.id) {
      return commodity.price.toFixed(2)
    }
  }
  ElMessage.error('无法获取id为' + currentCommodity.value.id + '的商品的原价')
})

function addCommodityToOrderList() {
  for (const commodity of commoditiesInfo.value) {
    if (commodity.id === currentCommodity.value.id) {
      currentCommodity.value.name = commodity.name
      currentCommodity.value.price = commodity.price
      break
    }
  }
  commoditiesList.value.push({
    id: currentCommodity.value.id,
    name: currentCommodity.value.name,
    price: currentCommodity.value.price,
    quantity: currentCommodity.value.quantity
  })
  currentCommodity.value.id = null
  currentCommodity.value.name = null
  currentCommodity.value.price = null
  currentCommodity.value.quantity = 1
  ElMessage.success('添加成功')
}

const userCoupons = ref([])

function getUserCoupons() {
  axios2.get('/user_coupon/get', {
    params: {
      account: orderData.value.account
    }
  }, (data) => {
    orderData.value.order.couponType = null
    if (couponLoading.value) {
      ElMessage.error('还未获取所有满减券信息')
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].quantity === 0) {
          data.splice(i, 1)
        }
      }
      userCoupons.value = data
      for (const userCoupon of userCoupons.value) {
        for (const couponInfoElement of couponInfo.value) {
          if (userCoupon.couponType === couponInfoElement.type) {
            userCoupon.reliefAmount = couponInfoElement.reliefAmount
            userCoupon.lowestAmount = couponInfoElement.lowestAmount
            break
          }
        }
      }
      ElMessage.success('获取满减券信息成功')
    }
  })
}

function generateCouponName(couponType) {
  for (const couponInfoElement of couponInfo.value) {
    if (couponInfoElement.type === couponType) {
      return '满' + couponInfoElement.lowestAmount + '减' + couponInfoElement.reliefAmount
    }
  }
}

// 订单选择的商品信息列表
const commoditiesList = ref([])

function priceFormatter(row) {
  if (row === null) {
    return null
  }
  return row.price.toFixed(2)
}

function removeCommodityFromList(id) {
  for (let i = 0; i < commoditiesList.value.length; i++) {
    if (commoditiesList.value[i].id === id) {
      commoditiesList.value.splice(i, 1)
      break
    }
  }
}

const ruleFormRef = ref()
// 订单信息
const orderData = ref({
  account: null,
  order: {
    // 订单选择的商品列表
    commodityDTOList: [],
    couponType: null
  }
})

function submitOrder() {
  for (const commodity of commoditiesList.value) {
    orderData.value.order.commodityDTOList.push({
      commodityId: commodity.id,
      number: commodity.quantity
    })
  }
  axios2.post('/order/checkout', orderData.value, (data) => {
    ElMessage.success('结算成功。扣除卡内余额' + data.finalPrice +
        '。获得积分' + data.points)
    orderData.value.account = null
    orderData.value.order.couponType = null
    orderData.value.order.commodityDTOList = []
    userCoupons.value = []
    commoditiesList.value = []
  })
}
</script>

<template>
  <el-container>
    <el-header>
      <div class="title">结账页面</div>
    </el-header>
    <el-main>
      <el-scrollbar height="490px">
        <el-form
            class="my-form"
            ref="ruleFormRef"
            :model="orderData"
            label-width="120px"
            label-position="right"
        >
          <el-form-item label="会员卡号">
            <el-col :span="10">
              <el-input v-model="orderData.account"/>
            </el-col>
            <el-col :span="1"/>
            <el-col :span="3">
              <el-button type="primary" @click="getUserCoupons">确认</el-button>
            </el-col>
            <el-col :span="10"/>
          </el-form-item>
          <el-form-item label="使用满减券">
            <el-select
                v-loading="couponLoading"
                v-model="orderData.order.couponType"
                placeholder="无"
                clearable
            >
              <el-option
                  v-for="item in userCoupons"
                  :key="item.id"
                  :label="generateCouponName(item.couponType)"
                  :value="item.couponType"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="添加商品">
            <el-col :span="5">
              <el-select
                  v-loading="commodityLoading"
                  v-model="currentCommodity.id"
                  placeholder="无"
                  clearable
              >
                <el-option
                    v-for="item in availableCommoditiesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="1"/>
            <el-col :span="1">
              原价
            </el-col>
            <el-col :span="3">
              <el-input v-model="getCommodityPrice" disabled/>
            </el-col>
            <el-col :span="1"/>
            <el-col :span="1">
              数量
            </el-col>
            <el-col :span="5">
              <div>
                <el-input-number
                    v-model="currentCommodity.quantity"
                    :precision="0"
                    :step="1"
                    :min="1"
                    step-strictly
                />
              </div>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="addCommodityToOrderList">增加商品</el-button>
            </el-col>
            <el-col :span="4"/>
          </el-form-item>
          <el-form-item label="商品信息">
            <el-table
                :data="commoditiesList"
                class="my-table"
                width="390px"
                height="220px"
                stripe
            >
              <el-table-column prop="id" label="id" width="80" align="center"/>
              <el-table-column prop="name" label="名称" width="120" align="center"/>
              <el-table-column
                  prop="price"
                  label="原价"
                  width="120"
                  align="center"
                  :formatter="priceFormatter"
              />
              <el-table-column prop="quantity" label="数量" width="80" align="center"/>
              <el-table-column prop="id" label="操作" width="90" align="center">
                <template v-slot:default="info">
                  <el-button text type="danger" @click="removeCommodityFromList(info.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitOrder">提交订单</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style scoped>
div.container {
  height: auto;
  width: 80%;
  margin: auto;
  /*background-color: #2B2B2B;*/
  /*color: #BABABA;*/
}

.my-form {
  background-color: #d3dce6;
  border-radius: 10px;
  opacity: 0.9;
  margin: auto;
  width: 60rem;
  height: 480px;
  padding-top: 10px;
}

div.title {
  text-align: center;
  font-size: 2rem;
  margin: 20px auto;
  line-height: 20px;
}

.my-table {
  width: 490px;
}
</style>
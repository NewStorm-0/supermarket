<script setup>
import {ref, inject, watch} from "vue";
import {ElMessage} from "element-plus";
import {Search} from '@element-plus/icons-vue'
import {compareAsc, format, parse, parseISO} from "date-fns";

defineExpose({
  name: "AdminOrder"
})
const axios = inject('axios')

// 后端返回的订单list，不包含商品信息
const UserOrderList = ref([])
const displayedUserOlderList = ref([])
const loading = ref(true)

//获取会员订单
axios.get('/order/administrator/between', {
  params: {
    startDate: '2022-08-01',
    endDate: '2022-09-22'
  }
})
    .then((response) => {
      if (response.state === 0) {
        UserOrderList.value = response.data
        for (const element of UserOrderList.value) {
          element.paymentAmount = element.paymentAmount.toFixed(2)
          if (element.couponInfo === null) {
            element.couponInfo = '无'
          } else {
            const lowestAmount = element.couponInfo.substring(0, element.couponInfo.indexOf('/'))
            const reliefAmount = element.couponInfo.substring(element.couponInfo.indexOf('/') + 1)
            element.couponInfo = '满' + lowestAmount + '减' + reliefAmount
          }
        }
        displayedUserOlderList.value = UserOrderList.value
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

const searchInput = ref('')

function search() {
  const dataList = dateRange.value === null ? UserOrderList.value
      : displayedUserOlderList.value
  if (searchInput.value === '') {
    displayedUserOlderList.value = dataList.value
  }
  displayedUserOlderList.value = dataList.filter(function (order) {
    // console.log(searchInput.value)
    // console.log(order.id.toString().indexOf(searchInput.value))
    return order.id.toString().indexOf(searchInput.value) !== -1
        || order.userId.toString().indexOf(searchInput.value) !== -1
  })
}

const dateRange = ref(null)

const changeDate = (dateRangeParam) => {
  if (dateRangeParam === null) {
      return -1
  }
  const startDate = parseISO(dateRangeParam[0])
  const endDate = parseISO(dateRangeParam[1])
  console.log('startDate')
  console.log(startDate)
  console.log('endDate')
  console.log(endDate)
  displayedUserOlderList.value = UserOrderList.value.filter(function (order) {
    // let date = parse(order.time, 'yyyy-MM-dd HH:mm:ss', new Date())
    const date = parseISO(format(parseISO(order.time), 'yyyy-MM-dd'))
    // console.log('date')
    // console.log(date)
    // console.log(compareAsc(date, startDate))
    // console.log(compareAsc(date, endDate))
    return compareAsc(date, startDate) >= 0 && compareAsc(date, endDate) <= 0
  })
}

function filterOrders() {
  changeDate(dateRange.value)
  search()
}

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

// 后端返来的订单商品List，其中只包含商品id，数量，买时的原价，折扣价格
// 选择要看的订单的商品的详细信息，需要再次向后端请求数据
const currentOrderCommoditiesList = ref([])
const commoditiesDialogVisible = ref(false)
const dialogTableLoading = ref(true)
const count = ref(0)

async function getCommoditiesInfo(id) {
  currentOrderCommoditiesList.value = []
  // console.log('OrderCommodityList')
  // console.log(that.OrderCommodityList)
  await axios.get('/order/commodity/administrator', {
    params: {
      orderId: id
    }
  }).then((response) => {
    if (response.state === 0) {
      currentOrderCommoditiesList.value = response.data
    } else {
      ElMessage.error(response.message)
    }
  }).catch((error) => {
    console.log(error)
    return -1
  })
  count.value += currentOrderCommoditiesList.value.length
  for (const commodity of currentOrderCommoditiesList.value) {
    axios.get('/commodity/query', {
      params: {
        commodityId: commodity.commodityId
      }
    }).then((response) => {
      if (response.state === 0) {
        // console.log('commodity')
        // console.log(commodity)
        commodity.commodityName = response.data.name
        commodity.originalPrice = commodity.originalPrice.toFixed(2)
        commodity.actualPrice = commodity.actualPrice.toFixed(2)
        count.value--
        //console.log('response count = ' + that.count)
      } else {
        ElMessage({
          type: "error",
          message: response.message
        })
      }
    }).catch((error) => {
      console.log(error)
    })
    if (count.value === 0) {
      dialogTableLoading.value = false
      //console.log('没有监听')
    } else {
      //console.log('开始监听')
      const unwatch = watch(count, (newVal, oldVal) => {
            //console.log('newVal')
            //console.log(newVal)
            if (newVal === 0) {
              dialogTableLoading.value = false
              unwatch()
            }
          }
      )
      //console.log('监听成功')
    }
  }
}

function checkOrderCommodities(id) {
  commoditiesDialogVisible.value = true
  getCommoditiesInfo(id)
  // console.log(this.OrderCommodityList)
}
</script>

<template>
  <div class="container">
    <h1>订单一览</h1>
    <div style="text-align: center; max-width: 840px; margin: auto">
      <el-date-picker
          style="float: left; width: 260px"
          v-model="dateRange"
          type="daterange"
          start-placeholder="起始日期"
          end-placeholder="截止日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
          @change="filterOrders"
      />
      <el-input
          v-model="searchInput"
          class="search"
          placeholder="输入订单号或会员卡号"
          :prefix-icon="Search"
          @input="filterOrders"
      />
      <el-table :data="displayedUserOlderList"
                class="my-el-table"
                empty-text="无数据"
                v-loading="loading"
                max-height="calc(100vh - 250px)"
                highlight-current-row
                stripe
                lazy
                :default-sort="{ prop: 'time', order: 'descending' }"
      >
        <!-- 上行这里应该有一个函数，传入UserId -->
        <el-table-column prop="time" label="日期" width="170" sortable align="center"/>
        <el-table-column prop="id" label="订单号" width="90"/>
        <el-table-column prop="userId" label="会员卡号" width="90"/>
        <el-table-column prop="paymentAmount" label="订单金额" width="140" sortable align="center"/>
        <el-table-column prop="rewardPoints" label="获得积分" width="100" align="center"/>
        <el-table-column prop="couponInfo" label="使用满减券" width="150" align="center"/>
        <el-table-column prop="id" label="订单详情" width="100" align="center">
          <template v-slot:default='info'>
            <el-button text class="text-button" @click="checkOrderCommodities(info.row.id)">
              点击查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog v-model="commoditiesDialogVisible" center draggable :modal="false"
             title="订单商品详情" width="530px">
    <el-table :data="currentOrderCommoditiesList"
              class="commodity-table"
              v-loading="dialogTableLoading"
              max-height="calc(60vh - 2rem)"
              highlight-current-row
              stripe
              lazy
              :default-sort="{ prop: 'originalPrice', order: 'descending' }"
    >
      <!-- 上行这里应该有一个函数，传入UserId -->
      <el-table-column prop="commodityId" label="商品号" width="80"/>
      <el-table-column prop="commodityName" label="名称" width="110" align="center"/>
      <el-table-column prop="quantity" label="数量" width="90" sortable align="center"/>
      <el-table-column prop="originalPrice"
                       label="原价" width="100" align="center" sortable/>
      <el-table-column prop="actualPrice" label="折扣价" width="100" align="center"/>
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
  max-width: 840px;
}

.text-button {
  margin: auto -5px;
}

.commodity-table {
  max-width: 480px;
  margin: auto;
}

.search {
  min-width: 100px;
  max-width: 200px;
  margin-bottom: 10px;
  float: right;
}
</style>
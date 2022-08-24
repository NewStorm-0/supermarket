<script setup>
import {computed, inject, onMounted, onUpdated, ref} from "vue";
import axios2 from "../../utils/request2.js";
import {format, subDays} from 'date-fns'

defineExpose({
  name: "AdminIndex"
})
const todayRechargeData = ref([])
const todayRechargeLoading = ref(true)
axios2.get('/charge/administrator/between', {
  params: {
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  }
}, (response) => {
  todayRechargeData.value = response
  todayRechargeLoading.value = false
})

const todayRechargeSum = computed(() => {
  let sum = 0;
  for (const data of todayRechargeData.value) {
    sum += data.amount
  }
  return sum.toFixed(2)
})

const todayConsumptionData = ref([])
const todayConsumptionLoading = ref(true)
axios2.get('/order/administrator/between', {
  params: {
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  }
}, (data) => {
  todayConsumptionData.value = data
  todayConsumptionLoading.value = false
})

const todayConsumptionSum = computed(() => {
  let sum = 0
  for (const consumption of todayConsumptionData.value) {
    sum += consumption.paymentAmount
  }
  return sum.toFixed(2)
})

const echarts = inject('echarts')
const consumptionChart = ref(null)

let myChart
onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  myChart = echarts.init(consumptionChart.value, 'dark');
  // 使用刚指定的配置项和数据显示图表。
})
onUpdated(() => {
  myChart = echarts.init(consumptionChart.value, 'dark');
})

const xAxis = []
for (let i = 0; i < 7; i++) {
  xAxis.push(format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'))
}
const seriesData = []
const lastWeekConsumptionData = ref([])
const lastWeekConsumptionLoading = ref(true)
axios2.get('/order/administrator/between', {
  params: {
    startDate: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  }
}, (data) => {
  lastWeekConsumptionData.value = data
  for (const date of xAxis) {
    let sum = 0
    for (const consumption of lastWeekConsumptionData.value) {
      if (format(consumption.time, 'yyyy-MM-dd') === date) {
        sum += consumption.paymentAmount
      }
    }
    seriesData.push(sum)
  }// 指定图表的配置项和数据
  const option = {
    title: {
      text: '过去一周会员消费总额'
    },
    tooltip: {},
    legend: {
      data: ['当日消费总额']
    },
    xAxis: {
      data: xAxis
    },
    yAxis: {},
    series: [
      {
        name: '当日消费总额',
        type: 'bar',
        data: seriesData
      }
    ]
  };
  myChart.setOption(option);
  lastWeekConsumptionLoading.value = false
})
</script>

<template>
  <el-row>
    <el-col :span="1"/>
    <el-col :span="9">
      <el-card class="box-card" v-loading="todayRechargeLoading">
        <template #header>
          <div class="card-header">
            <span class="text">今日会员充值</span>
          </div>
        </template>
        <div class="card-content">
          {{ todayRechargeSum }}
        </div>
      </el-card>
    </el-col>
    <el-col :span="4"/>
    <el-col :span="9">
      <el-card class="box-card" v-loading="todayConsumptionLoading">
        <template #header>
          <div class="card-header">
            <span class="text">今日会员消费</span>
          </div>
        </template>
        <div class="card-content">
          {{ todayConsumptionSum }}
        </div>
      </el-card>
    </el-col>
    <el-col :span="1"/>
  </el-row>
  <div ref="consumptionChart"
       class="chart"
       v-loading="lastWeekConsumptionLoading"
  />
</template>

<style lang="scss" scoped>
//.card-header {
//  display: flex;
//  justify-content: space-between;
//  align-items: center;
//}

.box-card {
  //background-color: #87cbfd;
  background-color: #a3c4e5;
  border-radius: 30px;
  width: 300px;
}

.text {
  font-size: 1.5rem;
}

.button {
  font-weight: bold;
}

div.card-content {
  font-weight: bolder;
  font-size: 2.5rem;
  margin-right: 0;
  text-align: right;
}

.chart {
  width: 760px;
  height: 320px;
  margin: 20px auto -980px;
  padding-bottom: -980px;
}

html.dark {
  .box-card {
    background-color: #1F242B;
  }

  .button {
    color: #a5cbe0;
  }
}
</style>
<!--
购买记录查询和商品查询应该分开，因为没有购买过的商品应该也可以查询 
这部分是购买记录查询，暂时不在每一条后面加入商品查询的入口
-->
<script>
import {ElMessage} from "element-plus";

export default {
  name: 'UserOrder',
  data() {
    return {
      // 后端返来的订单商品List，其中只包含商品id，数量，买时的原价，折扣价格
      OrderCommodityList: [],
      // 后端返回的订单list，不包含商品信息
      UserOrderList: [],
      loading: true,
      // 用户当前选择要看的订单的商品的详细信息，需要再次向后端请求数据
      currentOrderCommoditiesList: [],
      commoditiesDialogVisible: false,
      dialogTableLoading: true,
      count: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const that = this
      this.axios.get('/order/user')
          .then((response) => {
            if (response.state === 0) {
              that.UserOrderList = response.data.UserOrderList
              that.OrderCommodityList = response.data.OrderCommodityList
              for (const element of that.UserOrderList) {
                element.paymentAmount = element.paymentAmount.toFixed(2)
                if (element.couponInfo === null) {
                  element.couponInfo = '无'
                } else {
                  const lowestAmount = element.couponInfo.substring(0, element.couponInfo.indexOf('/'))
                  const reliefAmount = element.couponInfo.substring(element.couponInfo.indexOf('/') + 1)
                  element.couponInfo = '满' + lowestAmount + '减' + reliefAmount
                }
              }
              that.loading = false
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
    },
    // 写一半发现写错了的方法，写成了请求所有订单的商品信息
    getAllOrdersCommoditiesInfo() {
      const that = this
      let request = []
      let count = 0
      for (const orderCommodity of this.OrderCommodityList) {
        request.push(this.axios.get('/commodity/query', {
          params: {
            commodityId: orderCommodity.commodityId
          }
        }))
      }
      Promise.all(request)
          .then((response) => {
            for (const responseElement of response) {
              if (responseElement.state === 0) {
                that.OrderCommodityList[count].name = responseElement.data.name
              } else {
                ElMessage({
                  type: "error",
                  message: responseElement.message
                })
              }
              count++
            }
          })
          .catch((error) => {
            console.log(error)
          })
    },
    async getCommoditiesInfo(id) {
      this.currentOrderCommoditiesList = []
      const that = this
      // console.log('OrderCommodityList')
      // console.log(that.OrderCommodityList)
      for (const orderCommodities of this.OrderCommodityList) {
        // console.log('orderCommodities')
        // console.log(orderCommodities[0])
        if (orderCommodities[0].orderId === id) {
          that.count += orderCommodities.length
          for (const commodity of orderCommodities) {
            if (typeof(commodity.originalPrice) === 'string') {
              that.currentOrderCommoditiesList.push(commodity)
              continue
            }
            this.axios.get('/commodity/query', {
              params: {
                commodityId: commodity.commodityId
              }
            }).then((response) => {
              if (response.state === 0) {
                // console.log('commodity')
                // console.log(commodity)
                const temp = commodity
                temp.commodityName = response.data.name
                temp.originalPrice = temp.originalPrice.toFixed(2)
                temp.actualPrice = temp.actualPrice.toFixed(2)
                that.currentOrderCommoditiesList.push(temp)
                that.count--
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
          }
        }
      }
      if (that.count === 0) {
        that.dialogTableLoading = false
        //console.log('没有监听')
      } else {
        //console.log('开始监听')
        const unwatch = that.$watch(() => that.count, (newVal, oldVal) => {
              //console.log('newVal')
              //console.log(newVal)
              if (newVal === 0) {
                that.dialogTableLoading = false
                unwatch()
              }
            }
        )
        //console.log('监听成功')
      }
    },
    checkOrderCommodities(id) {
      this.commoditiesDialogVisible = true
      this.getCommoditiesInfo(id)
      // console.log(this.OrderCommodityList)
    },
    handleClose(done) {
      //this.currentOrderCommoditiesList = []
      done()
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>订单详情</h1>
    <el-table :data="UserOrderList"
              class="my-el-table"
              v-loading="loading"
              max-height="calc(100vh - 200px)"
              highlight-current-row
              stripe
              lazy
              :default-sort="{ prop: 'time', order: 'descending' }"
    >
      <!-- 上行这里应该有一个函数，传入UserId -->
      <el-table-column prop="time" label="日期" width="170" sortable/>
      <el-table-column prop="id" label="订单号" width="90"/>
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
  <el-dialog v-model="commoditiesDialogVisible" center draggable :modal="false"
             title="订单商品详情" :before-close="handleClose" width="530px">
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
.container {
  /* color:aliceblue; */
  /*text-align: center;*/
  /* background:url("https://s1.ax1x.com/2022/08/14/vUmrWD.jpg"); */
  /* background:url("D:\0学习\vue学习and实践\supermarket\src\assets\logo.svg"); */
  /*width: auto;*/
  /*height: auto;*/
  /*max-height: calc(100vh - 180px);*/
}

h1 {
  text-align: center;
}

.my-el-table {
  height: auto;
  margin: auto;
  max-width: 750px;
}

.text-button {
  margin: auto -5px;
}

.commodity-table {
  max-width: 480px;
  margin: auto;
}
</style>

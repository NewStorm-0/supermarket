<script>
import {ElMessage} from "element-plus";

export default {
  name: 'UserBillDetails',
  created() {
    this.getBillDetailsData()
  },
  methods: {
    //监听 pagesize 改变的事件
    size_change(newSize) {
      this.pageSize = newSize
    },
    //监听 页码值 改变的事件
    current_change(newPage) {
      this.currentPage = newPage
    },
    getBillDetailsData() {
      const that = this

      function getRechargeRecords() {
        return that.axios.get('/charge/user')
      }

      function getUserOrders() {
        return that.axios.get('/order/user')
      }

      function getRedeemRecords() {
        return that.axios.get('/redeem/user')
      }

      Promise.all([getRechargeRecords(), getUserOrders(), getRedeemRecords()])
          .then((response) => {
            if (response[0].state === 0) {
              if (response[1].state === 0) {
                if (response[2].state === 0) {
                  for (const rechargeRecord of response[0].data) {
                    const temp = {
                      date: rechargeRecord.time,
                      balanceChange: '+' + rechargeRecord.amount.toFixed(2),
                      pointChange: '—',
                      id: rechargeRecord.id,
                      type: '充值'
                    }
                    that.billDetailsData.push(temp)
                  }
                  for (const userOrder of response[1].data.UserOrderList) {
                    const temp = {
                      date: userOrder.time,
                      balanceChange: '-' + userOrder.paymentAmount.toFixed(2),
                      pointChange: '+' + userOrder.rewardPoints,
                      id: userOrder.id,
                      type: '购物订单'
                    }
                    that.billDetailsData.push(temp)
                  }
                  for (const redeemRecord of response[2].data) {
                    const temp = {
                      date: redeemRecord.time,
                      balanceChange: '—',
                      pointChange: '-' + redeemRecord.value,
                      id: redeemRecord.id,
                      type: '满减券兑换'
                    }
                    that.billDetailsData.push(temp)
                  }
                  that.billDetailsData.sort(function (x, y) {
                    if (x.date < y.date) {
                      return 1
                    } else if (x.date > y.date) {
                      return -1
                    } else {
                      return 0
                    }
                  })
                  that.loading = false
                }
              } else {
                ElMessage.error(response[1].message)
              }
            } else {
              ElMessage.error(response[0].message)
            }
          })
          .catch((error) => {
            console.log(error)
          })
    }
  },
  data() {//我的建议是你传数据就按照时间顺序传，这边没有保险措施
    return {
      billDetailsData: [],
      loading: true,
      pageSize: 7,//每页显示条目个数
      currentPage: 1,//当前页数
    }
  },
  computed: {
    currentBillDetailsData() {
      return this.billDetailsData.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
      )
    }
  }
}

function formatNum(num) {
  if (num > 0) {
    return '+' + num;
  } else {
    return '' + num;
  }
}
</script>

<template>
  <div class="container">
    <h1>流水查询</h1>
    <div class="wrapper" v-loading="loading">
      <el-table :data="currentBillDetailsData"
                highlight-current-row
                stripe
                lazy
                class="table">
        <el-table-column prop="date" label="日期" width="170"/>
        <el-table-column prop="balanceChange" label="余额变动" width="120" align="center"/>
        <el-table-column prop="pointChange" label="积分变动" width="120" align="center"/>
        <el-table-column prop="id" label="事项单号" width="120"/>
        <el-table-column prop="type" label="事项备注" width="120"/>
      </el-table>
      <el-pagination
          @size-change="size_change"
          @current-change="current_change"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="billDetailsData.length"
      >
      </el-pagination>
    </div>

  </div>
</template>

<style scoped>
.el-pagination {
  text-align: center;
  margin-top: 10px;
  margin-left: 10px;
}

/*最外层透明*/
.el-table, .el-table__expanded-cell {
  background-color: transparent;
}

/* 表格内背景颜色 */
.el-table th,
.el-table tr,
.el-table td {
  background-color: transparent;
}

.container {
  text-align: center;
}

.table {
  text-align: center;
  margin: auto;
  max-width: 650px;
}

.wrapper {
  max-width: 650px;
  text-align: center;
  margin: auto;
  background-color: #ffffff;
}

html.dark .wrapper {
  background-color: transparent;
}
</style>
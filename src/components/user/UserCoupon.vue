<script setup>
defineExpose({
  name: "UserCoupon"
})
</script>

<script>
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      userCoupon: [],
      loading: true
    }
  },
  created() {
    const that = this

    function getCouponInfo() {
      return that.axios.get('/coupon/all')
    }

    function getUserCoupon() {
      return that.axios.get('/user_coupon/user')
    }

    Promise.all([getCouponInfo(), getUserCoupon()])
        .then(function (response) {
          //console.log(response)
          if (response[0].state === 0) {
            if (response[1].state === 0) {
              for (const userCouponResponse of response[1].data) {  // 会员持有的
                for (const couponInfoResponse of response[0].data) {  // 所有的满减券信息
                  if (userCouponResponse.couponType === couponInfoResponse.type &&
                      userCouponResponse.quantity > 0) {
                    that.userCoupon.push({
                      id: userCouponResponse.id,
                      couponType: userCouponResponse.couponType,
                      reliefAmount: couponInfoResponse.reliefAmount,
                      lowestAmount: couponInfoResponse.lowestAmount,
                      quantity: userCouponResponse.quantity
                    })
                    break
                  }
                }
              }
              that.loading = false
            } else {
              ElMessage({
                type: 'error',
                message: response[1].message
              })
            }
          } else {
            ElMessage({
              type: 'error',
              message: response[0].message
            })
          }
        })
        .catch(function (error) {
          console.log(error[0])
          console.log(error[1])
        })
  }
}
</script>

<template>
  <el-scrollbar class="scroll" v-loading="loading" height="100%">
    <el-space wrap>
      <el-card
          v-for="i in userCoupon"
          :key="i.id"
          class="box-card"
      >
        <template #header>
          <div class="card-header">
              <span>
                满{{ i.lowestAmount }}减{{ i.reliefAmount }}
              </span>
          </div>
        </template>
        <div class="card-content">
          {{ i.quantity }}张
        </div>
      </el-card>
    </el-space>
  </el-scrollbar>
</template>

<style scoped>
.scroll {
  padding: 10px;
  border-radius: 10px;
  height: auto;
}

.box-card {
  background-image: linear-gradient(to bottom right,
  rgb(141, 224, 99), rgb(19, 217, 51), rgb(141, 224, 99));
}

.card-header {
  font-size: 40px;
  font-weight: bolder;
  text-align: center;
}

.card-content {
  text-align: right;
}

html.dark .box-card {
  background-image: linear-gradient(to bottom right,
  rgb(72, 114, 50), rgb(14, 154, 37), rgb(72, 114, 50));
}
</style>
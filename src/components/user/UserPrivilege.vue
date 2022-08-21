<script setup>
import {userStore} from "../../stores/userStore";

defineExpose({
  name: "UserPrivilege"
})

const membershipLevel = JSON.parse(sessionStorage.getItem("membership_level_all"))
</script>

<template>
  <div>
    <el-container>
      <el-aside width="250px">
        <div class="left-top">您的会员等级</div>
        <el-card class="box-card" :class="'level' + userStore.user.level">
          <template #header>
            <div class="card-header">
              <span class="text">
                {{ membershipLevel[userStore.user.level - 1].name }}会员
              </span>
            </div>
          </template>
          <div class="card-content">
            <div class="clause">
              结算折扣为{{ membershipLevel[userStore.user.level - 1].discount }}折
            </div>
            <div class="clause">购买享受积分回馈</div>
          </div>
        </el-card>
      </el-aside>
      <div style="width: 30px"/>
      <el-main class="my-el-main">
        <div class="right-top">会员等级及权益一览</div>
        <el-scrollbar height="23rem" always="true" class="scroll">
          <el-space wrap>
            <el-card
                v-for="i in membershipLevel"
                :key="i.type"
                width="250px"
                class="box-card"
                :class="'level' + i.type"
            >
              <template #header>
                <div class="card-header">
              <span class="text">
                {{ i.name }}会员
              </span>
                </div>
              </template>
              <div class="card-content">
                <div class="clause">初始金额为{{i.requiredAmount}}元</div>
                <div class="clause">
                  结算折扣为{{ i.discount }}折
                </div>
                <div class="clause">购买享受积分回馈</div>
              </div>
            </el-card>
          </el-space>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
div.left-top {
  text-align: center;
  font-size: 30px;
  margin: 20px;
}

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

.my-el-main {
  overflow-y: hidden;
}

.scroll {
  padding: 10px;
  border-radius: 10px;
}

@import "../../assets/membership_level";
</style>
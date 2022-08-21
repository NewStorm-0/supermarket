<template>
  <el-menu :default-active="userLocation" class="my-el-menu" router>
    <el-menu-item index="index">
      <el-icon>
        <HomeFilled/>
      </el-icon>
      首页
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <User/>
        </el-icon>
        <span>账号管理</span>
      </template>
      <el-menu-item index="information">个人信息</el-menu-item>
      <el-menu-item index="privilege">会员权益</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <Present/>
        </el-icon>
        <span>满减券管理</span>
      </template>
      <el-menu-item index="3-1">你的满减券</el-menu-item>
      <el-menu-item index="3-2">满减券兑换</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="4">
      <el-icon>
        <ShoppingTrolley/>
      </el-icon>
      <span>订单一览</span>
    </el-menu-item>
    <el-menu-item index="5">
      <el-icon>
        <List/>
      </el-icon>
      <span>流水查询</span>
    </el-menu-item>
    <el-menu-item index="6">
      <el-icon>
        <Goods/>
      </el-icon>
      <span>商品一览</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {computed} from "vue";

defineExpose({
  name: "UserSideBar"
})
const route = useRoute()
const userLocation = computed(() => {
  // if (route.name === 'UserIndex') {
  //   return 'index'
  // } else if (route.name === 'UserInformation') {
  //   return 'information'
  // }
  let path = route.path
  path = path.substring(6)
  return  path.substring(path.indexOf('/') + 1)
})
</script>

<style lang="scss" scoped>
.my-el-menu {
  opacity: 0.8;
}

html.dark {
  .my-el-menu {
    background-color: #000000;
  }
}
</style>
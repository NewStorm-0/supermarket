<template>
  <el-container>
    <el-header>
      <UserHeader/>
    </el-header>

    <el-container>
      <el-aside width="12.5rem" class="my-el-aside">
        <UserSideBar/>
      </el-aside>
      <el-main class="my-el-main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import UserHeader from "../components/user/UserHeader.vue";
import UserSideBar from "../components/user/UserSideBar.vue";
import {onUnmounted} from "vue";
import {userStore} from "../stores/userStore";

defineExpose({
  name: "UserPage"
})

onUnmounted(() => {
  sessionStorage.clear()
  userStore.value.user = null
  userStore.value.membershipLevel = null
  console.log('注销成功')
})
</script>

<style lang="scss" scoped>
.my-el-aside {
  height: auto;
  min-height: 550px;
  background-color: rgba(205, 214, 222, 0.6);
  border-radius: 5px;
}

.my-el-main {
  border-radius: 10px;
  background-color: rgba(205, 214, 222, 0.6);
  margin: 10px;
  padding: 25px;
}

html.dark {
  .my-el-aside {
    background-color: rgba(32, 29, 21, 0.6);
  }

  .my-el-main {
    background-color: rgba(32, 29, 21, 0.6);
  }
}

</style>
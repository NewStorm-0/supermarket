<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>

    <el-container>
      <el-aside width="12.5rem" class="my-el-aside">
        <SideBar/>
      </el-aside>
      <el-main class="my-el-main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Header from "../components/user/Header.vue";
import SideBar from "../components/user/SideBar.vue";

defineExpose({
  name: "UserPage"
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
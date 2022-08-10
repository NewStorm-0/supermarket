<template>
  <el-container>
    <el-aside width="12rem">
      <el-menu default-active="1">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户啊对对对</span>
          </template>

        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-main>
      这里是用户首页捏
      <p>您的 account 为 {{ route.params.account }}</p>
      <p>你的会员等级为 {{ user.level }}</p>
    </el-main>
  </el-container>
</template>

<script setup>
import {ref, reactive, inject} from 'vue'
import {useRouter, useRoute} from 'vue-router'

const router = useRouter()
const route = useRoute()

defineExpose({
  name: 'UserHome'
})

const user = JSON.parse(sessionStorage.getItem('user'))
</script>

<style scoped>

</style>
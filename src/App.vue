<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {useDark, useToggle} from '@vueuse/core'
import {computed, onMounted} from "vue";
import {useLoginStore} from "./stores/login.js"
import {storeToRefs} from 'pinia'

const isDark = useDark()
// isDark.value = true
const toggleDark = useToggle(isDark)
const {login, setLogin} = storeToRefs(useLoginStore())

// useLoginStore().$subscribe((mutation, state) => {
//   if (sessionStorage.getItem())
//   alert('nmsl')
//   sessionStorage.setItem('login', JSON.stringify(state))
// })

// 在页面刷新时将store保存到sessionStorage里
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('login', JSON.stringify(useLoginStore().$state))
  console.log('save')
})

onMounted(() => {
  // 在页面加载时读取sessionStorage里的状态信息
  if (sessionStorage.getItem('login')) {
    // 存储状态
    console.log('load')
    const login = JSON.parse(sessionStorage.getItem('login')).login
    useLoginStore().setLogin(login.account, login.level, login.login)
    console.log(sessionStorage.getItem('membership_level_all'))
  }
})
console.log(login)
const level = computed(() => {
  if (login.value.level === 1) {
    return '白银'
  } else if (login.value.level === 2) {
    return '黄金'
  } else {
    return 'smjb'
  }
})
</script>

<template>

  <el-container>
    <el-header class="top">
      <div class="content">超市会员系统</div>
      <div style="flex: 1"></div>
      <div class="user" v-if="login.login">尊敬的{{ level }}会员 {{ login.account }}</div>
      <div class="logout" v-if="login.login">
        <el-button type="danger" plain>注销</el-button>
      </div>
      <div class="switch">
        <el-switch
            size="large"
            v-model="isDark"
            inline-prompt
            active-icon="Moon"
            inactive-icon="Sunny"
            @change="toggleDark"
        />
      </div>
    </el-header>
    <RouterView/>
  </el-container>
</template>

<style scoped>
.content {
  font-size: 2rem;
  font-weight: bold;
}

.user {
  margin-right: 2rem;
}

.logout {
  margin-right: 1rem;
}

.el-header.top {
  border-top: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
}

.el-switch {
  height: auto;
  align-items: center;
}
</style>

<script setup>
import {useDark, useToggle} from '@vueuse/core'
import {computed, onBeforeMount} from "vue";
import {userStore} from "../../stores/userStore";
import {useRouter} from 'vue-router'

const isDark = useDark()
// isDark.value = true
const toggleDark = useToggle(isDark)

onBeforeMount(() => {
  if (userStore.value.user === null || userStore.value.membershipLevel === null) {
    userStore.value.user = JSON.parse(sessionStorage.getItem("user"))
    userStore.value.membershipLevel = JSON.parse(sessionStorage.getItem("membership_level_all"))
  }
})


window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("user", JSON.stringify(userStore.value.user))
  sessionStorage.setItem("membership_level_all", JSON.stringify(userStore.value.membershipLevel))
})

const level = computed(() => {
  const membershipLevel = JSON.parse(sessionStorage.getItem("membership_level_all"))
  // const membershipLevel = userStore.value.membershipLevel
  return membershipLevel[userStore.value.user.level - 1].name
})
const router = useRouter()
function logOut() {
  sessionStorage.clear()
  userStore.value.user = null
  userStore.value.membershipLevel = null
  router.push({
    name: "UserLogin"
  })
}


defineExpose({
  name: 'UserHeader',
})
</script>

<template>
  <div class="header-top">
    <div class="content">超市会员系统</div>
    <div style="flex: 1"></div>
    <div v-if="userStore.user" style="display: inline-flex;">
      <div class="user">
        <img src="/photo.jpg">
        <div style="width: 10px"></div>
        <div class="my-content">
          尊敬的{{ level }}会员，{{ userStore.user.account }}
        </div>
      </div>
      <div class="logout">
        <el-button type="danger" size="small" style="margin-top: 17.8px" @click="logOut">
          <el-icon>
            <SwitchButton/>
          </el-icon>
          <span>注销</span>
        </el-button>
      </div>
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
  </div>
</template>

<style scoped>

.content {
  font-size: 2rem;
  font-weight: bold;
}

.user {
  display: flex;
  margin-right: 1rem;
  height: auto;
  width: auto;
}

.logout {
  margin-right: 1rem;
}

.header-top {
  height: 100%;
  width: 100%;
  /*border-top: 1px solid var(--el-border-color);*/
  /*border-bottom: 1px solid var(--el-border-color);*/
  display: flex;
  align-items: center;
}

.el-switch {
  height: auto;
  align-items: center;
}

img {
  margin-top: 5px;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: rgb(12, 177, 0);
}

div .my-content {
  text-align: center;
  line-height: 60px;
  font-weight: normal;
}
</style>
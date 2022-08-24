<script setup>
import {useDark, useToggle} from '@vueuse/core'

defineExpose({
  name: "AdminHeader"
})
const isDark = useDark()
// isDark.value = true
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="header-top">
    <div class="content">超市会员管理系统</div>
    <div style="flex: 1"></div>
    <div class="switch">
      <el-switch
          size="large"
          v-model="isDark"
          inline-prompt
          class="my-switch"
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

.my-switch {
  --el-switch-on-color: #424242;
}
</style>
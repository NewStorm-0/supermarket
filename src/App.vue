<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {useDark, useToggle} from '@vueuse/core'
import {reactive} from "vue";

const isDark = useDark()
// isDark.value = true
const toggleDark = useToggle(isDark)

const counter1 = reactive({ count: 0 })
var counter2 = {count:0}
function Function(){
  counter1.count = counter1.count + 1;
  counter2.count = counter2.count - 1;
}
</script>

<template>
  <el-container>
    <el-header class="top">
      <div class="content">超市会员系统</div>
      <div style="flex: 1"></div>
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
  </el-container>

  <p>Count1 is: {{ counter1.count }}</p>
  <p>
    Count2 is: {{counter2.count}}
  </p>
  <button @click = "Function"> click me </button>

  <RouterView/>
</template>

<style scoped>
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

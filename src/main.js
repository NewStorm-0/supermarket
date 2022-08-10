import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import service from "./utils/request";

/**
 * 设置axios请求的地址默认是'/api',这样根据第一步中配置的会将/api替
 * 换为'http://localhost:8080/'
 */
axios.defaults.baseURL = "/api"

const app = createApp(App)

/**
 * 引入vue-axios，一个对axios的轻度封装
 */
app.use(VueAxios, service)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'

/**
 * 引入element-plus UI
 */
app.use(ElementPlus, {
    local: zhCn
})

/**
 * 引入element-plus icon
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.mount('#app')

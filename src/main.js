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

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    BarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

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
 * 引入echarts
 */
app.config.globalProperties.echarts = echarts
app.provide('echarts', app.config.globalProperties.echarts)

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

export default app.config.globalProperties.axios
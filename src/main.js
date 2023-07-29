import { createApp } from 'vue'
import App from './App.vue'
import { Lazyload } from 'vant'
import router from './router'
import { createPinia } from 'pinia'

import 'amfe-flexible' // 计算设置rem的基准值，即html的font-size

import 'vant/es/notify/style'
import 'vant/es/dialog/style'
import 'vant/es/toast/style'

import 'uno.css'
import './css/common.less'

const pinia = createPinia()
const app = createApp(App)
app
    .use(Lazyload)
    .use(router)
    .use(pinia)
    .mount('#app')

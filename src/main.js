import { createApp } from 'vue'
import pinia from './stores/index'
import App from './App.vue'
import router from './router'

// 引入图标
import '@/assets/font_uki38dr1u6/iconfont.js'
import '@/assets/font_uki38dr1u6/iconfont.css'

import '@/assets/css/main.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

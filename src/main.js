import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)// 确保这里正确使用了 router
app.mount('#app')

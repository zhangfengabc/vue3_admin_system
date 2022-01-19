import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)
// app.config.globalProperties.$filters = {
//   prefix (url) {
//     if (url && url.startsWith('http')) {
//       return url
//     } else {
//       return `http://backend-api-02.newbee.ltd${url}`
//     }
//   }
// }
app.use(ElementPlus).use(store).use(router).mount('#app')

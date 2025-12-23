import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './routes'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import pinia from './stores/index.js'
import { ParticlesComponent } from 'particles.vue3'

// 主题相关
import './styles/theme.css'
import './styles/dark-theme.css'
import './views/components/ThemeSwitch.vue'
import { useThemeStore} from "@/stores/theme.js";
import ThemeSwitch from "@/views/components/ThemeSwitch.vue";
import 'element-plus/theme-chalk/dark/css-vars.css'
import {getTheme} from "@/utils/storage.js"; // 引入暗黑主题

const app = createApp(App)
const savedTheme = getTheme()
const html = document.documentElement
if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark')
} else {
    html.removeAttribute('data-theme')
}
app.use(ElementPlus, {
    locale: zhCn,
})


app.use(router)
app.use(pinia)

app.component('ThemeSwitch', ThemeSwitch)

app.config.globalProperties.$initTheme = () => {
    const themeStore = useThemeStore()
    themeStore.initTheme()
}

app.mount('#app')

// 应用挂载后初始化主题

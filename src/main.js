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

const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn,
})


app.use(router)
app.use(pinia)

app.component('ThemeSwitch', ThemeSwitch)


app.mount('#app')

// 应用挂载后初始化主题
app.config.globalProperties.$nextTick(() => {
    const themeStore = useThemeStore()
    themeStore.initTheme()
})
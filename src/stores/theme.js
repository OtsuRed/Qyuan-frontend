import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
    // 默认主题 (从localStorage读取或默认light)
    const currentTheme = ref(localStorage.getItem('theme') || 'light')

    // 切换主题
    const toggleTheme = async () => {
        const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
        await setTheme(newTheme)
    }

    // 设置主题
    const setTheme = async (theme) => {
        currentTheme.value = theme

        // 更新HTML的data-theme属性
        document.documentElement.setAttribute('data-theme', theme)

        // 保存到localStorage
        localStorage.setItem('theme', theme)

        // 调用API保存用户偏好
        await saveThemeToAPI(theme)
    }

    // 保存主题到API
    const saveThemeToAPI = async (theme) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token')
            if (!token) return

            const response = await fetch('http://localhost:8080/api/user/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    theme_type: theme
                })
            })

            if (!response.ok) {
                throw new Error('保存主题设置失败')
            }

            const data = await response.json()
            console.log('主题设置保存成功:', data)
        } catch (error) {
            console.error('保存主题设置失败:', error)
            // 即使API失败，也保持本地设置
        }
    }

    // 从API获取用户主题设置
    const fetchUserTheme = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token')
            if (!token) return

            const response = await fetch('http://localhost:8080/api/user/theme', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                if (data.theme_type) {
                    await setTheme(data.theme_type)
                }
            }
        } catch (error) {
            console.error('获取主题设置失败:', error)
        }
    }

    // 初始化主题
    const initTheme = () => {
        // 设置初始主题
        document.documentElement.setAttribute('data-theme', currentTheme.value)

        // 如果已登录，从API获取主题设置
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (token) {
            fetchUserTheme()
        }
    }

    // 监听主题变化，更新CSS变量
    watch(currentTheme, (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme)
    })

    return {
        currentTheme,
        toggleTheme,
        setTheme,
        initTheme,
        fetchUserTheme
    }
})
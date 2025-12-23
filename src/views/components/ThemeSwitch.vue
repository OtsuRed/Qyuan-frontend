<template>
  <div class="theme-switch">
    <button
        class="theme-toggle"
        :class="{ 'dark': isDark }"
        @click="toggleTheme"
        :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
        aria-label="切换主题"
    >
      <div class="toggle-track">
        <div class="toggle-thumb">
          <span class="sun-icon">☀️</span>
          <span class="moon-icon">🌙</span>
        </div>
      </div>
      <span class="theme-label">
        {{ isDark ? '深色模式' : '浅色模式' }}
      </span>
    </button>

    <div v-if="showAdvanced" class="theme-options">
      <div class="theme-presets">
        <button
            v-for="preset in themePresets"
            :key="preset.id"
            class="preset-btn"
            :class="{ active: currentPreset === preset.id }"
            @click="selectPreset(preset)"
        >
          <div class="preset-preview" :style="preset.style"></div>
          <span class="preset-name">{{ preset.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, computed, onMounted } from 'vue'
import { getTheme, setTheme } from '@/utils/storage.js'

const showAdvanced = ref(false)

// 主题预设
const themePresets = ref([
  {
    id: 'light',
    name: '浅色',
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  {
    id: 'dark',
    name: '深色',
    style: {
      background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
    }
  },
  {
    id: 'auto',
    name: '自动',
    style: {
      background: 'linear-gradient(135deg, #667eea 50%, #2d2d2d 50%)'
    }
  }
])

const currentPreset = ref('light')

// 从localStorage获取当前主题
const currentTheme = ref(getTheme())

const isDark = computed(() => currentTheme.value === 'dark')

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  setTheme(newTheme)
  currentTheme.value = newTheme
  applyTheme(newTheme)
  currentPreset.value = newTheme
}

const selectPreset = (preset) => {
  currentPreset.value = preset.id

  if (preset.id === 'auto') {
    // 自动模式：根据系统主题切换
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = prefersDark ? 'dark' : 'light'
    setTheme(theme)
    currentTheme.value = theme
    applyTheme(theme)

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light'
      setTheme(newTheme)
      currentTheme.value = newTheme
      applyTheme(newTheme)
    }
    mediaQuery.addEventListener('change', handleChange)
  } else {
    setTheme(preset.id)
    currentTheme.value = preset.id
    applyTheme(preset.id)
  }
}

// 应用主题到页面
const applyTheme = (theme) => {
  const html = document.documentElement
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark')
  } else {
    html.removeAttribute('data-theme')
  }
}

onMounted(() => {
  // 从localStorage获取保存的主题设置
  const savedTheme = getTheme()
  currentTheme.value = savedTheme
  currentPreset.value = savedTheme

  // 应用保存的主题
  applyTheme(savedTheme)
})
</script>

<style scoped>
.theme-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-card);
}

.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.toggle-track {
  position: relative;
  width: 60px;
  height: 30px;
  background: var(--border-light);
  border-radius: 50px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.theme-toggle.dark .toggle-track {
  background: #4a4a4a;
}

.toggle-thumb {
  position: absolute;
  left: 3px;
  top: 3px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.theme-toggle.dark .toggle-thumb {
  transform: translateX(30px);
  background: #2d2d2d;
}

.sun-icon,
.moon-icon {
  position: absolute;
  font-size: 14px;
  transition: opacity 0.3s;
}

.sun-icon {
  opacity: 1;
}

.moon-icon {
  opacity: 0;
}

.theme-toggle.dark .sun-icon {
  opacity: 0;
}

.theme-toggle.dark .moon-icon {
  opacity: 1;
}

.theme-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  min-width: 60px;
}

/* 主题预设选项 */
.theme-options {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

.theme-presets {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.preset-btn:hover {
  border-color: var(--border-color);
  transform: translateY(-2px);
}

.preset-btn.active {
  border-color: var(--primary-color);
  background: var(--bg-tertiary);
}

.preset-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.preset-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-toggle {
    padding: 6px 12px;
  }

  .toggle-track {
    width: 50px;
    height: 25px;
  }

  .toggle-thumb {
    width: 20px;
    height: 20px;
  }

  .theme-toggle.dark .toggle-thumb {
    transform: translateX(25px);
  }

  .theme-label {
    font-size: 12px;
    min-width: 50px;
  }
}
</style>
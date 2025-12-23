<template>
  <div class="audit-layout">
    <!-- 顶部导航 -->
    <Navigation />

    <div class="audit-container">
      <!-- 左侧导航栏 -->
      <LeftBar :active-tab="activeTab" @tab-change="handleTabChange" />

      <!-- 右侧内容区域 -->
      <div class="audit-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navigation from "@/views/components/Navigation.vue"
import LeftBar from "@/views/audit/leftBar.vue"

const route = useRoute()
const router = useRouter()
const activeTab = ref('reports')

// 监听路由变化更新激活的标签
watch(() => route.path, (path) => {
  if (path.includes('/claims')) {
    activeTab.value = 'claims'
  } else {
    activeTab.value = 'reports'
  }
}, { immediate: true })

// 处理标签切换
const handleTabChange = (tab) => {
  activeTab.value = tab
  router.push(`/audit/${tab}`)
}
</script>

<style scoped>
.audit-layout {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.audit-container {
  display: flex;
  min-height: calc(100vh - 64px); /* 减去导航栏高度 */
}

.audit-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
</style>
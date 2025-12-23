<template>
  <div class="left-sidebar">
    <div class="sidebar-header">
      <h3>审核管理</h3>
    </div>

    <div class="sidebar-menu">
      <div
          class="menu-item"
          :class="{ active: activeTab === 'reports' }"
          @click="emit('tab-change', 'reports')"
      >
        <div class="menu-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <span class="menu-text">举报审核</span>
        <span v-if="reportCount > 0" class="badge">{{ reportCount }}</span>
      </div>

      <div
          class="menu-item"
          :class="{ active: activeTab === 'claims' }"
          @click="emit('tab-change', 'claims')"
      >
        <div class="menu-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 8s-1.5 2-4 2-4-2-4-2"></path>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <span class="menu-text">认领审核</span>
        <span v-if="claimCount > 0" class="badge">{{ claimCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'reports'
  }
})

const emit = defineEmits(['tab-change'])

// 待审核数量
const reportCount = ref(0)
const claimCount = ref(0)

// 模拟获取待审核数量
onMounted(() => {

})
</script>

<style scoped>
.left-sidebar {
  width: 240px;
  background: var(--bg-card);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid var(--border-color);
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: var(--text-secondary);
}

.menu-item:hover {
  background: var(--bg-tertiary);
}

.menu-item.active {
  background: var(--bg-tertiary);
  color: var(--primary-color);
  font-weight: 500;
}

.menu-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.menu-item.active .menu-icon {
  color: var(--primary-color);
}

.menu-text {
  flex: 1;
  font-size: 14px;
}

.badge {
  background: var(--error-color);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.admin-info {
  display: flex;
  align-items: center;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: 600;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.admin-details {
  flex: 1;
}

.admin-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.admin-role {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-tertiary);
}
</style>
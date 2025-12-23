<template>
  <div class="system-message-container">
    <div class="system-message" v-if="visible">
      <div class="message-header">
        <span class="message-title">{{ title }}</span>
        <span class="publish-time">{{ formatTime(publishTime) }}</span>
      </div>
      <div class="message-content">
        {{ content }}
      </div>
      <div class="message-footer">
        <button @click="closeMessage">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

// 定义组件属性
const props = defineProps({
  publishTime: {
    type: [String, Date, Number],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  }
})

// 定义事件发射器
const emit = defineEmits(['close'])

// 格式化时间显示
const formatTime = (time) => {
  if (!time) return ''
  
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 关闭消息
const closeMessage = () => {
  emit('close')
}
</script>

<style scoped>
.system-message-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
}

.system-message {
  background-color: var(--bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  padding: 16px;
  animation: slideUp 0.3s ease-out;
  border: 1px solid var(--border-color);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

.message-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
}

.publish-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.message-content {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
}

.message-footer {
  text-align: right;
}

.message-footer button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
}

.message-footer button:hover {
  background-color: #40a9ff;
}
</style>
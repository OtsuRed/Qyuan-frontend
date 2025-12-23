<template>
  <div class="message-list-container">
    <div class="message-list-header">
      <h2>消息列表</h2>
    </div>

    <div class="message-filters">
      <div class="filter-group">
        <label>消息类型:</label>
        <select v-model="filterType" class="filter-select">
          <option value="">全部</option>
          <option value="notification">通知</option>
          <option value="system">系统消息</option>
          <option value="personal">个人消息</option>
        </select>
      </div>

      <div class="filter-group">
        <label>时间范围:</label>
        <select v-model="filterTimeRange" class="filter-select">
          <option value="">全部</option>
          <option value="today">今天</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
        </select>
      </div>

      <button @click="clearFilters" class="clear-filters-btn">清除筛选</button>
    </div>

    <div class="message-list">
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        class="message-item"
        :class="{ unread: !message.read }"
      >
        <div class="message-content">
          <div class="message-header">
            <h3 class="message-title">{{ message.title }}</h3>
            <div class="message-meta">
              <span class="message-type">{{ message.type }}</span>
              <span class="message-time">{{ formatTime(message.time) }}</span>
            </div>
          </div>
          <p class="message-body">{{ message.body }}</p>
        </div>
        <div class="message-actions">
          <button @click="markAsRead(message)" class="mark-read-btn">标记为已读</button>
          <button @click="deleteMessage(message)" class="delete-btn">删除</button>
        </div>
      </div>

      <div v-if="filteredMessages.length === 0" class="no-messages">
        <p>暂无消息</p>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="page-btn"
      >
        上一页
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 消息数据
const messages = ref([
  {
    id: 1,
    title: '系统通知',
    body: '您的账户已成功注册，欢迎使用千源学术平台！',
    type: 'system',
    time: new Date(Date.now() - 86400000), // 1天前
    read: false
  },
  {
    id: 2,
    title: '论文审核结果',
    body: '您提交的论文《基于深度学习的图像识别技术》已通过审核，现已发布。',
    type: 'notification',
    time: new Date(Date.now() - 172800000), // 2天前
    read: true
  },
  {
    id: 3,
    title: '好友请求',
    body: '用户张三向您发送了好友请求，请及时处理。',
    type: 'personal',
    time: new Date(Date.now() - 259200000), // 3天前
    read: false
  },
  {
    id: 4,
    title: '系统维护通知',
    body: '平台将于本周六进行系统维护，届时将暂停服务2小时。',
    type: 'system',
    time: new Date(Date.now() - 604800000), // 1周前
    read: true
  }
]);

// 筛选条件
const filterType = ref('');
const filterTimeRange = ref('');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性
const filteredMessages = computed(() => {
  let filtered = messages.value;

  // 按类型筛选
  if (filterType.value) {
    filtered = filtered.filter(msg => msg.type === filterType.value);
  }

  // 按时间范围筛选
  if (filterTimeRange.value) {
    const now = new Date();
    filtered = filtered.filter(msg => {
      const msgTime = new Date(msg.time);
      const diffTime = now - msgTime;
      
      switch (filterTimeRange.value) {
        case 'today':
          return diffTime < 86400000; // 24小时
        case 'week':
          return diffTime < 604800000; // 7天
        case 'month':
          return diffTime < 2592000000; // 30天
        default:
          return true;
      }
    });
  }

  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filtered.slice(start, end);
});

const totalPages = computed(() => {
  let count = messages.value.length;

  // 应用筛选条件
  if (filterType.value) {
    count = messages.value.filter(msg => msg.type === filterType.value).length;
  }
  if (filterTimeRange.value) {
    const now = new Date();
    count = messages.value.filter(msg => {
      const msgTime = new Date(msg.time);
      const diffTime = now - msgTime;
      
      switch (filterTimeRange.value) {
        case 'today':
          return diffTime < 86400000;
        case 'week':
          return diffTime < 604800000;
        case 'month':
          return diffTime < 2592000000;
        default:
          return true;
      }
    }).length;
  }

  return Math.ceil(count / pageSize.value);
});

// 方法
const formatTime = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const markAsRead = (message) => {
  message.read = true;
  console.log(`标记消息 ${message.id} 为已读`);
};

const deleteMessage = (message) => {
  const index = messages.value.findIndex(msg => msg.id === message.id);
  if (index !== -1) {
    messages.value.splice(index, 1);
    console.log(`删除消息 ${message.id}`);
  }
};

const clearFilters = () => {
  filterType.value = '';
  filterTimeRange.value = '';
  currentPage.value = 1;
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<style scoped>
.message-list-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.message-list-header {
  margin-bottom: 20px;
}

.message-list-header h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin: 0;
}

.message-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-primary);
}

.clear-filters-btn {
  padding: 6px 12px;
  background: var(--button-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
}

.clear-filters-btn:hover {
  background: var(--bg-tertiary);
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-item {
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-card);
  transition: all 0.3s;
}

.message-item:hover {
  box-shadow: var(--shadow-md);
}

.message-item.unread {
  border-left: 4px solid var(--primary-color);
}

.message-content {
  margin-bottom: 10px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.message-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
}

.message-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.message-type {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.message-body {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.message-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.mark-read-btn, .delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.mark-read-btn {
  background: var(--primary-color);
  color: white;
}

.mark-read-btn:hover {
  background: #40a9ff;
}

.delete-btn {
  background: var(--error-color);
  color: white;
}

.delete-btn:hover {
  background: #ff7875;
}

.no-messages {
  text-align: center;
  padding: 40px;
  color: var(--text-tertiary);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.page-btn {
  padding: 8px 16px;
  background: var(--button-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-secondary);
}
</style>
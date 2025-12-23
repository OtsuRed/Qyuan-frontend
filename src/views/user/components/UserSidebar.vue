<template>
  <div class="user-sidebar">
    <!-- 用户卡片 -->
    <div class="user-card">
      <div class="avatar-section">
        <img :src="userInfo.avatar" alt="用户头像" class="profile-avatar">
        <h2 class="username">{{ userInfo.username }}</h2>
        <p class="user-title">{{ userInfo.title }}</p>
        <p class="user-institution">{{ userInfo.institution }}</p>
      </div>

      <!-- 我的模式下显示导航菜单 -->
      <nav v-if="isOwner" class="sidebar-nav">
        <ul>
          <li>
            <button
                :class="{ active: activeTab === 'profile' }"
                @click="$emit('change-tab', 'profile')"
            >
              <i>👤</i> 个人信息
            </button>
          </li>
          <li>
            <button
                :class="{ active: activeTab === 'account' }"
                @click="$emit('change-tab', 'account')"
            >
              <i>⚙️</i> 账号设置
            </button>
          </li>
          <li>
            <button
                :class="{ active: activeTab === 'security' }"
                @click="$emit('change-tab', 'security')"
            >
              <i>🔒</i> 安全中心
            </button>
          </li>
          <li>
            <button
                :class="{ active: activeTab === 'publications' }"
                @click="$emit('change-tab', 'publications')"
            >
              <i>📄</i> 我的作品
            </button>
          </li>
          <li>
            <button
                :class="{ active: activeTab === 'projects' }"
                @click="$emit('change-tab', 'projects')"
            >
              <i>💻</i> 我的项目
            </button>
          </li>
          <li>
            <button
                :class="{ active: activeTab === 'follow' }"
                @click="$emit('change-tab', 'follow')"
            >
              <i>👥</i> 关注管理
            </button>
          </li>
          <li>
            <button
                :class="{ active: activeTab === 'preferences' }"
                @click="$emit('change-tab', 'preferences')"
            >
              <i>🎨</i> 偏好设置
            </button>
          </li>
        </ul>
      </nav>

      <!-- 访客模式下显示统计信息和关注按钮 -->
      <div v-else class="visitor-info">
        <div class="stats-section">
          <div class="stat-item" @click="showPublications">
            <span class="stat-number">{{ visitorStats.publications }}</span>
            <span class="stat-label">作品</span>
          </div>
          <div class="stat-item" @click="showFollowers">
            <span class="stat-number">{{ visitorStats.followers }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item" @click="showCitations">
            <span class="stat-number">{{ visitorStats.citations }}</span>
            <span class="stat-label">引用</span>
          </div>
        </div>

        <button class="follow-btn" @click="toggleFollow">
          {{ isFollowing ? '已关注' : '关注' }}
        </button>

        <button class="message-btn" @click="sendMessage">
          <i>✉️</i> 发送消息
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isOwner: Boolean,
  userInfo: Object,
  activeTab: String,
  visitorStats: {
    type: Object,
    default: () => ({
      publications: 0,
      followers: 0,
      citations: 0
    })
  }
});

const emit = defineEmits(['change-tab']);

const isFollowing = ref(false);

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
  console.log(isFollowing.value ? '关注用户' : '取消关注');
  // 这里应该调用API更新关注状态
};

const showPublications = () => {
  emit('change-tab', 'publications');
};

const showFollowers = () => {
  emit('change-tab', 'follow');
};

const showCitations = () => {
  console.log('显示引用详情');
};

const sendMessage = () => {
  console.log('发送消息');
};
</script>

<style scoped src="./UserSideBar.styles.css"></style>
<template>
  <div class="visitor-profile">
    <!-- 用户简介卡片 -->
    <div class="profile-header">
      <div class="cover-section">
        <!-- 封面图区域 -->
      </div>
      <div class="header-content">
        <div class="user-intro">
          <h1 class="username">{{ userInfo.username }}</h1>
          <p class="user-title">{{ userInfo.title }} @ {{ userInfo.institution }}</p>
          <p class="user-bio">{{ userInfo.bio }}</p>
        </div>
      </div>
    </div>

    <!-- 研究领域 -->
    <div class="research-section">
      <h3 class="section-title">研究领域</h3>
      <div class="research-tags">
        <span
            v-for="field in userInfo.researchFields"
            :key="field"
            class="research-tag"
        >
          {{ field }}
        </span>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-card" @click="showPublications">
        <div class="stat-icon">📄</div>
        <div class="stat-content">
          <span class="stat-number">{{ userStats.publications }}</span>
          <span class="stat-label">论文作品</span>
        </div>
      </div>
      <div class="stat-card" @click="showCitations">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <span class="stat-number">{{ userStats.citations }}</span>
          <span class="stat-label">被引用</span>
        </div>
      </div>
      <div class="stat-card" @click="showFollowers">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <span class="stat-number">{{ userStats.followers }}</span>
          <span class="stat-label">关注者</span>
        </div>
      </div>
      <div class="stat-card" @click="showProjects">
        <div class="stat-icon">💻</div>
        <div class="stat-content">
          <span class="stat-number">{{ userStats.projects || 8 }}</span>
          <span class="stat-label">项目</span>
        </div>
      </div>
    </div>

    <!-- 最新作品 -->
    <div class="publications-section">
      <div class="section-header">
        <h3 class="section-title">最新作品</h3>
        <button @click="viewAllPublications" class="view-all">查看全部</button>
      </div>

      <div class="publications-grid">
        <div
            v-for="publication in recentPublications"
            :key="publication.id"
            class="publication-card"
        >
          <div class="publication-header">
            <h4 class="publication-title">{{ publication.title }}</h4>
            <span class="publication-journal">{{ publication.journal }}</span>
          </div>
          <p class="publication-abstract">{{ publication.abstract }}</p>
          <div class="publication-footer">
            <span class="publication-date">{{ publication.date }}</span>
            <span class="publication-citations">
              <i>📈</i> {{ publication.citations }} 次引用
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  userInfo: Object,
  userStats: {
    type: Object,
    default: () => ({
      publications: 0,
      citations: 0,
      followers: 0,
      projects: 0
    })
  }
});

// 模拟数据 - 最新作品
const recentPublications = ref([
  {
    id: 1,
    title: '基于深度学习的图像识别技术研究',
    journal: '计算机学报',
    date: '2023-10-15',
    abstract: '本文提出了一种基于深度学习的图像识别新方法...',
    citations: 45
  },
  {
    id: 2,
    title: '区块链在数据安全中的应用探讨',
    journal: '信息安全国际会议',
    date: '2023-08-20',
    abstract: '研究了区块链技术在数据安全保护中的应用...',
    citations: 28
  }
]);

const showPublications = () => {
  console.log('显示所有作品');
};

const showCitations = () => {
  console.log('显示引用详情');
};

const showFollowers = () => {
  console.log('显示关注者列表');
};

const showProjects = () => {
  console.log('显示项目列表');
};

const viewAllPublications = () => {
  console.log('查看全部作品');
};
</script>

<style scoped></style>
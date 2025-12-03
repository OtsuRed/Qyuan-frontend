<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="home-header">
      <div class="header-content">
        <div class="logo-section">
          <router-link to="/" class="logo">
            <i class="icon-book"></i>
            <span>学术交流平台</span>
          </router-link>
        </div>

        <div class="search-section">
          <div class="search-box">
            <i class="icon-search"></i>
            <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索学术论文、讨论话题..."
                @keyup.enter="handleSearch"
            />
          </div>
        </div>

        <div class="user-section">
          <router-link to="/user" class="user-avatar">
            <img :src="userAvatar" :alt="userName" v-if="userAvatar" />
            <div class="avatar-placeholder" v-else>
              {{ userName.charAt(0) }}
            </div>
          </router-link>
        </div>
      </div>

      <!-- 导航标签 -->
      <div class="nav-tabs">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>
    </header>

    <main class="home-main">
      <!-- 左侧内容区 -->
      <div class="content-left">
        <!-- 热门讨论 -->
        <section class="hot-discussions">
          <div class="section-header">
            <h3><i class="icon-fire"></i> 热门讨论</h3>
            <button class="new-topic-btn" @click="showNewTopicModal = true">
              <i class="icon-plus"></i> 发起新话题
            </button>
          </div>

          <div class="discussions-list">
            <div
                v-for="topic in hotTopics"
                :key="topic.id"
                class="topic-card"
                @click="goToTopic(topic.id)"
            >
              <div class="topic-header">
                <span class="topic-tag" :style="{ backgroundColor: topic.category.color }">
                  {{ topic.category.name }}
                </span>
                <span class="topic-author">
                  <img :src="topic.author.avatar" :alt="topic.author.name" />
                  {{ topic.author.name }}
                </span>
              </div>

              <h4 class="topic-title">{{ topic.title }}</h4>
              <p class="topic-preview">{{ topic.content }}</p>

              <div class="topic-stats">
                <span><i class="icon-eye"></i> {{ topic.views }}</span>
                <span><i class="icon-message"></i> {{ topic.replies }}</span>
                <span><i class="icon-like"></i> {{ topic.likes }}</span>
                <span class="topic-time">{{ formatTime(topic.updateTime) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 最新论文 -->
        <section class="latest-papers">
          <div class="section-header">
            <h3><i class="icon-paper"></i> 最新论文</h3>
            <button class="view-all-btn" @click="goToPapers">
              查看全部 <i class="icon-arrow-right"></i>
            </button>
          </div>

          <div class="papers-grid">
            <div
                v-for="paper in latestPapers"
                :key="paper.id"
                class="paper-card"
                @click="viewPaper(paper.id)"
            >
              <div class="paper-header">
                <h4>{{ paper.title }}</h4>
                <span class="paper-journal">{{ paper.journal }}</span>
              </div>

              <div class="paper-authors">
                <span v-for="author in paper.authors" :key="author.id">
                  {{ author.name }}
                </span>
              </div>

              <p class="paper-abstract">{{ paper.abstract }}</p>

              <div class="paper-tags">
                <span
                    v-for="tag in paper.tags"
                    :key="tag"
                    class="paper-tag"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="paper-stats">
                <span><i class="icon-citation"></i> {{ paper.citations }} 引用</span>
                <span><i class="icon-download"></i> {{ paper.downloads }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧侧边栏 -->
      <aside class="sidebar-right">
        <!-- 用户信息卡片 -->
        <div class="user-card">
          <div class="user-info">
            <img :src="userAvatar" :alt="userName" v-if="userAvatar" />
            <div class="avatar-placeholder" v-else>
              {{ userName.charAt(0) }}
            </div>
            <div class="user-details">
              <h4>{{ userName }}</h4>
              <p class="user-title">{{ userTitle }}</p>
            </div>
          </div>

          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-number">{{ userStats.topics }}</span>
              <span class="stat-label">话题</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userStats.followers }}</span>
              <span class="stat-label">关注者</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userStats.reputation }}</span>
              <span class="stat-label">声望</span>
            </div>
          </div>
        </div>

        <!-- 关注的话题 -->
        <div class="followed-topics">
          <h4><i class="icon-star"></i> 关注的话题</h4>
          <div class="topics-list">
            <span
                v-for="topic in followedTopics"
                :key="topic.id"
                class="topic-tag"
                @click="filterByTopic(topic.id)"
            >
              {{ topic.name }}
            </span>
          </div>
        </div>

        <!-- 在线学者 -->
        <div class="online-scholars">
          <h4><i class="icon-online"></i> 在线学者 ({{ onlineScholars.length }})</h4>
          <div class="scholars-list">
            <div
                v-for="scholar in onlineScholars"
                :key="scholar.id"
                class="scholar-item"
            >
              <img :src="scholar.avatar" :alt="scholar.name" />
              <div class="scholar-info">
                <span class="scholar-name">{{ scholar.name }}</span>
                <span class="scholar-field">{{ scholar.field }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <!-- 新建话题模态框 -->
    <div v-if="showNewTopicModal" class="modal-overlay" @click="showNewTopicModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>发起新话题</h3>
          <button class="modal-close" @click="showNewTopicModal = false">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- 话题表单内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const searchKeyword = ref('')
const activeTab = ref('discussions')
const showNewTopicModal = ref(false)

// 模拟数据
const hotTopics = ref([
  {
    id: 1,
    title: '人工智能在医疗诊断中的最新进展与应用挑战',
    content: '讨论深度学习模型在医疗影像分析中的准确性和可解释性问题...',
    category: { id: 1, name: '人工智能', color: '#4f46e5' },
    author: { id: 1, name: '张教授', avatar: '' },
    views: 1245,
    replies: 89,
    likes: 256,
    updateTime: '2024-01-15T10:30:00Z'
  },
  // 更多话题...
])

const latestPapers = ref([
  {
    id: 1,
    title: '基于Transformer的多模态学习研究',
    journal: 'Nature Machine Intelligence',
    authors: [{ id: 1, name: '李研究员' }],
    abstract: '本文提出了一种新的多模态Transformer架构...',
    tags: ['深度学习', '多模态', 'Transformer'],
    citations: 42,
    downloads: 156
  },
  // 更多论文...
])

// 计算属性
const userName = computed(() => userStore.name || '用户')
const userAvatar = computed(() => userStore.avatar)
const userTitle = computed(() => userStore.title || '学者')
const userStats = computed(() => ({
  topics: userStore.topics || 0,
  followers: userStore.followers || 0,
  reputation: userStore.reputation || 0
}))

// 方法
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
  }
}

const goToTopic = (topicId) => {
  router.push(`/topic/${topicId}`)
}

const viewPaper = (paperId) => {
  router.push(`/paper/${paperId}`)
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN')
}

// 标签页配置
const tabs = [
  { id: 'discussions', label: '讨论', icon: 'icon-message' },
  { id: 'papers', label: '论文', icon: 'icon-paper' },
  { id: 'questions', label: '问答', icon: 'icon-help' },
  { id: 'events', label: '学术活动', icon: 'icon-calendar' }
]

onMounted(() => {
  // 初始化数据
  // 这里可以调用API获取实际数据
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 头部样式 */
.home-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f1f3f5;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  width: 400px;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem;
  outline: none;
  font-size: 0.95rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4f46e5;
  color: white;
  font-weight: bold;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 导航标签 */
.nav-tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  gap: 1rem;
  border-top: 1px solid #e9ecef;
}

.tab-btn {
  padding: 1rem 0;
  border: none;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #4f46e5;
}

.tab-btn.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

/* 主要内容区 */
.home-main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

/* 卡片样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
}

.topic-card,
.paper-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.topic-card:hover,
.paper-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.topic-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  color: white;
  font-size: 0.85rem;
}

.topic-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.topic-author img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.topic-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.topic-preview {
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.topic-stats {
  display: flex;
  gap: 1.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.topic-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 论文网格 */
.papers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.paper-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.paper-tag {
  padding: 0.25rem 0.75rem;
  background: #e9ecef;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #495057;
}

/* 侧边栏样式 */
.sidebar-right > * {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-info img,
.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4f46e5;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .home-main {
    grid-template-columns: 1fr;
  }

  .search-box {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .search-box {
    width: 100%;
    order: 3;
    margin-top: 1rem;
  }

  .papers-grid {
    grid-template-columns: 1fr;
  }

  .nav-tabs {
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
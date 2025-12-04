<template>
  <div class="user-profile">
    <!-- 顶部导航栏 -->
    <Navigation />

    <div class="profile-container">
      <!-- 左侧用户信息栏 -->
      <div class="sidebar">
        <div class="user-card">
          <div class="avatar-section">
            <img :src="userInfo.avatar" alt="用户头像" class="profile-avatar">
            <button @click="editAvatar" class="edit-avatar-btn">更换头像</button>
          </div>

          <div class="user-info-section">
            <h2 class="username">{{ userInfo.username }}</h2>
            <div class="user-meta">
              <div class="meta-item">
                <span class="meta-label">性别：</span>
                <span class="meta-value">{{ userInfo.gender }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">电话：</span>
                <span class="meta-value">{{ userInfo.phone }}</span>
              </div>
            </div>

            <div class="bio-section">
              <h3 class="section-title">个性签名</h3>
              <p class="bio-content">{{ userInfo.bio }}</p>
            </div>

            <div class="stats-section">
              <div class="stat-item" @click="showFollowers">
                <span class="stat-number">{{ userStats.followers }}</span>
                <span class="stat-label">粉丝</span>
              </div>
              <div class="stat-item" @click="showFollowing">
                <span class="stat-number">{{ userStats.following }}</span>
                <span class="stat-label">关注</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ userStats.publications }}</span>
                <span class="stat-label">作品</span>
              </div>
            </div>

            <div class="action-buttons">
              <button @click="editProfile" class="edit-btn">编辑资料</button>
              <button @click="showSettings" class="settings-btn">设置</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="main-content">
        <!-- 用户作品列表 -->
        <div class="publications-section">
          <div class="section-header">
            <h2 class="section-title">我的作品</h2>
            <button @click="createPublication" class="create-btn">发布新作品</button>
          </div>

          <div class="publications-list">
            <div v-for="publication in publications" :key="publication.id" class="publication-card">
              <div class="publication-header">
                <h3 class="publication-title">{{ publication.title }}</h3>
                <span class="publication-status" :class="publication.status">
                  {{ publication.status === 'published' ? '已发表' : '待审核' }}
                </span>
              </div>

              <div class="publication-meta">
                <div class="meta-item">
                  <span class="meta-label">期刊/会议：</span>
                  <span class="meta-value">{{ publication.journal }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">发表日期：</span>
                  <span class="meta-value">{{ publication.date }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">关键词：</span>
                  <span class="meta-keywords">
                    <span v-for="(keyword, index) in publication.keywords" :key="index" class="keyword-tag">
                      {{ keyword }}
                    </span>
                  </span>
                </div>
              </div>

              <div class="publication-stats">
                <span class="stat">
                  <i class="icon-view">👁️</i> {{ publication.views }}
                </span>
                <span class="stat">
                  <i class="icon-like">👍</i> {{ publication.likes }}
                </span>
                <span class="stat">
                  <i class="icon-comment">💬</i> {{ publication.comments }}
                </span>
                <span class="stat">
                  <i class="icon-share">📤</i> {{ publication.shares }}
                </span>
              </div>

              <div class="publication-actions">
                <button @click="editPublication(publication.id)" class="action-btn edit-btn">编辑</button>
                <button @click="viewPublication(publication.id)" class="action-btn view-btn">查看</button>
                <button @click="deletePublication(publication.id)" class="action-btn delete-btn">删除</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 关注/粉丝列表模态框 -->
        <div v-if="showFollowModal" class="modal-overlay" @click="closeFollowModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>{{ modalTitle }}</h3>
              <button @click="closeFollowModal" class="close-btn">×</button>
            </div>
            <div class="modal-body">
              <div v-for="user in followList" :key="user.id" class="follow-user-item">
                <img :src="user.avatar" alt="头像" class="follow-user-avatar">
                <div class="follow-user-info">
                  <span class="follow-username">{{ user.username }}</span>
                  <span class="follow-bio">{{ user.bio }}</span>
                </div>
                <button v-if="modalType === 'followers'" class="follow-btn">
                  {{ user.isFollowing ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navigation from "@/views/components/Navigation.vue";

// 用户信息（模拟数据）
const userInfo = ref({
  username: '张三',
  phone: '13800138000',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三',
  gender: '男',
  bio: '热爱学术研究，专注于计算机科学领域'
});

// 用户统计数据
const userStats = ref({
  followers: 156,
  following: 89,
  publications: 12
});

// 作品列表（模拟数据）
const publications = ref([
  {
    id: 1,
    title: '基于深度学习的图像识别技术研究',
    journal: '计算机学报',
    date: '2023-10-15',
    keywords: ['深度学习', '图像识别', '人工智能'],
    views: 2450,
    likes: 156,
    comments: 42,
    shares: 89,
    status: 'published'
  },
  {
    id: 2,
    title: '区块链在数据安全中的应用探讨',
    journal: '信息安全国际会议',
    date: '2023-08-20',
    keywords: ['区块链', '数据安全', '加密技术'],
    views: 1870,
    likes: 98,
    comments: 31,
    shares: 56,
    status: 'published'
  },
  {
    id: 3,
    title: '云计算环境下的资源调度优化算法',
    journal: '软件学报',
    date: '2023-11-05',
    keywords: ['云计算', '资源调度', '优化算法'],
    views: 1200,
    likes: 67,
    comments: 18,
    shares: 34,
    status: 'reviewing'
  }
]);

// 关注/粉丝列表相关
const showFollowModal = ref(false);
const modalType = ref(''); // 'followers' 或 'following'
const modalTitle = ref('');
const followList = ref([]);

// 关注者列表（模拟数据）
const followersList = ref([
  {
    id: 1,
    username: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四',
    bio: '数据科学家',
    isFollowing: true
  },
  {
    id: 2,
    username: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王五',
    bio: 'AI研究员',
    isFollowing: false
  }
]);

// 关注列表（模拟数据）
const followingList = ref([
  {
    id: 1,
    username: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=赵六',
    bio: '算法工程师'
  },
  {
    id: 2,
    username: '孙七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=孙七',
    bio: '前端开发工程师'
  }
]);

// 方法定义
const editProfile = () => {
  console.log('编辑用户信息');
  // 这里可以打开编辑模态框或跳转到编辑页面
};

const editAvatar = () => {
  console.log('更换头像');
};

const showSettings = () => {
  console.log('打开设置');
};

const createPublication = () => {
  console.log('创建新作品');
};

const editPublication = (id) => {
  console.log('编辑作品:', id);
};

const viewPublication = (id) => {
  console.log('查看作品:', id);
};

const deletePublication = (id) => {
  console.log('删除作品:', id);
  // 实际开发中这里应该调用API
  publications.value = publications.value.filter(pub => pub.id !== id);
};

const showFollowers = () => {
  modalType.value = 'followers';
  modalTitle.value = '粉丝列表';
  followList.value = followersList.value;
  showFollowModal.value = true;
};

const showFollowing = () => {
  modalType.value = 'following';
  modalTitle.value = '关注列表';
  followList.value = followingList.value;
  showFollowModal.value = true;
};

const closeFollowModal = () => {
  showFollowModal.value = false;
};

// 模拟从API获取数据
onMounted(() => {
  console.log('用户主页加载，模拟API调用');
  // 这里可以添加实际的API调用
  // fetchUserInfo();
  // fetchPublications();
});
</script>

<style scoped>
.user-profile {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  gap: 24px;
}

/* 侧边栏样式 */
.sidebar {
  flex: 0 0 300px;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.avatar-section {
  text-align: center;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e8e8e8;
  margin-bottom: 12px;
}

.edit-avatar-btn {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  color: #666;
}

.username {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}

.user-meta {
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.meta-label {
  color: #666;
}

.meta-value {
  color: #333;
  font-weight: 500;
}

.bio-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.bio-content {
  color: #666;
  line-height: 1.5;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.edit-btn, .settings-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn {
  background: #1890ff;
  color: white;
}

.edit-btn:hover {
  background: #40a9ff;
}

.settings-btn {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.settings-btn:hover {
  background: #e8e8e8;
}

/* 主要内容区域样式 */
.main-content {
  flex: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.create-btn {
  background: #52c41a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.publications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.publication-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.publication-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.publication-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.publication-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.publication-status.published {
  background: #e6f7ff;
  color: #1890ff;
}

.publication-status.reviewing {
  background: #fff7e6;
  color: #fa8c16;
}

.publication-meta {
  margin-bottom: 16px;
}

.meta-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  background: #f6f6f6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.publication-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
}

.publication-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 6px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.view-btn {
  background: #1890ff;
  color: white;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-height: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.follow-user-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.follow-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.follow-user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.follow-username {
  font-weight: bold;
  color: #333;
}

.follow-bio {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.follow-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
</style>
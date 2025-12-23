<template>
  <nav class="top-navigation">
    <div class="nav-container">
      <!-- 左侧项目名称 -->
      <div class="nav-left">
        <h1 class="project-name">千源万码</h1>
      </div>

      <!-- 右侧导航项目 -->
      <div class="nav-right">
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link to="/home" class="nav-link">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/search" class="nav-link">搜索</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user" class="nav-link">我的主页</router-link>
          </li>
        </ul>
        <template v-if="isLoggedIn">
          <!-- 用户头像/登录状态 -->
          <div class="user-section" @click="goToUserPage">
            <div class="user-info">
              <img :src="userAvatar" alt="用户头像" class="user-avatar">
              <span class="username">{{ username }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="auth-buttons">
            <router-link to="/login" class="login-btn">登录</router-link>
            <router-link to="/register" class="register-btn">注册</router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 模拟用户状态（实际应从Vuex/Pinia状态管理获取）
const userStore = ref({
  isAuthenticated: true,
  user: {
    id: 1,
    username: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三'
  }
});

// 计算属性
const isLoggedIn = computed(() => userStore.value.isAuthenticated);
const username = computed(() => userStore.value.user?.username || '用户');
const userAvatar = computed(() => userStore.value.user?.avatar || 'default-avatar.png');

// 导航方法
const navigateTo = (path) => {
  router.push(path);
};

// 跳转到用户界面（用于头像和姓名区域）
const goToUserPage = () => {
  router.push('/user');
}

// 模拟登出功能
const handleLogout = () => {
  userStore.value.isAuthenticated = false;
  userStore.value.user = null;
  router.push('/login');
};
</script>

<style scoped>
.top-navigation {
  background-color: var(--nav-bg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-left .project-name {
  color: var(--nav-text);
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: var(--bg-tertiary);
  color: var(--info-color);
}

/* 激活状态的导航链接 */
.nav-link.router-link-active {
  color: var(--primary-color);
  background-color: var(--bg-tertiary);
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.username {
  font-weight: 500;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.login-btn, .register-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.login-btn {
  background-color: var(--button-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.login-btn:hover {
  background-color: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.register-btn {
  background: var(--primary-gradient);
  color: white;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  filter: brightness(1.1);
}

/* 深色模式下的特定调整 */
[data-theme="dark"] .nav-link:hover {
  background-color: var(--bg-tertiary);
}

[data-theme="dark"] .login-btn {
  background-color: var(--bg-tertiary);
  border-color: var(--border-color);
}

[data-theme="dark"] .user-avatar {
  border-color: var(--border-dark);
}

/* 下拉菜单（如果有的话） */
.dropdown-menu {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  border-radius: 8px;
  overflow: hidden;
}

.dropdown-item {
  color: var(--text-primary);
  background-color: transparent;
  border: none;
  padding: 10px 16px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: var(--bg-tertiary);
}
</style>
<template>
  <nav class="top-navigation">
    <div class="nav-container">
      <!-- 左侧项目名称 -->
      <div class="nav-left">
        <div class="left">
          <el-image :src="logoSrc" alt="logo" class="logo" @click="navigateToHome"/>
        </div>
      </div>

      <!-- 右侧导航项目 -->
      <div class="nav-right">
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link to="/home" class="nav-link">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user" class="nav-link">发现</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user" class="nav-link">我的主页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user" class="nav-link">消息</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user" class="nav-link">发布</router-link>
          </li>
        </ul>

        <!-- 用户头像/登录状态 -->
        <div class="user-section">
          <div v-if="isLoggedIn" class="user-info">
            <img :src="userAvatar" alt="用户头像" class="user-avatar">
            <span class="username">{{ username }}</span>
          </div>
          <div v-else class="auth-buttons">
            <button class="login-btn">登录</button>
            <button class="register-btn">注册</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import logoSrc from "@/asserts/head/logo.png";

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

const navigateToHome = () => {
  router.push('/home');
};

// 模拟登出功能
const handleLogout = () => {
  userStore.value.isAuthenticated = false;
  userStore.value.user = null;
  router.push('/login');
};
</script>

<style scoped>
.top-navigation {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
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
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  cursor: pointer;
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
  color: #333;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f5f5f5;
  color: #1890ff;
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
  border: 2px solid #e8e8e8;
}

.username {
  font-weight: 500;
  color: #333;
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
}

.login-btn {
  background-color: #f5f5f5;
  color: #333;
}

.register-btn {
  background-color: #1890ff;
  color: white;
}

.left {
  margin-left: 3%;

  height: 60px;
  width: 200px;
  display: flex;
  flex-direction: row;
}

.logo {
  cursor: pointer;
}
</style>

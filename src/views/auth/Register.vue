<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card split-layout">
        <!-- 左侧：平台介绍 -->
        <div class="left-section">
          <div class="brand-section">
            <h1 class="logo-text">千源万码</h1>
            <p class="logo-subtitle">学术成果分享平台</p>
            <p class="logo-slogan">发现 · 分享 · 交流</p>
          </div>
          <div class="features-section">
            <h3>为什么加入我们？</h3>
            <ul class="features-list">
              <li>
                <i>🔍</i>
                <div>
                  <strong>海量学术资源</strong>
                  <p>百万论文、项目、代码库</p>
                </div>
              </li>
              <li>
                <i>🤝</i>
                <div>
                  <strong>全球学者社区</strong>
                  <p>与顶尖研究者交流合作</p>
                </div>
              </li>
              <li>
                <i>🚀</i>
                <div>
                  <strong>加速研究进程</strong>
                  <p>获取个性化推荐</p>
                </div>
              </li>
              <li>
                <i>📈</i>
                <div>
                  <strong>跟踪学术趋势</strong>
                  <p>掌握最新研究动态</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="stats-section">
            <div class="stat-item">
              <span class="stat-number">50万+</span>
              <span class="stat-label">注册学者</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">200万+</span>
              <span class="stat-label">学术论文</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">100万+</span>
              <span class="stat-label">代码项目</span>
            </div>
          </div>
        </div>
        <!-- 右侧注册表单 -->
        <div class="right-section">
          <form class="auth-form" @submit.prevent="handleRegister">
            <h2 class="form-title">用户注册</h2>
            <!-- 用户名 -->
            <div class="form-group">
              <label for="username">用户名</label>
              <div class="input-wrapper">
                <i class="input-icon">👤</i>
                <input
                    v-model="form.username"
                    type="text"
                    id="username"
                    placeholder="请输入用户名"
                    required
                />
              </div>
            </div>

            <!-- 邮箱 -->
            <div class="form-group">
              <label for="email">邮箱地址</label>
              <div class="input-wrapper">
                <i class="input-icon">📧</i>
                <input
                    v-model="form.email"
                    type="email"
                    id="email"
                    placeholder="请输入邮箱"
                    required
                />
              </div>
            </div>

            <!-- 密码 -->
            <div class="form-group">
              <label for="password">密码</label>
              <div class="input-wrapper">
                <i class="input-icon">🔒</i>
                <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    placeholder="至少8位字符"
                    required
                />
                <button
                    type="button"
                    class="password-toggle"
                    @click="togglePasswordVisibility"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <!-- 确认密码 -->
            <div class="form-group">
              <label for="confirmPassword">确认密码</label>
              <div class="input-wrapper">
                <i class="input-icon">🔒</i>
                <input
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    placeholder="再次输入密码"
                    required
                />
                <button
                    type="button"
                    class="password-toggle"
                    @click="toggleConfirmPasswordVisibility"
                >
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div v-if="!passwordsMatch && form.confirmPassword" class="error-text">
                两次输入的密码不一致
              </div>
            </div>
            <!-- 注册按钮 -->
            <button type="submit" class="submit-btn" :disabled="!canRegister || loading">
              {{ loading ? '注册中...' : '注册账号' }}
            </button>

            <!-- 登录链接 -->
            <div class="auth-switch">
              已有账号？
              <router-link to="/login" class="switch-link">
                立即登录
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- 底部信息 -->
    <footer class="auth-footer">
      <p>© 2023 千源万码学术平台. 保留所有权利.</p>
      <div class="footer-links">
        <router-link to="/help">帮助中心</router-link>
        <router-link to="/privacy">隐私政策</router-link>
        <router-link to="/terms">服务条款</router-link>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Navigation from "@/views/components/Navigation.vue";

const router = useRouter();

// 表单数据
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'student',
  researchField: '',
  acceptedTerms: false
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

// 密码验证
const passwordValid = computed(() => {
  const password = form.value.password;
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password)
  };
});

// 密码匹配验证
const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirmPassword;
});

// 是否可以注册
const canRegister = computed(() => {
  return (
      form.value.username &&
      form.value.email &&
      form.value.password &&
      passwordsMatch.value &&
      Object.values(passwordValid.value).every(v => v) &&
      form.value.acceptedTerms
  );
});

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 处理注册
const handleRegister = async () => {
  if (!canRegister.value) return;

  loading.value = true;

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('注册信息:', form.value);

    // 实际注册逻辑
    // const response = await registerAPI(form.value);

    alert('注册成功！请登录您的邮箱验证账号。');

    // 跳转到登录页面
    router.push('/login');
  } catch (error) {
    console.error('注册失败:', error);
    alert('注册失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 监听密码变化，提供实时反馈
watch(() => form.value.password, (newPassword) => {
  if (newPassword.length > 0) {
    console.log('密码强度:', passwordValid.value);
  }
});
</script>

<style scoped src="./Auth.styles.css"></style>
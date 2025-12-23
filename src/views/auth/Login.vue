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
        <!-- 右侧：登录表单 -->
        <div class="right-section">
          <!-- 登录方式切换标签 -->
          <div class="login-tabs">
            <button class="tab-btn" :class="{ active: loginMethod === 'password' }" @click="switchLoginMethod('password')">
              <i>🔐</i>密码登录
            </button>
            <button class="tab-btn" :class="{ active: loginMethod === 'captcha' }" @click="switchLoginMethod('captcha')">
              <i>📱</i>验证码登录
            </button>
          </div>
          <form class="auth-form" @submit.prevent="handleLogin">
            <h2 class="form-title">用户登录</h2>
            <p class="form-subtitle">{{ loginMethod === 'password' ? '使用邮箱和密码登录' : '使用手机号/邮箱和验证码登录' }}</p>
            <!-- 公共部分 - 邮箱/手机号输入 -->
            <div class="form-group">
              <label for="account">
                {{ loginMethod === 'password' ? '邮箱' : '邮箱/手机号' }}
              </label>
              <div class="input-wrapper">
                <i class="input-icon">{{ loginMethod === 'password' ? '📧' : '📱' }}</i>
                <input
                    v-model="form.account"
                    :type="loginMethod === 'password' ? 'email' : 'text'"
                    id="account"
                    :placeholder="loginMethod === 'password' ? '请输入邮箱' : '请输入邮箱或手机号'"
                    required
                    @input="validateAccount"
                />
              </div>
              <div v-if="accountError" class="error-text">
                {{ accountError }}
              </div>
            </div>
            <!-- 密码登录区域 -->
            <div v-if="loginMethod === 'password'" class="login-method-content">
              <!-- 密码输入 -->
              <div class="form-group">
                <label for="password">密码</label>
                <div class="input-wrapper">
                  <i class="input-icon">🔒</i>
                  <input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      placeholder="请输入密码"
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
                <div class="form-options">
                  <label class="remember-me">
                    <input type="checkbox" v-model="rememberMe" />
                    <span>记住我</span>
                  </label>
                  <router-link to="/forgot-password" class="forgot-password">
                    忘记密码？
                  </router-link>
                </div>
              </div>
            </div>
            <!-- 验证码登录区域 -->
            <div v-else class="login-method-content">
              <!-- 验证码输入 -->
              <div class="form-group">
                <label for="captcha">验证码</label>
                <div class="captcha-input-wrapper">
                  <div class="input-wrapper">
                    <i class="input-icon">🔢</i>
                    <input
                        v-model="form.captcha"
                        type="text"
                        id="captcha"
                        placeholder="请输入验证码"
                        required
                        maxlength="6"
                    />
                  </div>
                  <button
                      type="button"
                      class="captcha-btn"
                      :disabled="!canSendCaptcha || sendingCaptcha"
                      @click="sendCaptcha"
                  >
                    {{ captchaBtnText }}
                  </button>
                </div>
                <div class="captcha-tips">
                  <p v-if="sendingCaptcha">验证码发送中...</p>
                  <p v-else-if="countdown > 0">{{ countdown }}秒后可重新发送</p>
                  <p v-else>验证码将发送到您的邮箱/手机</p>
                </div>
              </div>
            </div>

            <!-- 登录按钮 -->
            <button type="submit" class="submit-btn" :disabled="loading || !canLogin">
              {{ loading ? '登录中...' : '登录账号' }}
            </button>
            <!-- 分割线 -->
            <div class="divider">
              <span>或</span>
            </div>
            <!-- 注册链接 -->
            <div class="auth-switch">
              还没有账号？
              <router-link to="/register" class="switch-link">
                立即注册
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
import {computed, onMounted, onUnmounted, ref} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 登录方式
const loginMethod = ref('password');

// 表单数据
const form = ref({
  account: '',
  password: '',
  captcha: ''
});

const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const sendingCaptcha = ref(false);
const countdown = ref(0);
const countdownTimer = ref(null);
const accountError = ref('');

// 切换登录方式
const switchLoginMethod = (method) => {
  if (loginMethod.value !== method) {
    loginMethod.value = method;
    // 清空表单
    form.value.password = '';
    form.value.captcha = '';
    accountError.value = '';
  }
};

// 验证账号格式
const validateAccount = () => {
  const account = form.value.account.toString().trim();
  if (!account) {
    accountError.value = '';
    return;
  }

  if (loginMethod.value === 'password') {
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(account)) {
      accountError.value = '请输入有效的邮箱地址';
    } else {
      accountError.value = '';
    }
  } else {
    // 验证码登录：邮箱或手机号
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^1[3-9]\d{9}$/; // 简单的手机号验证

    if (!emailRegex.test(account) && !phoneRegex.test(account)) {
      accountError.value = '请输入有效的邮箱或手机号';
    } else {
      accountError.value = '';
    }
  }
};

// 是否可以发送验证码
const canSendCaptcha = computed(() => {
  const account = form.value.account.toString().trim();
  if (!account) return false;
  if (accountError.value) return false;
  return countdown.value === 0;
});

// 验证码按钮文本
const captchaBtnText = computed(() => {
  if (sendingCaptcha.value) return '发送中...';
  if (countdown.value > 0) return `${countdown.value}s`;
  return '获取验证码';
});

// 是否可以登录
const canLogin = computed(() => {
  if (!form.value.account.toString().trim()) return false;
  if (loginMethod.value === 'password') {
    return !accountError.value && form.value.password.toString().trim();
  } else {
    return !accountError.value && form.value.captcha.toString().trim().length === 6;
  }
});

// 发送验证码
const sendCaptcha = async () => {
  if (!canSendCaptcha.value) return;
  sendingCaptcha.value = true;
  try {
    // 调用发送验证码API
    const response = await fetch('http://localhost:8080/api/auth/send-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.value.account, // 这里后端应该支持email/phone字段
        // 如果后端需要区分，可以这样：
        // email: isEmail ? form.value.account : null,
        // phone: !isEmail ? form.value.account : null
      }),
    });

    if (!response.ok) {
      throw new Error('发送验证码失败');
    }

    const data = await response.json();

    if (data.success) {
      // 开始倒计时
      startCountdown(60);
      alert('验证码已发送，请注意查收');
    } else {
      throw new Error(data.message || '发送验证码失败');
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    alert(error.message || '发送验证码失败，请稍后重试');
  } finally {
    sendingCaptcha.value = false;
  }
};

// 开始倒计时
const startCountdown = (seconds) => {
  countdown.value = seconds;
  countdownTimer.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value);
      countdownTimer.value = null;
    }
  }, 1000);
};

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 处理登录
const handleLogin = async () => {
  if (!canLogin.value) return;
  loading.value = true;
  try {
    let endpoint, body;
    if (loginMethod.value === 'password') {
      // 密码登录
      endpoint = 'http://localhost:8080/api/auth/login';
      body = {
        email: form.value.account,
        password: form.value.password
      };
    } else {
      // 验证码登录
      endpoint = 'http://localhost:8080/api/auth/login-captcha';
      body = {
        email: form.value.account, // 这里需要确认后端字段名
        captcha: form.value.captcha
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.success) {
      // 保存登录状态
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('token', data.data.token || '');
      } else {
        sessionStorage.setItem('token', data.data.token || '');
      }

      console.log('登录成功:', data.data);

      // 跳转到首页
      router.push('/');
    } else {
      throw new Error(data.message || '登录失败');
    }
  } catch (error) {
    console.error('登录失败:', error);
    alert(error.message || '登录失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
});

// 页面加载时检查是否有保存的账号
onMounted(() => {
  const savedEmail = localStorage.getItem('savedEmail');
  if (savedEmail) {
    form.value.account = savedEmail;
    rememberMe.value = true;
  }
});

</script>

<style scoped src="./Auth.styles.css"></style>
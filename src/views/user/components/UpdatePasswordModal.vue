<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>更新密码</h3>
        <button @click="closeModal" class="close-btn">×</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="update-form">
          <!-- 新密码输入 -->
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <div class="input-wrapper">
              <i class="input-icon">🔒</i>
              <input
                  v-model="form.new_password"
                  :type="showPassword ? 'text' : 'password'"
                  id="newPassword"
                  placeholder="请输入新密码"
                  required
                  @input="validatePassword"
              />
              <button
                  type="button"
                  class="password-toggle"
                  @click="togglePasswordVisibility"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="passwordError" class="error-text">
              {{ passwordError }}
            </div>
          </div>

          <!-- 确认新密码 -->
          <div class="form-group">
            <label for="confirmPassword">确认新密码</label>
            <div class="input-wrapper">
              <i class="input-icon">🔒</i>
              <input
                  v-model="form.new_password_repeat"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  placeholder="请再次输入新密码"
                  required
                  @input="validatePasswordMatch"
              />
              <button
                  type="button"
                  class="password-toggle"
                  @click="toggleConfirmPasswordVisibility"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="confirmError" class="error-text">
              {{ confirmError }}
            </div>
          </div>

          <!-- 验证码输入 -->
          <div class="form-group">
            <label for="captcha">验证码</label>
            <div class="captcha-wrapper">
              <div class="input-wrapper">
                <i class="input-icon">🔢</i>
                <input
                    v-model="form.captcha"
                    type="text"
                    id="captcha"
                    placeholder="请输入6位验证码"
                    maxlength="6"
                    required
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
            <p class="hint-text">验证码将发送到绑定邮箱</p>
          </div>

          <!-- 密码要求提示 -->
          <div class="password-requirements">
            <p class="requirements-title">密码要求：</p>
            <ul>
              <li :class="{ 'valid': passwordValid.length }">至少8位字符</li>
              <li :class="{ 'valid': passwordValid.uppercase }">包含大写字母</li>
              <li :class="{ 'valid': passwordValid.number }">包含数字</li>
            </ul>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              取消
            </button>
            <button
                type="submit"
                class="submit-btn"
                :disabled="!canSubmit || submitting"
            >
              {{ submitting ? '提交中...' : '确认更新' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const emit = defineEmits(['close']);

// 表单数据 - 严格匹配API字段名
const form = ref({
  new_password: '',
  new_password_repeat: '',
  captcha: ''
});

// 状态管理
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordError = ref('');
const confirmError = ref('');
const sendingCaptcha = ref(false);
const submitting = ref(false);
const countdown = ref(0);
const countdownTimer = ref(null);

// 密码强度验证
const passwordValid = computed(() => {
  const password = form.value.new_password;
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password)
  };
});

// 验证密码格式
const validatePassword = () => {
  const password = form.value.new_password;

  if (!password) {
    passwordError.value = '';
    return;
  }

  if (password.length < 8) {
    passwordError.value = '密码至少需要8位字符';
  } else if (!/[A-Z]/.test(password)) {
    passwordError.value = '密码必须包含大写字母';
  } else if (!/\d/.test(password)) {
    passwordError.value = '密码必须包含数字';
  } else {
    passwordError.value = '';
  }

  // 同时验证密码匹配
  validatePasswordMatch();
};

// 验证密码匹配
const validatePasswordMatch = () => {
  const password = form.value.new_password;
  const confirm = form.value.new_password_repeat;

  if (!confirm) {
    confirmError.value = '';
    return;
  }

  if (password !== confirm) {
    confirmError.value = '两次输入的密码不一致';
  } else {
    confirmError.value = '';
  }
};

// 是否可以发送验证码
const canSendCaptcha = computed(() => {
  return !passwordError.value &&
      form.value.new_password.trim() &&
      !confirmError.value &&
      countdown.value === 0;
});

// 验证码按钮文本
const captchaBtnText = computed(() => {
  if (sendingCaptcha.value) return '发送中...';
  if (countdown.value > 0) return `${countdown.value}s`;
  return '获取验证码';
});

// 是否可以提交
const canSubmit = computed(() => {
  return !passwordError.value &&
      !confirmError.value &&
      form.value.new_password.trim() &&
      form.value.new_password_repeat.trim() &&
      form.value.captcha.length === 6 &&
      Object.values(passwordValid.value).every(v => v);
});

// 发送验证码
const sendCaptcha = async () => {
  if (!canSendCaptcha.value) return;

  sendingCaptcha.value = true;

  try {
    // 调用发送验证码API
    const response = await fetch('http://localhost:8080/api/auth/send-password-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'change_password'
      }),
    });

    const data = await response.json();

    if (data.success) {
      // 开始倒计时
      startCountdown(60);
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

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 关闭模态框
const closeModal = () => {
  emit('close');
};

// 提交表单
const handleSubmit = async () => {
  if (!canSubmit.value) return;

  submitting.value = true;

  try {
    // 获取UUID（假设从localStorage或其他地方获取）
    const uuid = localStorage.getItem('user_uuid') || '';

    // 调用更新密码API
    const response = await fetch('http://localhost:8080/api/user/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'UUID': uuid // 根据API要求添加UUID header
      },
      body: JSON.stringify(form.value),
    });

    const data = await response.json();

    if (data.success) {
      alert('密码更新成功！');
      closeModal();
    } else {
      throw new Error(data.message || '密码更新失败');
    }
  } catch (error) {
    console.error('密码更新失败:', error);
    alert(error.message || '密码更新失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 清理定时器
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
});
</script>

<style scoped>
/* 复用UpdateEmailModal的样式，只添加密码特有的样式 */

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-requirements {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 10px;
}

.requirements-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-requirements li {
  color: #e74c3c;
  font-size: 13px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.password-requirements li:before {
  content: "✗";
  margin-right: 6px;
  font-size: 12px;
}

.password-requirements li.valid {
  color: #2ecc71;
}

.password-requirements li.valid:before {
  content: "✓";
}

/* 其他样式复用UpdateEmailModal的样式 */
</style>
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>更新绑定邮箱</h3>
        <button @click="closeModal" class="close-btn">×</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="update-form">
          <!-- 新邮箱输入 -->
          <div class="form-group">
            <label for="newEmail">新邮箱地址</label>
            <div class="input-wrapper">
              <i class="input-icon">📧</i>
              <input
                  v-model="form.new_email"
                  type="email"
                  id="newEmail"
                  placeholder="请输入新的邮箱地址"
                  required
                  @input="validateEmail"
              />
            </div>
            <div v-if="emailError" class="error-text">
              {{ emailError }}
            </div>
          </div>

          <!-- 验证码输入 -->
          <div class="form-group">
            <label for="captcha">验证码</label>
            <div class="captcha-wrapper">
              <div class="input-wrapper">
                <i class="input-icon">🔢</i>
                <input
                    v-model="form.new_captcha"
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
            <p class="hint-text">验证码将发送到新邮箱</p>
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

const emit = defineEmits(['close', 'update']);

// 表单数据 - 严格匹配API字段名
const form = ref({
  new_email: '',
  new_captcha: ''
});

// 状态管理
const emailError = ref('');
const sendingCaptcha = ref(false);
const submitting = ref(false);
const countdown = ref(0);
const countdownTimer = ref(null);

// 验证邮箱格式
const validateEmail = () => {
  const email = form.value.new_email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    emailError.value = '';
    return;
  }

  if (!emailRegex.test(email)) {
    emailError.value = '请输入有效的邮箱地址';
  } else {
    emailError.value = '';
  }
};

// 是否可以发送验证码
const canSendCaptcha = computed(() => {
  return !emailError.value &&
      form.value.new_email.trim() &&
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
  return !emailError.value &&
      form.value.new_email.trim() &&
      form.value.new_captcha.length === 6;
});

// 发送验证码
const sendCaptcha = async () => {
  if (!canSendCaptcha.value) return;

  sendingCaptcha.value = true;

  try {
    // 调用发送验证码API
    const response = await fetch('http://localhost:8080/api/auth/send-email-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.value.new_email,
        type: 'change_email'
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

// 关闭模态框
const closeModal = () => {
  emit('close');
};

// 提交表单
const handleSubmit = async () => {
  if (!canSubmit.value) return;

  submitting.value = true;

  try {
    // 调用更新邮箱API
    const response = await fetch('http://localhost:8080/api/user/update-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    const data = await response.json();

    if (data.success) {
      alert('邮箱更新成功！');
      emit('update', form.value.new_email);
      closeModal();
    } else {
      throw new Error(data.message || '邮箱更新失败');
    }
  } catch (error) {
    console.error('邮箱更新失败:', error);
    alert(error.message || '邮箱更新失败，请稍后重试');
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
  width: 450px;
  max-width: 90vw;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.modal-body {
  padding: 24px;
}

.update-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  font-size: 18px;
  color: #666;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.input-wrapper input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.error-text {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: 4px;
}

/* 验证码区域 */
.captcha-wrapper {
  display: flex;
  gap: 12px;
}

.captcha-btn {
  flex-shrink: 0;
  padding: 0 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.captcha-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.captcha-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hint-text {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

/* 操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: 10px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
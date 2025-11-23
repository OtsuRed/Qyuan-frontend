<template>
  <div class="subscription-page">
    <div class="card">
      <div class="card-body">
        <div class="tabs">
          <button
              v-for="(tab, index) in tabs"
              :key="index"
              :class="['tab', { active: activeTab === index }]"
              @click="activeTab = index"
          >
            {{ tab }}
          </button>
        </div>

        <div class="pricing">
          <div
              v-for="(plan, index) in plans"
              :key="index"
              class="plan-card"
              :class="{ selected: selectedPlan === index }"
              @click="selectedPlan = index"
          >
            <p class="plan-name">{{ plan.name }}</p>
            <p class="plan-price">¥{{ plan.price }}<span class="unit">/{{ plan.unit }}</span></p>
            <p class="plan-old">¥{{ plan.oldPrice }}</p>
          </div>
        </div>

        <ul class="notes">
          <li>1. 仅提供个人账号使用；</li>
          <li>2. 会员可任意使用AI搜索等高级功能；</li>
          <li>3. 会员可每月下载500篇以内的论文；</li>
          <li>4. 超出范围后无法使用权益，下期自动恢复。</li>
        </ul>

        <div class="payment-section">
          <h3>支付方式</h3>
          <div class="payment-options">
            <button class="pay-btn wechat" @click="pay('wechat')">
              <i class="icon wechat-icon"></i> 微信支付
            </button>
            <button class="pay-btn alipay" @click="pay('alipay')">
              <i class="icon alipay-icon"></i> 支付宝
            </button>
          </div>

          <div class="agreement">
            <input type="checkbox" v-model="agreed" />
            <span>我已了解并同意《千源数据会员服务协议》</span>
          </div>


          <p class="total">支付金额：<span class="price">¥{{ plans[selectedPlan].price }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tabs = ['高级功能畅享卡']
const activeTab = ref(0)

const plans = [
  { name: '月卡', price: 68, oldPrice: 88, unit: '月' },
  { name: '季卡', price: 128, oldPrice: 158, unit: '季' },
  { name: '年卡', price: 199, oldPrice: 298, unit: '年' }
]

const selectedPlan = ref(0)
const agreed = ref(true)

const pay = (method) => {
  alert(`使用${method === 'wechat' ? '微信' : '支付宝'}支付`)
}

const confirmPurchase = () => {
  if (!agreed.value) return alert('请先同意服务协议')
  alert(`购买成功：${plans[selectedPlan.value].name}`)
}
</script>

<style scoped>
.subscription-page {
  font-family: 'PingFang SC', sans-serif;
  background-color: #f8f9fc;
  min-height: 100vh;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.logo {
  height: 40px;
}

.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 24px;
  max-width: 800px;
  margin: auto;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
  background-color: #f6f6f6;
}

.tab.active {
  background-color: #fff5e5;
  border-color: #f7c04a;
  font-weight: bold;
}

.pricing {
  display: flex;
  gap: 16px;
  margin: 20px 0;
}

.plan-card {
  flex: 1;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  text-align: center;
  transition: 0.2s;
}

.plan-card:hover {
  border-color: #ffb100;
}

.plan-card.selected {
  background-color: #fff8e6;
  border-color: #f6b53f;
}

.plan-name {
  font-size: 16px;
  font-weight: bold;
  color: #444;
}

.plan-price {
  font-size: 20px;
  color: #e76f00;
}

.plan-old {
  text-decoration: line-through;
  color: #aaa;
}

.notes {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 20px;
}

.payment-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.payment-options {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.pay-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.wechat {
  background-color: #1aad19;
  color: #fff;
}

.alipay {
  background-color: #1677ff;
  color: #fff;
}

.agreement {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #555;
  margin-bottom: 16px;
}

.confirm-btn {
  width: 100%;
  background-color: #f7a12e;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.confirm-btn:disabled {
  background-color: #ccc;
}

.total {
  text-align: right;
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.price {
  color: #e76f00;
  font-weight: bold;
}
</style>

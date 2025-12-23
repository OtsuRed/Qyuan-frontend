<template>
  <div class="user-center">
    <!-- 顶部导航栏 -->
    <Navigation />
    <!-- 主要区域 -->
    <div class="user-container">
      <!-- 左侧导航栏 -->
      <UserSidebar
          :is-owner="isOwner"
          :user-info="userInfo"
          :active-tab="activeTab"
          @change-tab="changeTab"
      />
      <!-- 右侧内容区域 -->
      <div class="content-area">
        <!-- 我的模式 -->
        <MyProfile
            v-if="isOwner"
            :user-info="userInfo"
            :active-tab="activeTab"
            @update-info="updateUserInfo"
        />
        <!-- 访客模式 -->
        <VisitorProfile
            v-else
            :user-info="visitorInfo"
        />
      </div>
    </div>
    <!-- 底部信息 -->
    <Foot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navigation from "@/views/components/Navigation.vue";
import Foot from "@/views/components/Foot.vue";
import UserSidebar from "./components/UserSidebar.vue";
import MyProfile from "./MyProfile.vue";
import VisitorProfile from "./VisitorProfile.vue";

import {
  userInfo, visitorInfo
} from "./MockData.js";

const route = useRoute();

// 从路由参数获取用户ID
const userId = computed(() => route.params.id);
const currentUserId = ref('current_user_id'); // 实际应从登录状态获取

// 判断是否是查看自己的主页
const isOwner = computed(() => !userId.value || userId.value === currentUserId.value);

// 当前激活的标签页
const activeTab = ref('profile');

// 切换标签页
const changeTab = (tab) => {
  activeTab.value = tab;
};

// 更新用户信息
const updateUserInfo = (newInfo) => {
  Object.assign(userInfo, newInfo);
  console.log('更新用户信息:', newInfo);
  // 这里应该调用API更新用户信息
};

// 初始化加载数据
onMounted(() => {
  console.log('用户中心加载，用户ID:', userId.value);

  if (isOwner.value) {
    // 加载自己的信息
    loadMyProfile();
  } else {
    // 加载访客信息
    loadVisitorProfile(userId.value);
  }
});

// 模拟API调用
const loadMyProfile = async () => {
  // const response = await fetch(`/api/user/profile`);
  // userInfo.value = await response.json();
};

const loadVisitorProfile = async (id) => {
  // const response = await fetch(`/api/user/${id}/profile`);
  // visitorInfo.value = await response.json();
};
</script>

<style scoped src="./User.styles.css"></style>
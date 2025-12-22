<script setup>


import search from "@/views/search/search.vue";
import Navigation from "@/views/components/Navigation.vue";

</script>

<template>
  <div>
    <Navigation/>
    <!--    <h1>这是一个搜索查看页面</h1>-->
    <!--    <router-view></router-view>-->
    <!-- 使用正确的静态资源路径 -->
    <search></search>
  </div>
</template>

<style scoped>

</style>
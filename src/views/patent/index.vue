<script setup>


import patent from "@/views/patent/patent.vue";
import Navigation from "@/views/components/Navigation.vue";

</script>

<template>
  <div>
    <Navigation/>
    <!--    <h1>这是一个专利查看页面</h1>-->
    <!--    <router-view></router-view>-->
    <!-- 使用正确的静态资源路径 -->
    <patent></patent>
  </div>
</template>

<style scoped>

</style>
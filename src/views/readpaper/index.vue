<script setup>


import Navigation from "@/views/components/Navigation.vue";
import paper from "@/views/readpaper/paper.vue";

</script>

<template>  
  <div>
    
    <Navigation/>
    <!--    <h1>这是一个论文查看页面</h1>-->
    <!--    <router-view></router-view>-->
    <!-- 使用正确的静态资源路径 -->
    <paper></paper>
  </div>
</template>

<style scoped>

</style>
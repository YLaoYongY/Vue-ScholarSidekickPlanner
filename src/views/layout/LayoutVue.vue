<script setup>
  import { ref } from 'vue'
  import SlideBar from './components/SlideBar.vue'

  const sidebarWidth = ref('5rem') // 默认宽度
</script>

<template>
  <div class="layout" :style="{ 'grid-template-columns': `${sidebarWidth} auto` }">
    <slide-bar @mouseover="sidebarWidth = '20rem'" @mouseleave="sidebarWidth = '5rem'"></slide-bar>
    <router-view></router-view>
  </div>
</template>

<style scoped>
  .layout {
    display: grid;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    transition: grid-template-columns 0.3s ease; /* 添加过渡动画 */
  }
</style>

<script setup>
  import SlideBar from './components/SlideBar.vue'
</script>
<template>
  <div class="layout">
    <slide-bar></slide-bar>
    <router-view></router-view>
  </div>
</template>

<style scoped>
  .layout {
    display: flex;
    flex-direction: column;
  }
</style>

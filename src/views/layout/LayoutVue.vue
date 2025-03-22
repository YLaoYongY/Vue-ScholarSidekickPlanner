<script setup>
  import SlideBar from './components/SlideBar.vue'
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px"> <slide-bar></slide-bar></el-aside>
      <el-container>
        <el-header>Header</el-header>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>

  <!-- <div>
    <slide-bar></slide-bar>
    <router-view></router-view>
  </div> -->
</template>

<style></style>

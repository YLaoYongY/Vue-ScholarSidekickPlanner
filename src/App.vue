<script setup>
  import { useUserStore } from './stores'
  const userStore = useUserStore()
</script>

<template>
  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.removeToken">删除token</el-button>
  <el-button @click="userStore.setToken('faefafaefaaf')" type="primary">设置token</el-button>
</template>

<style scoped></style>

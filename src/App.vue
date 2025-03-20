<script setup>
  import { useUserStore } from './stores'
  const userStore = useUserStore()
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>

<template>
  <v-container>
    <h1>홈컴포넌트</h1>
    <h1 v-for="i in 90" :key="i">hello junyoung</h1>
  </v-container>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>

</style>
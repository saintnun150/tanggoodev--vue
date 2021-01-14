<template>
<v-alert type="error" border="left" class="ma-4">
  {{$route.path + ' 존재하지 않는 경로 입니다 '}}
</v-alert>
</template>

<script>
export default {
  name: "Error"
}
</script>

<style scoped>

</style>
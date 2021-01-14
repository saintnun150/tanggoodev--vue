<template>
<v-sheet>
  <v-subheader>
    editor
  </v-subheader>
  <editor :options="options" :initialValue="text"></editor>
</v-sheet>
</template>

<script>
export default {
  data() {
    return {
      options: {
        language: 'ko',
      },
      text: '#sdfsdf'
    }
  }
}
</script>

<style scoped>

</style>
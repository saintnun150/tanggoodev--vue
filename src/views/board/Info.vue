<template>
  <board-info v-if="!action" :boardId="info"/>
  <board-form v-else :boardId="info" :action="action"/>
</template>

<script>
import BoardInfo from '@/components/board/Info'
import BoardForm from '@/components/board/Form'
export default {
  components: {
    BoardInfo, BoardForm
  },
  computed: {
    info() {
      return this.$route.params.info
    },
    action() {
      return this.$route.query.action
    }
  }

}
</script>

<style scoped>

</style>
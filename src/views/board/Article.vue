<template>
  <article-content v-if="!action" :boardId="info" :articleId="article"/>
  <article-form v-else :boardId="info" :articleId="article" :action="action" />
</template>

<script>
import ArticleContent from '@/components/board/article/Content'
import ArticleForm from '@/components/board/article/Form'

export default {
  components: {ArticleContent, ArticleForm},
  computed: {
    info() {
      return this.$route.params.info
    },
    article() {
      return this.$route.params.article
    },
    action() {
      return this.$route.query.action
    }
  }
}
</script>

<style scoped>

</style>
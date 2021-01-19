<template>
  <v-card>
    <v-card-title>게시판 목록보기</v-card-title>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :server-items-length="info.count"
        :options.sync="options"
        :footer-props="{
          'items-per-page-options': [5,10,20,30,50]
        }"
        must-sort
        item-key="id"
    >

    </v-data-table>
  </v-card>
</template>

<script>
import {head, last} from 'lodash'

export default {
  props: ['info', 'document'],
  data() {
    return {
      headers: [
        {value: 'createdAt', text: '작성일'},
        {value: 'title', text: '제목'},
        {value: 'user', text: '작성자'},
        {value: 'readCount', text: '조회수'},
        {value: 'commentCount', text: '댓글'},
      ],
      items: [],
      unsubscribe: null,
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      docs: []
    }
  },
  watch: {
    options: {
      handler(n, o) {
        //처음에 options.page는 null임 => data에서 초기값 설정 안함
        // 하지만 구독하면서 options에 page가 생기기 때문에 watch에서 감지함
        if (!o.page) {
          this.subscribe(0)
          return
        }
        if (head(o.sortBy) !== head(n.sortBy) || head(o.sortDesc) !== head(n.sortDesc)) {
          n.page = 1
          this.subscribe(0)
          return
        }
        const arrow = n.page - o.page;
        this.subscribe(arrow)
      },
      deep: true
    }
  },
  created() {
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe(arrow) {
      if (this.unsubscribe) this.unsubscribe()

      const order = this.options.sortBy[0]
      const sort = this.options.sortDesc[0] ? 'desc' : 'asc'
      const limit = this.options.itemsPerPage

      const ref = this.$firebase.firestore().collection('boards').doc(this.document).collection('articles').orderBy(order, sort)
      let query

      switch (arrow) {
        case -1:
          query = ref.endBefore(head(this.docs)).limitToLast(limit)

          break
        case 1:
          query = ref.startAfter(last(this.docs)).limit(limit)

          break
        default:
          query = ref.limit(limit)

          break
      }

      this.unsubscribe = query.onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }
        this.docs = sn.docs
        this.items = sn.docs.map(doc => {
          const item = doc.data()
          item.id = doc.id
          item.createdAt = item.createdAt.toDate().toLocaleString()
          item.updatedAt = item.updatedAt.toDate().toLocaleString()
          return item
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
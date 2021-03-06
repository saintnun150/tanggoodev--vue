<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :server-items-length="board.count"
        :options.sync="options"
        :footer-props="{
            'items-per-page-options': [5,10,20,30,50]
          }"
        must-sort
        item-key="id"
    >
      <template v-slot:item.createdAt="{item}">
        <display-time :time="item.createdAt"></display-time>
      </template>
      <template v-slot:item.title="{item}">
        <a @click="read(item)">{{item.title}}</a>
      </template>
      <template v-slot:item.user.displayName="{item}">
        <display-user :user="item.user"></display-user>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {head, last} from 'lodash'
import DisplayTime from "@/components/DisplayTime";
import DisplayUser from "@/components/DisplayUser";

export default {
  components: {DisplayTime, DisplayUser},
  props: ['board', 'boardId'],
  data() {
    return {
      headers: [
        {value: 'createdAt', text: '작성일'},
        {value: 'title', text: '제목'},
        {value: 'user.displayName', text: '작성자'},
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
    boardId() {
      this.subscribe(0)
    },
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
    },
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

      const ref = this.$firebase.firestore().collection('boards').doc(this.boardId).collection('articles').orderBy(order, sort)
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
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          return item
        });
      });
    },
    read(item) {
      this.$router.push({path: this.$route.path + '/' + item.id})
    }
  }
}
</script>

<style scoped>

</style>
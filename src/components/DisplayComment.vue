<template>
  <v-card>
    <v-card-title>
      <v-textarea
          v-model="comment"
          @click:append="save"
          append-icon="mdi-send"
          label="댓글 작성"
          rows="3"
          auto-grow
          outlined
          hide-details
      ></v-textarea>
    </v-card-title>
    <template v-for="(item, i) in items">
      <v-list-item :key="item.id">
        <v-list-item-action>
          <display-user :user="item.user"></display-user>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-subtitle class="black--text comment" v-text="item.comment"></v-list-item-subtitle>
          <v-list-item-subtitle class="font-italic">
            <display-time :time="item.createdAt"></display-time>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="i"></v-divider>
    </template>
    <v-list-item>
      <v-btn v-if="lastDoc && items.length < article.commentCount"
             v-intersect="onIntersect"
             color="primary" text
             @click="more" block>더보기
      </v-btn>
    </v-list-item>
  </v-card>
</template>

<script>
import {last} from 'lodash'
import DisplayTime from "@/components/DisplayTime";
import DisplayUser from "@/components/DisplayUser";

const LIMIT = 5

export default {
  props: ['article', 'docRef'],
  components: {
    DisplayTime, DisplayUser
  },
  data() {
    return {
      comment: '',
      items: [],
      unsubscribe: null,
      lastDoc: null
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    snapShotToItems(sn) {
      this.lastDoc = last(sn.docs)
      sn.docs.forEach(doc => {
        const exists = this.items.some(item => doc.id === item.id)
        if (!exists) {
          const item = doc.data()
          item.id = doc.id
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          this.items.push(item)
        }
      })
      this.items.sort((prev, next) => {
        // 새로 추가하면 sort가 되지 않기 때문에 추가
        const prevId = Number(prev.id)
        const nextId = Number(next.id)
        return nextId - prevId
      })
    },
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      // collection 감시: snapShot, document 감시: document
      this.unsubscribe = this.docRef.collection('comments').orderBy('createdAt', 'desc').limit(LIMIT).onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }
        this.snapShotToItems(sn)
      })
    },
    async more() {
      if (!this.lastDoc) throw Error('더이상 데이터가 없습니다')
      const sn = await this.docRef.collection('comments').orderBy('createdAt', 'desc').startAfter(this.lastDoc).limit(LIMIT).get()
      this.snapShotToItems(sn)
    },
    onIntersect(entries, observer, isIntersecting) {
      if (isIntersecting) this.more()
    },
    async save() {
      const doc = {
        createdAt: new Date(),
        updatedAt: new Date(),
        comment: this.comment,
        uid: this.$store.state.fireUser.uid,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName
        }
      }
      const id = doc.createdAt.getTime().toString()
      this.docRef.collection('comments').doc(id).set(doc)
      this.comment = ''
    },
  }
}
</script>
<style scoped lang="scss">
.comment {
  white-space: pre-wrap;
}
</style>
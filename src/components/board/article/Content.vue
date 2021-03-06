<template>
  <v-container fluid>
    <v-card v-if="article">
      <v-toolbar color="primary" dark dense flat>
        <v-toolbar-title>{{ article.title }}</v-toolbar-title>
        <v-spacer/>
        <v-btn @click="articleWrite" icon>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn @click="remove" icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn @click="back" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <viewer v-if="content" :initialValue="content"></viewer>
        <v-container v-else>
          <v-row justify="center" align="center">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <span class="font-italic caption">
      생성일: <display-time :time="article.createdAt"></display-time>
      </span>
      </v-card-actions>
      <v-card-actions>
        <v-spacer/>
        <span class="font-italic caption">
      수정일: <display-time :time="article.updatedAt"></display-time>
      </span>
      </v-card-actions>
      <v-card-actions>
        <v-spacer/>
        <v-btn icon @click="like">
          <v-icon left :color="liked ? 'success' : ''">mdi-thumb-up</v-icon>
          <span>{{article.likeCount}}</span>
        </v-btn>
      </v-card-actions>
      <v-divider/>
      <display-comment :article="article" :docRef="ref"></display-comment>
    </v-card>
    <v-card v-else>
      <v-container>
        <v-row justify="center" align="center">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import DisplayTime from "@/components/DisplayTime";
import DisplayComment from "@/components/DisplayComment";

export default {
  components: {DisplayTime, DisplayComment},
  props: ['boardId', 'articleId'],
  data() {
    return {
      content: '',
      ref: this.$firebase.firestore().collection('boards').doc(this.boardId).collection('articles').doc(this.articleId),
      unsubscribe: null,
      article: null
    }
  },
  computed: {
    fireUser() {
      return this.$store.state.fireUser
    },
    liked() {
      if (!this.fireUser) return false
      //inclues는 배열에서 해당 argument로 넘긴 값이 속해있는지 아닌지 판별하는 array 내장함수. java의 contain 함수와 비슷
      return this.article.likeUids.includes(this.fireUser.uid)
    }
  },
  async created() {
    await this.readCountUpdate()
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      this.unsubscribe = this.ref.onSnapshot(doc => {
        if (!doc.exists) {
          this.back()
          return
        }
        const item = doc.data()
        item.createdAt = item.createdAt.toDate()
        item.updatedAt = item.updatedAt.toDate()
        if (!this.article || this.article.url !== item.url) this.fetch(item.url)
        this.article = item
      }, console.error);
    },
    async readCountUpdate() {
      await this.ref.update({
        readCount: this.$firebase.firestore.FieldValue.increment(1)
      })
    },
    async fetch(url) {
      const res = await axios.get(url)
      this.content = typeof res.data === 'string' ? res.data : res.data.toString()
    },
    async articleWrite() {
      await this.$router.push({path: this.$route.path, query: {action: 'write'}})
    },
    async remove() {
      await this.ref.collection('articles').doc(this.articleId).delete()
    },
    back() {
      const us = this.$route.path.split('/')
      us.pop()
      this.$router.push({path: us.join('/')})
    },
    async like() {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (this.liked) {
        await this.ref.update({
          likeCount: this.$firebase.firestore.FieldValue.increment(-1),
          likeUids: this.$firebase.firestore.FieldValue.arrayRemove(this.fireUser.uid)
        })
      } else {
        await this.ref.update({
          likeCount: this.$firebase.firestore.FieldValue.increment(1),
          likeUids: this.$firebase.firestore.FieldValue.arrayUnion(this.fireUser.uid)
        })
      }
    }
  }
}
</script>
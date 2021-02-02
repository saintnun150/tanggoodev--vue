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
    }
  }
}
</script>
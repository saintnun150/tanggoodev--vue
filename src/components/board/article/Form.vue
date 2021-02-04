<template>
  <v-container fluid>
    <v-form>
      <v-card :loading="loading">
        <v-toolbar color="accent" dense flat dark>
          <v-toolbar-title>게시판 글 작성</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="$router.push('/board/' + boardId)">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-btn icon @click="save" :disabled="!user">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-text-field v-model="form.title" outlined label="제목"></v-text-field>
          <editor v-if="articleId === 'new'" :initialValue="form.content" initialEditType="wysiwyg" :options="{hideModeSwitch: true}" ref="editor"></editor>
          <template v-else>
            <editor v-if="form.content" :initialValue="form.content" initialEditType="wysiwyg" :options="{hideModeSwitch: true}" ref="editor"></editor>
            <v-container v-else>
              <v-row justify="center" align="center">
                <v-progress-circular indeterminate></v-progress-circular>
              </v-row>
            </v-container>
          </template>
        </v-card-text>
      </v-card>
    </v-form>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  props: ['boardId', 'articleId', 'action'],
  data() {
    return {
      unsubscribe: null,
      form: {
        title: '',
        content: ''
      },
      exists: false,
      loading: false,
      ref: null,
      article: null
    }
  },
  watch: {
    boardId() {
      this.fetch()
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    fireUser() {
      return this.$store.state.fireUser
    }
  },
  created() {
    this.fetch()
  },
  destroyed() {
  },
  methods: {
    async fetch() {
      this.ref = this.$firebase.firestore().collection('boards').doc(this.boardId)
      if (this.articleId === 'new') return
      const doc = await this.ref.collection('articles').doc(this.articleId).get()
      this.exists = doc.exists
      if (!this.exists) {
        return;
      }
      const item = doc.data()
      this.article = item
      this.form.title = item.title
      //const res = await axios.get(item.url)
      // 어차피 data만 필요하기 때문에 res.data 이렇게 써야하지만 아래와 같이 사용가능
      const { data } = await axios.get(item.url)
      this.form.content = typeof data === 'string' ? data : data.toString()
    },
    async save() {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (!this.form.title) throw Error('제목을 입력해주세요')

      const md = this.$refs.editor.invoke('getMarkdown')
      if (!md) throw Error('내용을 입력해주세요')
      this.loading = true
      try {
        const createdAt = new Date()
        const doc = {
          title: this.form.title,
          updatedAt: createdAt,
        }
        if (this.articleId === 'new') {
          const id = createdAt.getTime().toString()
          const sn = await this.$firebase.storage().ref().child('boards').child(this.boardId).child(id + '.md').putString(md)
          doc.url = await sn.ref.getDownloadURL()
          doc.createdAt = createdAt
          doc.commentCount = 0
          doc.readCount = 0
          doc.uid = this.$store.state.fireUser.uid
          doc.user = {
            email: this.user.email,
            photoURL: this.user.photoURL,
            displayName: this.user.displayName
          }
          doc.likeCount = 0
          doc.likeUids = []
          await this.ref.collection('articles').doc(id).set(doc)
        } else {
          await this.$firebase.storage().ref().child('boards').child(this.boardId).child(this.articleId + '.md').putString(md)
          await this.ref.collection('articles').doc(this.articleId).update(doc)
        }
      } finally {
        this.loading = false
        await this.$router.push('/board/' + this.boardId)
      }

    }
  }
}
</script>
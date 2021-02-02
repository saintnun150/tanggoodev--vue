<template>
  <v-card>
    <v-toolbar color="primary" dark>
      <v-toolbar-title>{{ item.title }}</v-toolbar-title>
      <v-spacer/>
      <v-btn @click="articleWrite" icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn @click="remove" icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn @click="$emit('close')" icon>
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
      생성일: <display-time :time="item.createdAt"></display-time>
      </span>
    </v-card-actions>
    <v-card-actions>
      <v-spacer/>
      <span class="font-italic caption">
      수정일: <display-time :time="item.updatedAt"></display-time>
      </span>
    </v-card-actions>
    <v-divider/>
    <display-comment :article="item" :docRef="this.ref.collection('articles').doc(this.item.id)"></display-comment>
  </v-card>
</template>

<script>
import axios from "axios";
import DisplayTime from "@/components/DisplayTime";
import DisplayComment from "@/components/DisplayComment";

export default {
  components: {DisplayTime, DisplayComment},
  props: ['document', 'item'],
  data() {
    return {
      content: '',
      ref: this.$firebase.firestore().collection('boards').doc(this.document)
    }
  },
  mounted() {
    // 제목을 눌럿을 때 dialog가 뜨면서 displayContent 컴포넌트가 mount되는데
    // 문제는 해당 dialog를 끄고 다른 dialog를 띄워도 displayContent 컴포넌트는 해제되지 않았기 때문에 더이상 이 컴포넌트가 mount되지 않는다는 것이다.
    // 따라서 이 컴포넌트의 rendering을 해제하여 destroyed 시켜야함
    this.fetch()
  },
  methods: {
    async fetch() {
      const res = await axios.get(this.item.url)
      this.content = String(res.data)
    },
    async articleWrite() {
      await this.$router.push({path: this.$route.path + '/article-write', query: {articleId: this.item.id}})
    },
    async remove() {
      await this.ref.collection('articles').doc(this.item.id).delete()
      this.$emit('close')
    }
  }
}
</script>
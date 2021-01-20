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
  </v-card>
</template>

<script>
import axios from "axios";
import DisplayTime from "@/components/DisplayTime";

export default {
  components: {DisplayTime},
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
      this.content = res.data
      await this.ref.collection('articles').doc(this.item.id)
          .update({
            readCount: this.$firebase.firestore.FieldValue.increment(1)
          })
    },
    async articleWrite() {
      await this.$router.push({path: this.$route.path + '/article-write', query: {articleId: this.item.id}})
    },
    async remove() {
      // 아래 작업들은 모두 이뤄져야하기 때문에 트랜잭션 처리가 필요하다 => batch로 작업
      const batch = await this.$firebase.firestore().batch()
      batch.update(this.ref, {count: this.$firebase.firestore.FieldValue.increment(-1)})
      batch.delete(this.ref.collection('articles').doc(this.item.id))
      await batch.commit()
      // await this.ref.update({count: this.$firebase.firestore.FieldValue.increment(-1)})
      // await this.ref.collection('articles').doc(this.item.id).delete()
      await this.$firebase.storage().ref().child('boards').child(this.document).child(this.item.id + '.md').delete()
      this.$emit('close')
    }
  }
}
</script>
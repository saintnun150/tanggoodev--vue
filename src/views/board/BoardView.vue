<template>
  <v-row id="board-view-wrap" class="mt-5">
    <v-card outlined>
      <v-col>
        <v-text-field v-model="form.title">
          <template v-slot:label>
            <v-icon style="vertical-align: middle">
              mdi-lead-pencil
            </v-icon>
            <strong class="ml-1">제목</strong>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <viewer v-if="form.content != ''" :initialValue="form.content"/>
      </v-col>
      <v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn>
            <v-icon>mdi-eraser</v-icon>
            <strong>수정</strong>
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-card>
  </v-row>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "codemirror/lib/codemirror.css";
import Viewer from '@toast-ui/vue-editor/src/Viewer.vue'

export default {
  name: "BoardView",
  components: {
    Viewer
  },
  data() {
    return {
      form: {
        title: '',
        content: ''
      }
    }
  },
  mounted() {
    this.$firebase
        .firestore()
        .collection("boards")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.form.title = doc.data().title;
            this.form.content = doc.data().content;
          })
        });
    console.log(this.form);
  }
}
</script>

<style scoped lang="scss">
#board-view-wrap {
  flex-direction: column;
}
</style>

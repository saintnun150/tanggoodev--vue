<template>
  <v-row id="board-write-wrap" class="mt-5">
    <v-card outlined>
      <v-form>
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
          <web-editor ref="editor"></web-editor>
        </v-col>
        <v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="save">
              <v-icon>mdi-content-save</v-icon>
              <strong>저장</strong>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-form>
    </v-card>
  </v-row>
</template>

<script>
import WebEditor from "@/components/board/WebEditor";

export default {
  name: "BoardWrite",
  components: {WebEditor},
  data() {
    return {
      form: {
        title: "",
        content: ""
      }
    }
  },
  methods: {
    save() {
      this.form.content = this.$refs.editor.invoke("getHtml");
      this.$firebase.firestore().collection('boards').add(this.form);
    }
  }
};
</script>

<style scoped lang="scss">
#board-write-wrap {
  flex-direction: column;
}
</style>

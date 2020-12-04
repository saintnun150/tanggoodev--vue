<template>
  <v-row id="board-write-wrap" class="mt-5">
    <v-card outlined>
      <v-col>
        <v-text-field v-model="title">
          <template v-slot:label>
            <v-icon style="vertical-align: middle">
              mdi-lead-pencil
            </v-icon>
            <strong class="ml-1">제목</strong>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <web-editor ref="test23"></web-editor>
      </v-col>
      <v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="saveBoardContent">
            <v-icon>mdi-content-save</v-icon>
            <strong>저장</strong>
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-card>
  </v-row>
</template>

<script>
import WebEditor from "@/components/board/WebEditor";

export default {
  name: "BoardWrite",
  components: { WebEditor },
  data() {
    return {
      title: "",
      content: ""
    }
  },
  methods: {
    saveBoardContent() {}
  }
};
</script>

<style scoped lang="scss">
#board-write-wrap {
  flex-direction: column;
}
</style>

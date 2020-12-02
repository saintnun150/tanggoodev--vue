<template>
  <v-row id="board-view-wrap" class="mt-5">
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
<!--        <WebEditor ref="test23"></WebEditor>-->
      </v-col>
      <v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="saveBoardContent">
            <v-icon>mdi-eraser</v-icon>
            <strong>수정</strong>
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: "BoardView"
}
</script>

<style scoped lang="scss">
#board-view-wrap {
  flex-direction: column;
}
</style>

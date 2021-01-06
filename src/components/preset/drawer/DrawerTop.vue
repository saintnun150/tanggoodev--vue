<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title class="title" v-text="top.title"/>
      <v-list-item-subtitle>
        version 0.0.1
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action style="flex-direction: row">
      <v-btn v-if="$store.state.editable" icon @click="openDialog">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn class="ml-4" icon @click="$store.commit('changeEditable', !$store.state.editable)">
        <v-icon v-text="$store.state.editable ? 'mdi-eye' : 'mdi-pen'"></v-icon>
      </v-btn>
    </v-list-item-action>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>
          제목 수정
          <v-spacer/>
          <v-btn icon @click="save">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field outlined v-model="text" @keypress.enter="save" hide-details/>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-list-item>
</template>

<script>
export default {
  name: "DrawerTop",
  props: ["top"],
  data() {
    return {
      dialog: false,
      text: this.top.title,
    }
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    async save() {
      try {
        await this.$firebase.database().ref().child("site").child("top").update({title: this.text});
      } finally {
        this.text = this.top.title;
        this.dialog = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
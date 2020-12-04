<template>
  <v-footer app color="teal darken-2" dark absolute>
    <v-spacer/>
    <span style="right: 0">
      &copy;{{ new Date().getFullYear() }}
      <strong>{{ footerText }}</strong>
    </span>
    <v-btn icon @click="openDialog">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>
          footer 수정
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
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",
  props: ["footerText"],
  data() {
    return {
      dialog: false,
      text: this.footerText
    }
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    async save() {
      try {
        await this.$firebase.database().ref().child("site").child("footer").update({title: this.text});
      } catch (e) {
        console.log(e.message);
      } finally {
        this.dialog = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
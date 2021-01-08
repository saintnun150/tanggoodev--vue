<template>
  <v-card>
    <v-card-title>보더 홈 컴포넌트</v-card-title>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
    >
      <template v-slot:item.id="{ item }">
        <v-btn icon @click="openDialog(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="remove(item)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
    <v-card-actions>
      <v-btn @click="openDialog(null)">
        <v-icon left>mdi-pencil</v-icon>
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-text>
          <v-form>
            <v-text-field v-model="form.title"></v-text-field>
            <v-text-field v-model="form.content"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-if="selectedItem" @click="update">update</v-btn>
          <v-btn v-else @click="add">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {value: 'title', text: '제목'},
        {value: 'id', text: 'id'}
      ],
      items: [],
      form: {
        title: '',
        content: ''
      },
      dialog: false,
      selectedItem: null,
      unsubscribe: null
    }
  },
  created() {
    this.subscribe();
  },
  destroyed() {
    // 해지하지 않으면 다른 페이지에서 수정이 발생해도 계속 listen 하고 있음
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    subscribe() {
      this.unsubscribe = this.$firebase.firestore().collection('boards').onSnapshot((snapshot) => {
        if (snapshot.empty) {
          this.items = [];
          return;
        }
        this.items = snapshot.docs.map(v => {
          const item = v.data();
          return {
            id: v.id,
            title: item.title,
            content: item.content
          };
        });
      })
    },
    openDialog(item) {
      this.selectedItem = item
      this.dialog = true;
      if (!item) {
        this.form.title = '';
        this.form.content = '';
      } else {
        this.form.title = item.title;
        this.form.content = item.content;
      }
    },
    add() {
      this.$firebase.firestore().collection('boards').add(this.form);
      this.dialog = false;
    },
    update() {
      this.$firebase.firestore().collection('boards').doc(this.selectedItem.id).update(this.form);
      this.dialog = false;
    },
    remove(item) {
      this.$firebase.firestore().collection('boards').doc(item.id).delete();
    },
    async read() {
      await this.$firebase
          .firestore()
          .collection("boards")
          .get()
          .then(snapshot => {
            this.items = snapshot.docs.map(v => {
              const item = v.data();
              return {
                id: v.id,
                title: item.title,
                content: item.content
              };
            });
            console.log(this.items);
          });
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <v-card>
    <v-card-title>보더 홈 컴포넌트</v-card-title>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :options.sync="options"
        :server-items-length="serverItemsLength"
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
      unsubscribe: null,
      unsubscribeCount: null,
      serverItemsLength: 0,
      options: {}
    }
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        // 처음에 oldval이 비어있는데 리스트가 렌더링되면서 newVal이 채워짐
        console.log(newVal);
        console.log(oldVal);
        this.subscribe();
      },
      deep: true // options 하위 object를 다 감지하고 싶음
    }
  },
  created() {
    // this.subscribe();
  },
  destroyed() {
    // 해지하지 않으면 다른 페이지에서 수정이 발생해도 계속 listen 하고 있음
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.unsubscribeCount) {
      this.unsubscribeCount();
    }
  },
  methods: {
    subscribe() {
      this.unsubscribeCount = this.$firebase.firestore().collection('meta').doc('boards').onSnapshot((doc) => {
        if (!doc.exists) {
          return;
        }
        // 보안때문에 항상 doc.data() 이런식으로 꺼냄
        this.serverItemsLength = doc.data().count;

      });

      this.unsubscribe = this.$firebase.firestore().collection('boards').limit(this.options.itemsPerPage).onSnapshot((snapshot) => {
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
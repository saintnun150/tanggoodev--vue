<template>
  <v-card>
    <v-card-title>보더 홈 컴포넌트</v-card-title>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :options.sync="options"
        :server-items-length="serverItemsLength"
        must-sort
    >
      <template v-slot:item.id="{ item }">
        <v-btn icon @click="openDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="remove(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.createdAt="{ item }">
        {{item.createdAt.toLocaleString()}}
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
import {head, last} from 'lodash'

export default {
  data() {
    return {
      headers: [
        {value: 'createdAt', text: '작성일'},
        {value: 'title', text: '제목'},
        {value: 'content', text: '내용'},
        {value: 'id', text: 'id', sortable: false},

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
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      docs: [],
    }
  },
  watch: {
    options: {
      handler(newVal, oldVal) {
        // 처음에 oldval이 비어있는데 리스트가 렌더링되면서 newVal이 채워짐
        // 파이어스토어는 prev, next 기능만 있을 뿐이지 게시판의 각 페이지로 이동하는 기능은 기본적으로 할 수 없다.
        const arrow = newVal.page - oldVal.page; // 이전, 다음, 제자리 페이지인지 확인
        this.subscribe(arrow);
      },
      deep: true // options 하위 object를 다 감지하고 싶음
    }
  },
  created() {
    // this.subscribe();
  },
  destroyed() {
    // 해지하지 않으면 다른 페이지에서 수정이 발생해도 계속 listen 하고 있음
    if (this.unsubscribe) this.unsubscribe();
    if (this.unsubscribeCount) this.unsubscribeCount();
  },
  methods: {
    subscribe(arrow) {
      this.unsubscribeCount = this.$firebase.firestore().collection('meta').doc('boards').onSnapshot((doc) => {
        if (!doc.exists) return;
        // 보안때문에 항상 doc.data() 이런식으로 꺼냄
        this.serverItemsLength = doc.data().count;
      });
      const order = head(this.options.sortBy);
      const sort = head(this.options.sortDesc) ? 'desc' : 'asc';
      const limit = this.options.itemsPerPage;

      const ref = this.$firebase.firestore().collection('boards').orderBy(order, sort);

      let query;
      switch (arrow) {
        case -1:
          query = ref.endBefore(head(this.docs)).limitToLast(limit)
          break;
        case 1:
          query = ref.startAfter(last(this.docs)).limit(limit)
          break
        default:
          query = ref.limit(limit)
          break
      }

      this.unsubscribe = query.onSnapshot((snapshot) => {
        if (snapshot.empty) {
          this.items = [];
          return;
        }
        this.docs = snapshot.docs;
        this.items = snapshot.docs.map(v => {
          const item = v.data();
          return {
            id: v.id, title: item.title, content: item.content, createdAt: item.createdAt.toDate()
          };
        });
      });
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
      const item = {};
      Object.assign(item, this.form);
      item.createdAt = new Date();
      this.$firebase.firestore().collection('boards').add(item);
      this.dialog = false;
    },
    update() {
      this.$firebase.firestore().collection('boards').doc(this.selectedItem.id).update(this.form);
      this.dialog = false;
    },
    remove(item) {
      this.$firebase.firestore().collection('boards').doc(item.id).delete();
    },
  }
}
</script>

<style scoped>

</style>
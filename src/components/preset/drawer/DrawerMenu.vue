<template>
  <div>
    <v-list>
      <v-list-group
          v-for="(item, i) in items"
          :key="i"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-btn icon @click="openDialogItem(i)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-icon>
        </template>

        <v-list-item
            v-for="(subItem, j) in item.subItems"
            :key="j"
            :to="subItem.to"
        >
          <v-list-item-content>
            <v-list-item-title v-text="subItem.title"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="openDialogSubItem(i, j)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-list-item @click="openDialogSubItem()">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>서브메뉴 추가</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-list-item @click="openDialogItem(-1)">
      <v-list-item-icon>
        <v-icon>mdi-plus</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>메뉴 추가</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-dialog v-model="dialogItem" max-width="400">
      <v-card>
        <v-card-title>수정하기
          <v-spacer/>
          <v-btn icon @click="saveItem">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="formItem.title"></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSubItem" max-width="400">
      <v-card>
        <v-card-title>서브메뉴 수정하기
          <v-spacer/>
          <v-btn icon>
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="formItem.subItems.title"></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DrawerMenu",
  props: ["items"],
  data() {
    return {
      dialogItem: false,
      dialogSubItem: false,
      formItem: {
        icon: '',
        title: '',
        subItems: {}
      },
      selectedItemIndex: -1,
      selectedSubItemIndex: -1
    }
  },
  methods: {
    openDialogItem(index) {
      console.log("index:", index);
      this.selectedItemIndex = index;
      this.dialogItem = true;
      if (index < 0) {
        this.formItem.title = "";
      } else {
        this.formItem.title = this.items[index].title
      }
    },
    saveItem() {
      if (this.selectedItemIndex < 0) {
        this.items.push(this.formItem);
      } else {
        this.items[this.selectedItemIndex] = this.formItem;
      }
      this.save();
    },
    async save() {
      try {
        await this.$firebase.database().ref().child("site").child("menu").set(this.items);
      } finally {
        this.dialogItem = false;
      }
    },
    openDialogSubItem(parentIndex, index) {
      console.log("Index:", parentIndex, index);
      this.selectedItemIndex = parentIndex;
      this.selectedSubItemIndex = index;
      this.dialogSubItem = true;
      console.log("parent:", typeof parentIndex && typeof index === "undefined");
      return;
      /*if (index < 0) {
        this.formItem.title = "";
      } else {
        this.formItem.title = this.items[index].title
      }*/
    },
  }
}
</script>

<style scoped>

</style>
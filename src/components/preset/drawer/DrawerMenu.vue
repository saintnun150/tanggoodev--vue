<template>
  <div>
    <v-list>
      <v-list-group
          v-for="(item, i) in items"
          :key="i"
          v-model="item.active"
          :prepend-icon="item.icon"
          :no-action="!$store.state.editable"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
          <v-list-item-icon v-if="$store.state.editable">
            <v-btn icon @click="openDialogItem(i)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="moveItem(items, i, -1)" v-if="i > 0">
              <v-icon>mdi-chevron-double-up</v-icon>
            </v-btn>
            <v-btn icon @click="moveItem(items, i, 1)" v-if="i < items.length - 1">
              <v-icon>mdi-chevron-double-down</v-icon>
            </v-btn>
          </v-list-item-icon>
        </template>

        <v-list-item
            v-for="(subItem, j) in item.subItems"
            :key="j"
            :to="!$store.state.editable ? subItem.to : null"
        >
          <v-list-item-icon :class="$store.state.editable ? 'pl-6' : ''">
            <v-icon v-text="subItem.icon"/>
          </v-list-item-icon>
          <v-list-item-title v-text="subItem.title"/>
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-list-item v-if="$store.state.editable" @click="openDialogItem(-1)">
      <v-list-item-icon>
        <v-icon>mdi-plus</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>메뉴 추가</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- 메뉴 dialog -->
    <v-dialog v-model="dialogItem" max-width="600" persistent>
      <v-card>
        <v-card-title
        >Menu Edit
          <v-spacer/>
          <v-btn class="ml-4" icon @click="dialogItem = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider/>
        <v-simple-table class="text-center">
          <thead>
          <tr>
            <th class="text-center">Prev-Icon</th>
            <th class="text-center">preview</th>
            <th class="text-center">icon</th>
            <th class="text-center">title</th>
            <th class="text-center">save</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <v-icon v-text="formItem.icon"/>
            </td>
            <td>
              <v-icon
                  color="teal darken-2"
                  v-text="previewItemIcon"
                  v-model="previewItemIcon"
              />
            </td>
            <td>
              <v-text-field v-model="previewItemIcon"/>
            </td>
            <td>
              <v-text-field v-model="formItem.title"/>
            </td>
            <td>
              <v-btn icon @click="saveItem">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-simple-table>
        <!--dialog 서브 메뉴 구분 위치-->
        <div id="seperate_layer" v-if="selectedItemIndex !== -1">
          <v-system-bar class="mt-2"/>
          <v-card-title
          >Sub Menu Edit
            <v-spacer/>
            <v-btn @click="openDialogSubItem(-1)">
              add
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider/>
          <v-simple-table class="text-center">
            <thead>
            <tr>
              <th class="text-center">title</th>
              <th class="text-center">icon</th>
              <th class="text-center">route</th>
              <th class="text-center">edit</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(dialogInSubItem, k) in dialogInSubItems" :key="k">
              <td v-text="dialogInSubItem.title"/>
              <td>
                <v-icon v-text="dialogInSubItem.icon"/>
              </td>
              <td v-text="dialogInSubItem.to"/>
              <td>
                <v-btn icon @click="openDialogSubItem(k)">
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn icon @click="deleteSubItem(k)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
            </tbody>
          </v-simple-table>
        </div>
      </v-card>
    </v-dialog>
    <!-- 메뉴 dialog //-->

    <!-- 서브 메뉴 dialog -->
    <v-dialog max-width="600" v-model="dialogSubItem" persistent>
      <v-card>
        <v-card-title>
          Sub Menu Edit
          <v-spacer/>
          <v-btn icon @click="saveSubItem()">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn class="ml-4" icon @click="dialogSubItem = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider/>
        <v-list>
          <v-list-item>
            <v-row class="align-center">
              <v-col>
                <v-text-field
                    hide-details
                    outlined
                    label="title"
                    placeholder="title"
                    v-model="formSubItem.title"
                />
              </v-col>
              <v-col>
                <v-simple-table>
                  <thead>
                  <tr>
                    <th v-if="formSubItem.icon !== ''">Prev</th>
                    <th>Next</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td v-if="formSubItem.icon !== ''">
                      <v-icon v-text="formSubItem.icon"/>
                    </td>
                    <td>
                      <v-icon
                          color="teal darken-2"
                          v-text="previewSubItemIcon"
                          v-model="previewSubItemIcon"
                      />
                    </td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <v-col>
                <v-text-field
                    hide-details
                    outlined
                    label="icon"
                    placeholder="icon"
                    v-model="previewSubItemIcon"
                />
              </v-col>
              <v-col>
                <v-text-field
                    hide-details
                    outlined
                    label="route"
                    placeholder="route"
                    v-model="formSubItem.to"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <!-- 서브 메뉴 dialog //-->
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
      selectedItemIndex: -1,
      selectedSubItemIndex: -1,
      formItem: {
        icon: "",
        title: "",
        subItems: []
      },
      dialogInSubItems: [],
      formSubItem: {
        icon: "",
        title: "",
        to: ""
      },
      previewItemIcon: "",
      previewSubItemIcon: ""
    };
  },
  methods: {
    openDialogItem(index) {
      this.selectedItemIndex = index;
      this.dialogItem = true;
      this.previewItemIcon = "";
      if (index < 0) {
        this.formItem.title = "";
        this.formItem.icon = "";
        this.formItem.subItems = [];
      } else {
        this.dialogInSubItems = this.items[index].subItems;
        this.formItem.title = this.items[index].title;
        this.formItem.icon = this.items[index].icon;
      }
    },
    openDialogSubItem(subIndex) {
      this.selectedSubItemIndex = subIndex;
      this.dialogSubItem = true;
      this.previewSubItemIcon = "";
      if (subIndex < 0) {
        this.formSubItem.title = "";
        this.formSubItem.icon = "";
        this.formSubItem.to = "";
      } else {
        this.formSubItem.title = this.dialogInSubItems[subIndex].title;
        this.formSubItem.icon = this.dialogInSubItems[subIndex].icon;
        this.formSubItem.to = this.dialogInSubItems[subIndex].to;
      }
    },
    async save(payload) {
      try {
        await this.$firebase
            .database()
            .ref()
            .child("site")
            .child("menu")
            .set(this.items);
      } finally {
        if (payload < 0) {
          this.dialogInSubItems = this.items[this.selectedItemIndex].subItems;
          this.dialogSubItem = false;
        } else {
          this.dialogItem = false;
        }
      }
    },
    saveItem() {
      if (this.previewItemIcon !== "") {
        this.formItem.icon = this.previewItemIcon;
      }
      if (this.selectedItemIndex < 0) {
        this.items
            .push({
              icon: this.formItem.icon,
              title: this.formItem.title
            });
      } else {
        this.items[this.selectedItemIndex].icon = this.formItem.icon;
        this.items[this.selectedItemIndex].title = this.formItem.title;
      }
      this.save(1);
    },
    saveSubItem() {
      if (this.previewSubItemIcon !== "") {
        this.formSubItem.icon = this.previewSubItemIcon;
      }
      if (this.selectedSubItemIndex < 0) {
        if (!this.items[this.selectedItemIndex].subItems) {
          this.items[this.selectedItemIndex].subItems = [];
        }
        this.items[this.selectedItemIndex]
            .subItems
            .push({
              title: this.formSubItem.title,
              icon: this.formSubItem.icon,
              to: this.formSubItem.to
            });
      } else {
        this.items[this.selectedItemIndex].subItems[this.selectedSubItemIndex].title = this.formSubItem.title;
        this.items[this.selectedItemIndex].subItems[this.selectedSubItemIndex].icon = this.formSubItem.icon;
        this.items[this.selectedItemIndex].subItems[this.selectedSubItemIndex].to = this.formSubItem.to;
      }
      this.save(-1);
    },
    moveItem(items, index, direction) {
      const item = items.splice(index, 1)[0];
      items.splice(index + direction, 0, item);
      console.log(items, index, direction);
    }
  }
};
</script>

<style scoped></style>
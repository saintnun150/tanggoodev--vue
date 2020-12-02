<template>
  <div ref="toastuiEditor"></div>
</template>

<script>
import Editor from '@toast-ui/editor';
import {optionsMixin} from '@/plugins/editorOption'
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

export default {
  name: "WebEditor",
  mixins: [optionsMixin],
  props: {
    previewStyle: {
      type: String
    },
    height: {
      type: String
    },
    initialEditType: {
      type: String
    },
    initialValue: {
      type: String
    },
    language: {
      type: String
    },
    options: {
      type: Object
    }
  },
 /* watch: {
    previewStyle(newValue) {
      this.editor.changePreviewStyle(newValue);
    },
    height(newValue) {
      this.editor.height(newValue);
    }
  },*/
  mounted() {
    const options = { ...this.computedOptions, el: this.$refs.toastuiEditor };
    this.editor = new Editor(options);
  },
  methods: {
    /*getRootElement() {
      console.log('sdf');
      return this.$refs.toastuiEditor;
    },*/
  }
}
</script>

<style scoped>

</style>
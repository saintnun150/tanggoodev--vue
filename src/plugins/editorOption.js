const editorEvents = ["load", "change", "stateChange", "focus", "blur"];
const defaultValueMap = {
  initialEditType: "wysiwyg",
  initialValue: "",
  height: "500px",
  previewStyle: "vertical",
  language: "ko-KR"
};

export const optionsMixin = {
  data() {
    const eventOptions = {};
    editorEvents.forEach(event => {
      eventOptions[event] = (...args) => {
        this.$emit(event, ...args);
      };
    });
    const options = {
      ...this.options,
      initialEditType: this.initialEditType,
      initialValue: this.initialValue,
      height: this.height,
      previewStyle: this.previewStyle,
      events: eventOptions,
      language: this.language
    };
    Object.keys(defaultValueMap).forEach(key => {
      if (!options[key]) {
        options[key] = defaultValueMap[key];
      }
    });

    return { editor: null, computedOptions: options };
  },
  methods: {
    invoke(methodName, ...args) {
      let result = null;
      if (this.editor[methodName]) {
        result = this.editor[methodName](...args);
      }

      return result;
    }
  },
  destroyed() {
    editorEvents.forEach(event => {
      this.editor.off(event);
    });
    this.editor.remove();
  }
};

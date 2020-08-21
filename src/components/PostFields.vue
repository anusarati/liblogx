<template>
  <fieldset>
    <label for="Title">Title</label>
    <input id="Title" name="Title" v-model="Title" required>
    <label for="content">Content</label>
    <textarea id="content" name="content" v-model="content" @keydown="interceptTab" required></textarea>
  </fieldset>
</template>

<script>
export default {
  props: {
    editPost: {
      type: Boolean,
      default: false
    },
    id: {
      type: String, // when editing posts
      required: false // props seem to be nullable by default
    },
    initialTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Title: this.initialTitle,
      initialContent: '',
      content: ''
    }
  },
  computed: {
    same() {
      return (this.initialContent == this.content && this.initialTitle == this.Title); // true or false
    }
  },
  methods: {
    async getMDContent(id) {
      let response = await fetch(`/posts/${id}`);
      return response.text();
    },
    interceptTab(event) {
      if (event.key == "Tab") {
        event.preventDefault();
        // based off of code by Taufik Nurrohman https://jsfiddle.net/tovic/2wAzx/
        let { selectionStart, selectionEnd } = event.target;
        if (selectionEnd != selectionStart) {
          // indents lines like a text editor
          try {
            this.content = this.content.substring(0, selectionStart)
            + this.content.substring(selectionStart, selectionEnd).replaceAll(/^.*$/gm, "\t$&")
            + this.content.substring(selectionEnd);
          } catch {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Avoiding_user_agent_detection
            this.content = this.content.substring(0, selectionStart)
            + this.content.substring(selectionStart, selectionEnd).replace(/^.*$/gm, "\t$&")
            + this.content.substring(selectionEnd);
          }
        }
        else {
          this.content = this.content.substring(0, selectionStart) + '\t' + this.content.substring(selectionEnd);
        }
      }
    }
  },
  async mounted() {
    if (this.editPost) {
      // remove \r so sameness check works
      try {
        this.initialContent = await this.getMDContent(this.id).then(mdContent => mdContent.replaceAll(/\r/g, ''));
      } catch {
        this.initialContent = await this.getMDContent(this.id).then(mdContent => mdContent.replace(/\r/g, ''));
      }
      this.content = this.initialContent;
      this.$watch("same", function() {
        this.$emit("toggle");
      });
    }
  }
};
</script>

<style scoped>
fieldset {
  display: grid;
  grid-column: 1 / -1;
}

textarea {
  /* https://developer.mozilla.org/en-US/docs/Web/CSS/resize */
  resize: vertical;
  height: 50vh;
  font-family: "Source Sans Pro", Arial;
  font-size: 2rem;
}

input, textarea {
  box-sizing: border-box;
  width: 100%;
}
</style>

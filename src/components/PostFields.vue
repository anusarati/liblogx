<template>
  <fieldset>
    <label for="Title">Title</label>
    <input id="Title" name="Title" v-model="Title" required>
    <label for="content" v-if="!editPost">Content (you may use markdown)</label>
    <label for="content" v-else>Content</label>
    <textarea id="content" name="content" v-model="content" required></textarea>
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
    }
  },
  async mounted() {
    if (this.editPost) {
      this.initialContent = await this.getMDContent(this.id);
      this.content = this.initialContent;
      this.$watch("same", function() {
        this.$emit("toggle");
      });
    }
  }
};
</script>

<style scoped>
</style>

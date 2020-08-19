<template>
  <div>
    <h2>Create Post</h2>
    <p>You can use markdown and resize the textarea</p>
    <p><a href="https://daringfireball.net/projects/markdown/syntax">Learn about Markdown syntax here</a></p>
    <p>File path for images begins with ../images/</p>
    <form action="/create-post" method="POST">
      <PostFields/>
      <button @click="goBack" type="button">Cancel</button>
      <button type="submit">Post</button>
    </form>
  </div>
</template>

<script>
import PostFields from "./PostFields.vue";

export default {
  components: {
    PostFields
  },
  methods: {
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
form {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

button {
  padding: 10px;
}
</style>

<template>
  <div>
    <h2>Create Post</h2>
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
</style>

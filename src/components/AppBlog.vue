<!-- https://vuejs.org/v2/guide/single-file-components.html -->
<template>
  <main>
    <BlogPost
      v-for="post in posts"
      :key="post._id"
      :post="post"
      :mdFileName="`${post._id}.md`"
    />
  </main>
</template>

<script>
import BlogPost from "./BlogPost.vue";
import { mapState } from "vuex";

export default {
  computed: mapState(["posts"]),
  components: {
    BlogPost
  }
};
</script>

<style scoped>
</style>

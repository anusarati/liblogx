<!-- https://vuejs.org/v2/guide/single-file-components.html -->
<template>
  <main>
    <BlogPost
      v-for="post in blogPosts"
      :key="post._id"
      :Title="post.Title"
      :dateString="post.date"
      :author="post.author"
      :mdFileName="`${post._id}.md`"
    />
  </main>
</template>

<script>
import BlogPost from "./BlogPost.vue";

export default {
  props: {
    blogPosts: Array
  },
  components: {
    BlogPost
  }
}
</script>

<style scoped>
</style>

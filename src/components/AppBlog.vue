<!-- https://vuejs.org/v2/guide/single-file-components.html -->
<template>
  <main v-if="homeOrGuest=='home'">
    <BlogPost
      v-for="post in posts"
      :key="post._id"
      :post="post"
      :mdFileName="`${post._id}.md`"
    />
  </main>
  <main v-else>
    <BlogPost
      v-for="post in guestPosts"
      :key="post._id"
      :post="post"
      :mdFileName="`${post._id}.md`"
    />
  </main>
</template>

<script>
import BlogPost from "./BlogPost.vue";
import { mapState, mapGetters } from "vuex";

export default {
  props: {
    homeOrGuest: {
      type: String,
      default: "home"
    }
  },
  computed: {
    ...mapState(["posts"]),
    ...mapGetters(["guestPosts", "postsByUser"])
  },
  components: {
    BlogPost
  }
};
</script>

<style scoped>
</style>

<!-- https://vuejs.org/v2/guide/single-file-components.html -->
<template>
  <main v-if="homeOrGuest=='home'">
    <BlogPost
      v-for="post in posts"
      :key="post._id"
      :post="post"
      :id="`${post._id}`"
    />
  </main>
  <main v-else>
    <BlogPost
      v-for="post in guestPosts"
      :key="post._id"
      :post="post"
      :id="`${post._id}`"
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
main {
  border-top: 10px solid #dddddd;
  border-bottom: 10px solid #dddddd;
}

article {
  border-bottom: 5px solid #42b983;
  padding: 10px;
}
</style>

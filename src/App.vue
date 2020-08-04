<template>
  <div>
    <h1>Xingzhe Li's Blog</h1>
    <AppNav/>
    <router-view></router-view>
  </div>
</template>

<script>
import AppNav from "./components/AppNav.vue";
import AppBlog from "./components/AppBlog.vue";
import CreatePost from "./components/CreatePost.vue";
import EditPost from "./components/EditPost.vue";

export default {
  props: {
    posts: Array
  },
  components: {
    AppNav,
    AppBlog,
    CreatePost,
    EditPost
  },
  methods: {
    getBlogPosts: async function () {
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      let response = await fetch("/blog-posts");
      return response.json();
    }
  },
  created: async function () {
    let posts = await this.getBlogPosts();
    this.$router.addRoutes([
      { path: "/", component: AppBlog, props: { blogPosts: posts } },
      { path: "/post-creator", component: CreatePost },
      { path: "/post-editor", component: EditPost, props: { blogPosts: posts } }
    ]);
  }
}
</script>

<style>
</style>

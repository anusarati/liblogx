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
import EditMenu from "./components/EditMenu.vue";
import { mapActions } from "vuex";

export default {
  components: {
    AppNav,
    AppBlog,
    CreatePost,
    EditMenu
  },
  methods: {
    ...mapActions(["loadPosts"])
  },
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
  created() {
    //let posts = await this.getBlogPosts();
    this.loadPosts();
    this.$router.addRoutes([
      { path: "/", component: AppBlog },
      { path: "/create", component: CreatePost },

      // { path: "/edit/:id", component: EditPost, props: true },
      {
        path: "/edit",
        component: EditMenu,
        children: [ {
          path: ":id",
          // https://vuejs.org/v2/guide/components-dynamic-async.html#Handling-Loading-State
          component: () => ({
            component: import("./components/EditPost.vue")
          }),
          // https://router.vuejs.org/guide/essentials/passing-props.html
          props: true
        } ]
      }
    ]);
  }
};
</script>

<style>
</style>

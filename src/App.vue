<template>
  <div>
    <h1>Xingzhe Li's Blog</h1>
    <AppNav :vue_scope="vue_scope"/>
    <router-view></router-view>
    <AppFooter/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AppNav from "./components/AppNav.vue";
import AppFooter from "./components/AppFooter.vue";
import AppBlog from "./components/AppBlog.vue";
import CreatePost from "./components/CreatePost.vue";
import EditMenu from "./components/EditMenu.vue";
import RegistrationKeyMenu from "./components/RegistrationKeyMenu.vue";
import UserRegister from "./components/UserRegister.vue";
import UserLogin from "./components/UserLogin.vue";

export default {
  components: {
    AppNav,
    AppFooter,
    AppBlog, // AppBlog: AppBlog,
    CreatePost,
    EditMenu,
    RegistrationKeyMenu,
    UserRegister,
    UserLogin
  },
  data() {
    return {
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining#Description
      ...document.cookie.match(/vue-scope=(?<vue_scope>.*); user=(?<user>.*)/)?.groups
    }
  },
  methods: {
    ...mapActions(["loadPosts"])
  },
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
  created() {
    this.loadPosts();
    this.$router.addRoutes([
      { path: "/", component: AppBlog },
      { path: "/guest", component: AppBlog, props: { homeOrGuest: "guest" } },
      { path: "/create", component: CreatePost },
      {
        path: "/edit",
        component: EditMenu,
        props: { user: this.user },
        children: [{
          path: ":id",
          // https://vuejs.org/v2/guide/components-dynamic-async.html#Handling-Loading-State
          component: () => ({
            component: import("./components/EditPost.vue")
          }),
          props: true
        }]
      },
      { path: "/key-menu", component: RegistrationKeyMenu },
      { path: "/register", component: UserRegister },
      { path: "/login", component: UserLogin }
    ]);
  }
};
</script>

<style>
</style>

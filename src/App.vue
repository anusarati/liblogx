<template>
  <div id="App">
    <h1>{{ $t("heading") }}</h1>
    <p>Thanks to Mozilla for their documentation and Firefox for working</p>
    <AppNav/>
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
import ImageUpload from "./components/ImageUpload.vue";
import EditMenu from "./components/EditMenu.vue";
import RegistrationKeyMenu from "./components/RegistrationKeyMenu.vue";
import UserRegister from "./components/UserRegister.vue";
import UserLogin from "./components/UserLogin.vue";
import LoadingComponent from "./components/LoadingComponent.vue";

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
  methods: {
    ...mapActions(["loadPosts"])
  },
  created() {
    this.loadPosts().then(() => {
      this.$router.addRoutes([{
        path: "/edit",
        component: EditMenu,
        children: [{
          path: ":id",
          // https://vuejs.org/v2/guide/components-dynamic-async.html#Handling-Loading-State
          component: () => ({
            component: import("./components/EditPost.vue"),
            loading: LoadingComponent
          }),
          props: true
        }]
      }]);
    });
    this.$router.addRoutes([
      { path: "/", component: AppBlog },
      { path: "/guest", component: AppBlog, props: { homeOrGuest: "guest" } },
      { path: "/create", component: CreatePost },
      { path: "/upload", component: ImageUpload },
      { path: "/key-menu", component: RegistrationKeyMenu },
      { path: "/register", component: UserRegister },
      { path: "/login", component: UserLogin }
    ]);
    // fetch posts every minute
    window.setInterval(this.loadPosts, 60e3);
  }
};
</script>

<style>
/* https://github.com/vuejs/vuejs.org/tree/master/themes/vue/source/css */
body { font-family: "Source Sans Pro", Arial; }

h1, h2, h3, h4 { color: #273849; }

h1 + p {
  margin-top: -10px;
}

h5, h6 { color: #304455 }

form, input, button { font-size: 1.25rem; }

button {
  background-color: transparent;
  border-color: #42b983;
  color: #304455;
}

button:hover, button:focus {
  color: #42b983;
  border-width: 3px;
}

button:active {
  background-color: #42b983;
  color: white;
}

button:disabled {
  border-color: #4f5959;
  color: #4f5959;
  border-width: 2px;
  background-color: transparent;
}

/* https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Sticky_footers */
#App {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
}
</style>

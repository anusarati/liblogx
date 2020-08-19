import Vue from "vue";
import store from "./store/store.js";
import VueRouter from "vue-router";
import App from "./App.vue";

Vue.use(VueRouter);

let router = new VueRouter({ mode: "history" });

new Vue({
  store,
  router,
  el: "#App",
  template: "<App/>",
  components: { App }
});

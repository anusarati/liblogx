import Vue from "vue";
import store from "./store/store.js";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import App from "./App.vue";

Vue.use(VueRouter);
Vue.use(VueI18n);

let messages = {
  en: {
    heading: "Xingzhe Li's Blog"
  },
  zh: {
    heading: "李幸哲的网志"
  }
};

let router = new VueRouter({ mode: "history" });
let i18n = new VueI18n({
  locale: navigator.language,
  messages
});

new Vue({
  store,
  router,
  i18n,
  el: "#App",
  template: "<App/>",
  components: { App }
});

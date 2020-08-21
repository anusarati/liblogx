// https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// https://vuex.vuejs.org/
export default new Vuex.Store({
  state: {
    posts: [],
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern
    ...Object.fromEntries([...document.cookie.matchAll(/([^\s=]+)=([^;]+);?/g)].map(cookie=>[cookie[1], cookie[2]]))
  },
  getters: {
    getPostByID: (state) => (id) => {
      return state.posts.find(post => post._id == id);
    },
    guestPosts(state) {
      return state.posts.filter(post => post.author != "Xingzhe");
    },
    postsByUser: (state) => (user) => {
      return state.posts.filter(post => post.author == user);
    },
    getFormattedCookieValue: (state) => (name) => {
      try {
        return state[name].replace(/./, (match) => match.toUpperCase()).replaceAll(/_/g, " ");
      } catch {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Avoiding_user_agent_detection
        return state[name].replace(/./, (match) => match.toUpperCase()).replace(/_/g, " ");
      }
    }
  },
  mutations: {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
    setPosts(state, posts) {
      state.posts = posts;
    },
    deletePost(state, id) {
      state.posts.splice(state.posts.findIndex(post => post._id == id), 1);
    },
    eraseAuthError(state) {
      delete state.auth_error;
    }
  },
  actions: {
    loadPosts({ commit }) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      return fetch("/posts")
      .then(response => response.json())
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description
      .then(posts => commit("setPosts", posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))))
      .catch(console.error);
    },
    deletePost({ commit }, id) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      fetch(`/posts/${id}`, { method: "DELETE" })
      .then(() => {commit("deletePost", id)})
      .catch(console.error);
    }
  }
});

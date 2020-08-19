// https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// https://vuex.vuejs.org/
export default new Vuex.Store({
  state: {
    posts: [],
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
    }
  },
  mutations: {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
    setPosts(state, posts) {
      state.posts = posts;
    },
    deletePost(state, id) {
      state.posts.splice(state.posts.findIndex(post => post._id == id), 1);
    }
  },
  actions: {
    loadPosts({ commit }) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      return fetch("/posts")
      .then(response => response.json())
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description
      .then(posts => commit("setPosts", posts.sort((a, b) => b.date - a.date)));
    },
    deletePost({ commit }, id) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      fetch(`/posts/${id}`, { method: "DELETE" })
      .then(() => {commit("deletePost", id)})
      .catch(console.error);
    }
  }
});

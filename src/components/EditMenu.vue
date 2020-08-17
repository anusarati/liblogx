<template>
  <div>
    <h2>Edit</h2>
    <ol v-if="user=='Xingzhe'">
      <li v-for="post in posts" :key="post._id">
        <span>
          <router-link :to="`/edit/${post._id}`">{{ post.Title }}</router-link>, {{ post.author }}
        </span>
        <!-- https://vuejs.org/v2/guide/events.html -->
        <button @click="deletePost(post._id)"><img :src="deleteIcon"></img></button>
      </li>
    </ol>
    <ol v-else>
      <li v-for="post in postsByUser">
        <router-link :to="`/edit/${post._id}`">{{ post.Title }}</router-link>
        <button @click="deletePost(post._id)"><img :src="deleteIcon"></img></button>
      </li>
    </ol>
    <router-view></router-view>
  </div>
</template>

<script>
import deleteIcon from "../delete.svg";
import { mapState, mapActions } from "vuex";

export default {
  props: {
    user: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      deleteIcon
    }
  },
  computed: {
    postsByUser() {
      return this.$store.getters.postsByUser(this.user);
    },
    ...mapState(["posts"]),
  },
  methods: mapActions(["deletePost"])
};
</script>

<style scoped>
</style>

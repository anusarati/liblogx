<template>
  <div>
    <h2>Edit</h2>
    <div v-for="post in posts" :key="post._id">
      <router-link :to="`/edit/${post._id}`">{{ post.Title }}</router-link>
      <!-- https://vuejs.org/v2/guide/events.html -->
      <button @click="deletePost(post._id)"><img :src="deleteIcon"></img></button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import deleteIcon from "../delete.svg";
import { mapState, mapActions } from "vuex";

export default {
  computed: mapState(["posts"]),
  data() {
    return { deleteIcon }
  },
  methods: mapActions(["deletePost"])
};
</script>

<style scoped>
</style>

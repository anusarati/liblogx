<template>
  <div>
    <h2>Edit</h2>
    <div class="left-right">
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
          <button @click="deletePost(post._id)"><img :src="deleteIcon"></button>
        </li>
      </ol>
      <router-view></router-view>
    </div>
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
    };
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
.left-right {
  display: flex;
}

/* https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type */
ol {
  list-style: outside none;
  font-size: 2rem;
}

ol, .edit-view {
  flex: 1;
}

li {
  height: 2rem;
}

li button {
  box-sizing: content-box;
  height: 100%;
  padding: 0px;
  border: none;
  background-color: transparent;
}

li button:hover, li button:focus {
  border-bottom: 2px solid red;
}

li button:active {
  border-top: 2px solid red;
}

img {
  width: 100%;
  height: 100%;
}
</style>

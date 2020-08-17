<template>
  <div>
    <h2>Edit Post</h2>
    <form :action="`/posts/${id}`" method="POST">
      <PostFields :editPost="true" :id="id" :initialTitle="Title" @toggle="toggleSameness"/>
      <button @click="goBack" type="button">Cancel</button>
      <button type="submit" disabled>Save</button>
    </form>
  </div>
</template>

<script>
import PostFields from "./PostFields.vue";

export default {
  props: {
    id: String // from route parameter
  },
  data() {
    return {
      same: true
    }
  },
  computed: {
    Title() {
      return this.$store.getters.getPostByID(this.id).Title;
    },
    disabled() {
      return this.same ? "disabled" : false;
    }
  },
  watch: {
    disabled() {
      if (this.disabled) {
        this.$el.querySelector("button[type='submit']").setAttribute("disabled",'');
      } else {
        this.$el.querySelector("button[type='submit']").removeAttribute("disabled");
      }
    }
  },
  methods: {
    toggleSameness() {
      this.same = !this.same;
    },
    goBack() {
      this.$router.back();
    }
  },
  components: {
    PostFields
  }
};
</script>

<style scoped>
</style>

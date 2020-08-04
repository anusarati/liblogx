<template>
  <div>
    <h2>Edit (test)</h2>
    <div v-for="post in blogPosts" :key="post._id" :Title="post.Title">
      <p>{{ Title }}</p>
      <button><img src="../delete.svg"></img></button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    blogPosts: Array
  }
}
</script>

<style scoped>
</style>

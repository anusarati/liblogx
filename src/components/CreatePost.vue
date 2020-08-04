<template>
  <div>
    <h2>Create Post</h2>
    <form action="/create-post" method="POST">
      <label for="Title">Title</label>
      <input id="Title" name="Title" required>
      <label for="content">Content (you may use markdown)</label>
      <textarea id="content" name="content" required></textarea>
      <button type="submit">Post</button>
    </form>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
</style>

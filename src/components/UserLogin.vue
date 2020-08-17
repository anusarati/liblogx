<template>
  <form action="/login" method="POST">
    <label for="username">Username</label>
    <input id="username" name="username">
    <label for="password">Password</label>
    <input type="password" id="password" name="password">
    <button type="button" @click="goBack">Cancel</button>
    <button type="submit">Login</button>
  </form>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.goBack();
    }
  }
};
</script>

<style scoped>
</style>

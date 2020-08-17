<template>
  <nav>
    <!-- https://router.vuejs.org/api/#exact -->
    <router-link to="/" exact>Home</router-link>
    <router-link to="/guest">Guest</router-link>
    <router-link to="/key-menu" v-if="vue_scope=='Author'">Key Menu</router-link>
    <span v-if="vue_scope">
      <router-link to="/create">Create</router-link>
      <router-link to="/edit">Edit</router-link>
      <a href="/logout">Logout</a>
    </span>
    <span v-else>
      <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
    </span>
  </nav>
</template>

<script>
export default {
  props: {
    vue_scope: {
      type: String,
      required: false
    }
  }
};
</script>

<style scoped>
</style>

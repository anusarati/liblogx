<template>
  <nav>
    <!-- https://router.vuejs.org/api/#exact -->
    <router-link to="/" exact>Home</router-link>
    <router-link to="/guest">Guest</router-link>
    <router-link to="/key-menu" v-if="vue_scope=='Author'">Key Menu</router-link>
    <span v-if="vue_scope" class="loggedIn">
      <router-link to="/create">Create</router-link>
      <router-link to="/edit" id="edit-link">Edit</router-link>
      <router-link to="/upload">Upload Image(s)</router-link>
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
a {
  text-decoration: none;
  font-size: 1.5em;
  color: #304455;
  padding: 10px;
  margin: 5px 0px 5px 20px;
  /* https://css-tricks.com/removing-the-dotted-outline/ */
  outline: 0;
}

/* https://developer.mozilla.org/en-US/docs/Web/CSS/:focus */
a:hover, a:focus {
  color: #4f5959;
  text-decoration: underline #42b983 3px;
}

a:active {
  color: #42b983;
  text-decoration: none;
  border: none;
}

.router-link-exact-active {
  text-decoration: dotted underline #42b983 3px;
}

#edit-link.router-link-active {
  text-decoration: dotted underline #42b983 3px;
}
</style>

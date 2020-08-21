<template>
  <div>
    <ErrorComponent v-if="$store.state.auth_error">{{ $store.getters.getFormattedCookieValue("auth_error") }}</ErrorComponent>
    <form action="/login" method="POST">
      <label for="username">Username</label>
      <input id="username" name="username">
      <label for="password">Password</label>
      <input type="password" id="password" name="password">
      <button type="button" @click="goBack">Cancel</button>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import ErrorComponent from "./ErrorComponent.vue";

export default {
  methods: {
    goBack() {
      this.$router.goBack();
    }
  },
  components: {
    ErrorComponent
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.auth_error) this.$store.commit("eraseAuthError");
    next();
  }
};
</script>

<style scoped>
form {
  /* https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids
  https://css-tricks.com/snippets/css/complete-guide-grid/ */
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  height: 1rem;
  gap: 10px;
}

form, input, button { font-size: 1.25rem; }

button {
  padding: 10px;
}
</style>

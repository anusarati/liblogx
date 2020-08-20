<template>
  <footer>
    <router-link to="/terms">Terms of Use</router-link>
    <router-link to="/privacy-policy">Privacy Policy</router-link>
    <a href="https://github.com/anusarati/liblogx" target="_blank">GitHub repository</a>
  </footer>
</template>

<script>
import TermsOfUse from "./TermsOfUse.vue";
import PrivacyPolicy from "./PrivacyPolicy.vue";

export default {
  components: {
    TermsOfUse,
    PrivacyPolicy
  },
  created() {
    this.$router.addRoutes([
      { path: "/terms", component: TermsOfUse },
      { path: "/privacy-policy", component: PrivacyPolicy }
    ]);
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #304455;
  padding: 10px;
  margin: 10px;
}

a:hover { color: #42b983; }
</style>

<template>
  <footer>
    <router-link to="/terms">Terms of Use</router-link>
    <router-link to="/privacy-policy">Privacy Policy</router-link>
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
</style>

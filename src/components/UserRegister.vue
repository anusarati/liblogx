<template>
  <div>
    <ErrorComponent v-if="$store.state.auth_error">{{ $store.getters.getFormattedCookieValue("auth_error") }}</ErrorComponent>
    <form action="/register" method="POST">
      <label for="username">Username</label>
      <input id="username" name="username">
      <label for="password">Password (do not reuse a password from somewhere else if you're using an HTTP connection)</label>
      <input type="password" id="password" name="password" v-model="password">
      <label for="key">Registration key</label>
      <input id="key" name="key">
      <button type="button" @click="generatePassword" id="generate-password" class="two-col">Generate password (and copy to clipboard)</button>
      <button type="button" @click="goBack" id="cancel">Cancel</button>
      <button type="submit" id="register">Register</button>
      <p v-if="copySuccessful==1" class="two-col center">Copied to clipboard</p>
      <p v-else-if="copySuccessful==-1" class="two-col center">Copy failed</p>
    </form>
  </div>
</template>

<script>
function process(i) {
  i = i.split('').map(char => char.codePointAt(0)).map(i => {
    let b = i;
    while ((i << b) < 0) b--;
    return i << b;
  });

  let repeat;
  do {
    repeat = 0;
    for (let j = 0; j < i.length; j++) {
      let n = i.shift();
      if (n <= 126 && n >= 32) {
        i.push(n);
        continue;
      }

      let b = 2;
      if (n < 32) {
        do {
          n <<= b;
          b++;
        } while (n < 32);
        i.push(n-b, n);
        if (n > 126) repeat = 1;
        continue;
      }
      while (n > 126) {
        n >>= b;
        b++;
      }
      if (n + b > 126 || n < 32) repeat = 1;
      i.push(n, n+b);
    }
  } while (repeat);
  i = i.map(cp => String.fromCodePoint(cp)).join('');
  if (i.length < 8) return process(i);
  return i;
}

import ErrorComponent from "./ErrorComponent.vue";

export default {
  data() {
    return {
      password: '',
      copySuccessful: 0
    }
  },
  methods: {
    async generatePassword() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance
      this.password = process(Date()+JSON.stringify(performance.toJSON()));
      navigator.clipboard.writeText(this.password).then(
        () => { this.copySuccessful = 1; },
        () => {
          this.copySuccessful = -1;
          setTimeout(()=>{ this.copySuccessful = 0; }, 2000);
        }
      );
    },
    goBack() {
      this.$router.back();
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
  grid-template-columns: 1fr 1fr;
  align-items: center;
  height: 1rem;
  gap: 10px;
}

/* form, input, button { font-size: 1.25rem; } */

#generate-password {
  margin: 10px 0px 0px;
}

#cancel, #register {
  padding: 10px;
}

.two-col {
  grid-column: 1 / -1;
}

.center {
  text-align: center;
}
</style>

<template>
  <form action="/register" method="POST">
    <label for="username">Username</label>
    <input id="username" name="username">
    <label for="password">Password</label>
    <input type="password" id="password" name="password" v-model="password">
    <label for="key">Registration key</label>
    <input id="key" name="key">
    <button type="button" @click="generatePassword">Generate password (and copy to clipboard)</button>
    <p v-if="copySuccessful==1">Copied to clipboard</p>
    <p v-else-if="copySuccessful==-1">Copy failed</p>
    <button type="button" @click="goBack">Cancel</button>
    <button type="submit">Register</button>
  </form>
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

export default {
  data() {
    return {
      password: '',
      copySuccessful: 0
    }
  },
  methods: {
    async generatePassword() {
      let i = await fetch("/i").then(response => response.text());
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance
      this.$password = this.$password ? process(this.$password) : process(Date()+JSON.stringify(performance.toJSON()));
      navigator.clipboard.writeText(this.$password).then(
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
  }
};
</script>

<style scoped>
</style>

<template>
  <div>
    <h2>Key Menu</h2>
    <form action="/reg-keys" method="POST" @submit="updateKeyList">
      <label for="key">Content</label>
      <input id="content" name="content" v-model="content">
      <label for="uses">Uses</label>
      <input type="number" id="uses" name="uses" v-model="uses" placeholder="1">
      <button type="button" @click="generate">Generate key</button>
      <button type="submit">Save</button>
    </form>
    <p v-if="saveKeyError">{{ saveKeyError }}</p>
    <p v-for="key in keys" :key="key._id">{{ key.content }}, {{ key.uses }}</p>
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

export default {
  data() {
    return {
      content: '',
      uses: 1,
      keys: [],
      saveKeyError: null
    }
  },
  methods: {
    async generate() {
      let i = await fetch("/i").then(response => response.text());
      this.content = process(i);
    },
    async updateKeyList() {
      this.keys = await fetch("/reg-keys").then(response => response.json());
    }
  },
  async created() {
    this.keys = await fetch("/reg-keys").then(response => response.json()) || [];
  }
}
</script>

<style scoped>
</style>

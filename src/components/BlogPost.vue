<template>
  <article>
    <header>
      <h2>{{ Title }}</h2>
      <time :datetime="date">{{ LocaleString }}</time>
      <p>{{ author }}</p>
      <!--<p>{{ mdFileName }}</p>-->
    </header>
  </article>
</template>

<script>
export default {
  props: {
    Title: String,
    dateString: String,
    author: String,
    mdFileName: String
  },
  computed: {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    LocaleString: function () {
      return (new Date(this.dateString)).toLocaleString();
    },
    date: function () {
      return (new Date(this.dateString)).toISOString();
    }
  },
  created: function () {
    import(`../../posts/${this.mdFileName}`)
    .then((mdHTML) => {
      this.$el.insertAdjacentHTML("beforeend", mdHTML.default
      .replace(/<(\/?)h(\d)>/g, (match, p1, p2) => {
        return `<${p1}h${Math.min(Number(p2)+2, 6)}>`;
      }));
    }).catch(console.log);
  }
}
</script>

<style scoped>
</style>

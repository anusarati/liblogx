<template>
  <article>
    <header>
      <h2>{{ Title }}</h2>
      <p>{{ author }} <time :datetime="date">{{ LocaleString }}</time></p>

      <!-- if edited_on is undefined and webpack uses development mode, this gives a warning
      but this is supposed to not show up when edited_on is supposed to be undefined,
      so it's working as intended besides the warning -->
      <p v-if="edited_on">Edited on <time :datetime="edited_on">{{ EditionLocaleString }}</time></p>
      <!--<p>{{ mdFileName }}</p>-->
    </header>
  </article>
</template>

<script>
export default {
  props: {
    post: Object,
    mdFileName: String
  },
  data() {
    return {
      ...this.post // post object may or may not have edited_on property
    }
  },
  computed: {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    LocaleString() {
      return (new Date(this.date)).toLocaleString();
    },
    EditionLocaleString() {
      return (new Date(this.edited_on)).toLocaleString();
    }
  },
  created() {
    // https://github.com/tc39/proposal-dynamic-import
    import(`../../posts/${this.mdFileName}`)
    .then((mdHTML) => {
      this.$el.insertAdjacentHTML("beforeend", mdHTML.default
      .replace(/<(\/?)h(\d)>/g, (match, p1, p2) => {
        return `<${p1}h${Math.min(Number(p2)+2, 6)}>`;
      }));
    }).catch(console.error);
  }
};
</script>

<style scoped>
</style>

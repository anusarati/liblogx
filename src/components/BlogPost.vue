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
      <button v-if="show=='post'" @click="showMD">Show markdown</button>
      <button v-else @click="showPost">Show post</button>
    </header>
    <div v-html="content"></div>
  </article>
</template>

<script>
export default {
  props: {
    post: Object,
    id: String
  },
  data() {
    return {
      ...this.post, // post object may or may not have edited_on property
      content: '',
      show: "post"
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
  methods: {
    async showMD() {
      try {
        let mdContent = await fetch(`/posts/${this.id}`).then(response => response.text());
        this.content = `<pre class="md"><code>${mdContent}</code></pre>`;
      } catch (e) {
        console.error(e);
        return;
      }
      // https://highlightjs.org/usage/
      // https://github.com/highlightjs/highlight.js/blob/master/LICENSE
      this.$nextTick(function () {
        hljs.highlightBlock(this.$el.querySelector(".md"));
      });
      this.show = "MD";
    },
    showPost() {
      this.content = this.postHTML;
      this.$nextTick(function () {
        document.querySelectorAll("pre code").forEach(codeblock=>hljs.highlightBlock(codeblock));
      });
      this.show = "post";
    }
  },
  created() {
    // https://github.com/tc39/proposal-dynamic-import
    import(`../../posts/${this.id}.md`)
    .then((mdModule) => {
      this.content = this.postHTML = mdModule.default
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
      .replace(/<(\/?)h(\d)>/g, (match, p1, p2) => {
        return `<${p1}h${Math.min(Number(p2)+2, 6)}>`;
      });
    })
    .then(() => {
      document.querySelectorAll("pre code").forEach(codeblock=>hljs.highlightBlock(codeblock));
    }).catch(console.error);
  }
};
</script>

<style scoped>
header {
  color: #4f5959;
  /* https://developer.mozilla.org/en-US/docs/Web/CSS/border-style */
  border-bottom: 3px double #304455;
}

button {
  font-size: 1rem;
  margin-bottom: 5px;
  border-bottom-width: 1px;
}

button, button:hover, button:focus, button:active {
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
}

button:hover, button:focus, button:active {
  border-bottom-style: double;
}
</style>

<style>
article img {
  /* https://css-tricks.com/centering-css-complete-guide/#horizontal-block */
  display: block;
  margin: 0 auto;
  max-width: 1000px;
  max-height: 1000px;
}

pre {
  /* https://developer.mozilla.org/en-US/docs/Web/CSS/white-space */
  white-space: pre-wrap;
}
</style>

<template>
  <img :href="lx" id="lx">
</template>

<script>
import lx from "../lx.png";

export default {
  data() {
    return { lx };
  }
};
</script>

<style scoped>
#lx {
  animation: loading 8s 1;
}

@keyframes loading {
  from { transform: skewX(0deg) skewY(0deg) scale(1) rotate(0deg); }
  25% { transform: skewX(90deg) skewY(90deg) scale(0) rotate(180deg); }
  50% { transform: skewX(0deg) skewY(0deg) scale(1) rotate(0deg); }
  75% { transform: skewX(-90deg) skewY(-90deg) scale(0) rotate(-180deg); }
  to { transform: skewX(0deg) skewY(0deg) scale(1) rotate(0deg); }
}
</style>

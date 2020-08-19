<template>
  <form method="POST" enctype="multipart/form-data">
    <label>Upload Image(s) (10 MB at a time)</label>
    <!-- https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types -->
    <input type="file" name="img" required accept="image/png, image/jpeg, image/apng, image/x-icon, image/svg+xml, image/webp" multiple>
    <button type="submit">Upload</button>
  </form>
</template>

<script>
export default {

};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>

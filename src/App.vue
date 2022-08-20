<script setup>

</script>

<template>
  <div class="my-div-app"></div>
  <RouterView/>
</template>

<style scoped>
div .my-div-app {
  height: 100%;
  width: 100%;
  position: fixed;
  background-image: url("./assets/BackgroundPicture.jpg");
  background-size: 100% 100%;
  overflow: auto;
  background-attachment: fixed;
  z-index: -2;
  filter: brightness(0.65) saturate(1.25);
}
</style>

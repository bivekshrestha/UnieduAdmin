<template>

  <v-app light>

    <v-main class="grey lighten-5 pa-0">
      <v-container class="fill-height">
        <nuxt/>
      </v-container>
    </v-main>

    <Footer/>

  </v-app>

</template>

<script>
  import Footer from "../components/partials/Footer";

  export default {
    components: {Footer},
  }
</script>

<style>
  .main-container {
    min-height: 100vh;
  }
</style>

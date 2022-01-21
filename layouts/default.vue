<template>

  <v-app light>

    <Navigation />

    <v-main class="grey lighten-5">
      <v-container class="px-10" fluid>
        <nuxt/>
      </v-container>
    </v-main>

    <v-scale-transition>
      <v-btn
        fab
        v-show="fab"
        v-scroll="onScroll"
        dark
        fixed
        bottom
        right
        color="primary"
        @click="toTop"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-scale-transition>

    <Footer/>

  </v-app>

</template>

<script>
  import Navigation from "../components/partials/Navigation";
  import Footer from "../components/partials/Footer";

  export default {
    components: {Footer, Navigation},
    data() {
      return {
        fab: null,
        color: 'primary',
        flat: null,
      }
    },
    watch: {
      fab(value) {
        if (value) {
          this.color = 'primary';
          this.flat = false
        } else {
          this.color = 'transparent';
          this.flat = true
        }
      },
    },

    methods: {
      onScroll(e) {
        if (process.client) {
          if (typeof window === 'undefined') {
            return
          }
          const top = window.pageYOffset || e.target.scrollTop || 0
          this.fab = top > 60
        }
      },
      toTop() {
        this.$vuetify.goTo(0)
      },
    }
  }
</script>

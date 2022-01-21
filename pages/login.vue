<template>

  <v-row
    justify="center"
    align="center"
  >
    <v-col
      cols="12"
      md="4"
    >

      <v-card class="elevation-12">
        <v-toolbar
          color="indigo darken-4"
          dark
          flat
        >
          <v-toolbar-title>Uniedu.io - Admin Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <ValidationObserver ref="observer" v-slot="{ validate, reset }">
            <form>
              <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
                <v-text-field
                  prepend-icon="mdi-account"
                  v-model="email"
                  :error-messages="errors"
                  label="E-mail"
                  required
                ></v-text-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" name="Password" rules="required|min:6">
                <v-text-field
                  prepend-icon="mdi-key"
                  type="password"
                  v-model="password"
                  :error-messages="errors"
                  label="Password"
                  required
                ></v-text-field>
              </ValidationProvider>

              <div class="red--text" v-if="error">
                {{error}}
              </div>

              <div class="text-right">
                <v-btn
                  :loading="loading"
                  color="indigo darken-4 white--text"
                  @click="login">
                  Login
                </v-btn>
              </div>
            </form>
          </ValidationObserver>
        </v-card-text>
      </v-card>

    </v-col>
  </v-row>

</template>

<script>
  export default {
    layout: 'auth',
    data() {
      return {
        email: '',
        password: '',
        loading: false,
        error: null
      }
    },
    methods: {
      async login() {
        if (this.$refs.observer.validate()) {
          this.loading = true;
          this.error = null;
          await this.$auth.loginWith('laravelSanctum', {
            data: {
              email: this.email,
              password: this.password
            }
          })
            .then(response => {
              this.$router.push({name: 'index'})
            })
            .catch(errors => {
              this.loading = false;
              this.error = errors.response.data.error
            });
        }
      }
    }
  }
</script>

<style scoped>

</style>

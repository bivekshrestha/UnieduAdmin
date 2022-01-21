<template>
  <v-container fluid>
    <v-snackbar
      top
      timeout="5000"
      right
      dark
      color="blue-grey darken-4"
      v-model="snackbar"
    >
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          class="white--text"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-row justify="space-between">

      <v-col cols="12" lg="6">
        <ValidationObserver ref="observer" v-slot="{ validate, reset, handleSubmit }">
          <v-card>
            <v-card-title>
              <span class="headline">
                Change Password
              </span>
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <form>
                  <v-row>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" name="Old Password" rules="required" vid="oldPassword">
                        <v-text-field
                          :type="type.old"
                          :error-messages="errors"
                          label="Old Password*"
                          v-model="password.old"
                          required
                        >
                          <v-btn icon slot="append" @click="displayPassword('old')">
                            <v-icon>
                              mdi-eye
                            </v-icon>
                          </v-btn>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12">
                      <ValidationProvider
                        v-slot="{ errors }"
                        name="New Password"
                        :rules="{required: true, is_not:password.old}"
                        vid="newPassword"
                      >
                        <v-text-field
                          :type="type.new"
                          :error-messages="errors"
                          label="New Password*"
                          v-model="password.new"
                          required
                        >
                          <v-btn icon slot="append" @click="displayPassword('new')">
                            <v-icon>
                              mdi-eye
                            </v-icon>
                          </v-btn>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12">
                      <ValidationProvider
                        v-slot="{ errors }"
                        name="Password Confirmation"
                        rules="required|confirmed:newPassword"
                        vid="confirmation"
                      >
                        <v-text-field
                          :type="type.new"
                          :error-messages="errors"
                          label="Confirm New Password*"
                          v-model="password.confirmation"
                          required
                        >
                          <v-btn icon slot="append" @click="displayPassword('new')">
                            <v-icon>
                              mdi-eye
                            </v-icon>
                          </v-btn>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                  </v-row>
                </form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="handleSubmit(update)">Change</v-btn>
            </v-card-actions>
          </v-card>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        snackbar: false,
        snackbarMessage: '',
        type: {
          old: 'password',
          new: 'password'
        },
        password: {
          id: this.$auth.user.id,
          old: '',
          new: '',
          confirmation: ''
        }
      }
    },
    methods: {
      displayPassword(item) {
        if (this.type[item] === 'text') {
          this.type[item] = 'password'
        } else {
          this.type[item] = 'text'
        }
      },
      update() {
        this.$refs.observer.validate()
          .then(() => {
            this.$axios.put(`/profile/change-password`, this.password)
              .then(res => {
                this.password = {
                  id: this.$auth.user.id,
                  old: '',
                  new: '',
                  confirmation: ''
                };
                this.$refs.observer.reset();
                this.showSnackBar('Password Changed Successfully');
              })
              .catch(error => {
                let validationErrors = {
                  oldPassword: [error.response.data.errors],
                };

                this.$refs.observer.setErrors(validationErrors);

                this.showSnackBar('Error, Please try again');
              })
          })


      },
      showSnackBar(message) {
        this.snackbar = true;
        this.snackbarMessage = message;
      }
    }
  }
</script>

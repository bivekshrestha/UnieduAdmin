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

      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title class="justify-center text-center">
            <v-avatar
              v-if="user.image && user.image.path"
              size="150"
            >
              <img
                :src="setSrc(user.image.path)"
                alt="Profile Picture"
              >
              <v-overlay
                opacity="0.4"
                absolute
                class="align-end"
              >
                <v-btn icon @click="openImageDialog">
                  <v-icon>mdi-camera</v-icon>
                </v-btn>
              </v-overlay>
            </v-avatar>

            <v-avatar
              v-else
              size="150"
              color="grey white--text">
              {{user.first_name.substr(0,1)}}{{user.last_name.substr(0,1)}}
              <v-overlay
                opacity="0"
                absolute
                class="align-end"
              >
                <v-btn icon @click="imageUploadDialog = true">
                  <v-icon>mdi-camera</v-icon>
                </v-btn>
              </v-overlay>
            </v-avatar>
          </v-card-title>
          <v-card-text class="text-center">
            <h2 class="font-weight-medium my-2">{{user.admin.position}}</h2>
            <h1 class="my-2 font-weight-black ">{{user.first_name}} {{user.last_name}}</h1>
            <h2 class="font-weight-regular my-2">{{user.email}}</h2>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="8" class="h-100">
        <v-card>
          <v-card-title>
              <span class="headline">
                Edit Profile
              </span>
          </v-card-title>
          <v-card-text>
            <v-container fluid>
              <ValidationObserver ref="observer" v-slot="{ validate, reset }">
                <form>
                  <v-row>
                    <v-col cols="12" md="6">
                      <ValidationProvider v-slot="{ errors }" name="First Name" rules="required">
                        <v-text-field
                          :error-messages="errors"
                          label="First Name*"
                          v-model="user.first_name"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="6">
                      <ValidationProvider v-slot="{ errors }" name="Last Name" rules="required">
                        <v-text-field
                          :error-messages="errors"
                          label="Last Name*"
                          v-model="user.last_name"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" name="Position" rules="required">
                        <v-text-field
                          :error-messages="errors"
                          label="Position*"
                          v-model="user.admin.position"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="6">
                      <ValidationProvider v-slot="{ errors }" name="Country" rules="required">
                        <v-select
                          :error-messages="errors"
                          :items="countries"
                          label="Country*"
                          v-model="user.admin.country"
                          required
                        ></v-select>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="6">
                      <ValidationProvider v-slot="{ errors }" name="City" rules="required">
                        <v-text-field
                          :error-messages="errors"
                          label="City*"
                          v-model="user.admin.city"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="6">
                      <ValidationProvider v-slot="{ errors }" name="Primary Address" rules="required">
                        <v-text-field
                          :error-messages="errors"
                          label="Primary Address*"
                          v-model="user.admin.primary_address"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="6">
                      <ValidationProvider v-slot="{ errors }" name="Secondary Address" rules="">
                        <v-text-field
                          :error-messages="errors"
                          label="Secondary Address"
                          v-model="user.admin.secondary_address"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="6">
                      <ValidationProvider v-slot="{ errors }" name="Primary Number" rules="required">
                        <v-text-field
                          :error-messages="errors"
                          label="Primary Number*"
                          v-model="user.admin.primary_number"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="6">
                      <ValidationProvider v-slot="{ errors }" name="Secondary Number" rules="">
                        <v-text-field
                          :error-messages="errors"
                          label="Secondary Number"
                          v-model="user.admin.secondary_number"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>

                  </v-row>
                </form>
              </ValidationObserver>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="update">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-dialog v-model="imageUploadDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
              <span class="headline">
               Upload Profile Picture
              </span>
          </v-card-title>
          <v-card-text>
            <v-container fluid>
              <ValidationObserver ref="imageObserver" v-slot="{ validate, reset }">
                <form>
                  <v-row>
                    <v-col cols="12" v-if="!newImage" class="text-center">
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-avatar
                            size="150">
                            <img v-if="user.image" :src="setSrc(user.image.path)" alt="Profile picture">
                          </v-avatar>
                        </v-col>

                        <v-col cols="12" md="8" class="align-center d-flex">
                          <v-btn
                            color="indigo darken-4"
                            dark
                            @click="newImage = true"
                          >
                            Change Picture
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" v-else>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-avatar
                            color="grey white--text"
                            size="150">
                        <span v-if="!preview">
                            Preview
                        </span>
                            <img v-else :src="preview" alt="Uploaded picture">
                          </v-avatar>
                        </v-col>
                        <v-col cols="12" md="8" class="align-center d-flex">
                          <div class="w-100">
                            <ValidationProvider v-slot="{ errors }" name="Image" rules="required">
                              <v-file-input
                                @change="previewImage"
                                v-model="image"
                                accept="image/png, image/jpeg, image/bmp"
                                placeholder="Pick an image"
                                prepend-icon="mdi-camera"
                                label="Choose profile picture"
                              ></v-file-input>
                            </ValidationProvider>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </form>
              </ValidationObserver>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Close</v-btn>
            <v-btn color="blue darken-1" text @click="changeProfilePicture">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        imageUploadDialog: false,
        snackbar: false,
        newImage: true,
        user: {
          first_name: '',
          last_name: '',
          email: '',
          admin: {
            country: '',
            city: '',
            position: '',
            primary_number: '',
            secondary_number: '',
            primary_address: '',
            secondary_address: '',
          },
          image: {}
        },
        image: null,
        snackbarMessage: '',
        preview: '',
        countries: []
      }
    },
    async fetch() {
      this.countries = await this.$axios.get('/country/label').then(res => res.data.data);
      this.user = await this.$axios.get(`/profile/` + this.$auth.user.id).then(res => res.data.data);
    },
    methods: {
      setSrc(path) {
        return process.env.baseURL + '/' + path;
      },
      previewImage() {
        this.preview = URL.createObjectURL(this.image)
      },
      openImageDialog() {
        this.newImage = false;
        this.image = this.user.image;
        this.imageUploadDialog = true;
      },
      close() {
        this.imageUploadDialog = false;
        this.$refs.imageObserver.reset();
        this.newImage = false;
        this.preview = '';
        this.image = null;
      },
      async update() {
        if (this.$refs.observer.validate()) {
          await this.$axios.put(`/profile/update`, this.user)
            .then(res => {
              this.$fetch();
              this.showSnackBar('User Details Updated');
            })
            .catch(error => {

            })
        }
      },
      async changeProfilePicture() {

        let data = new FormData();
        data.append('_method', 'PUT');
        data.append('id', this.user.id);
        data.append('image', this.image);

        await this.$axios.post(`profile/image`, data, {
          headers: {
            'Content-Type': "multipart/form-data"
          }
        })
          .then(response => {
            this.$fetch();
            this.close('combo');
            this.showSnackBar('Profile Picture Updated');
          })
          .catch(errors => {
            this.showSnackBar('Validation Error Found');
          });
      },
      showSnackBar(message) {
        this.snackbar = true;
        this.snackbarMessage = message;
      }
    }
  }
</script>

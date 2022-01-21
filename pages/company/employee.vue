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
      <v-col cols="12" md="6" lg="4">
        <h2>{{title}} List</h2>
      </v-col>

      <v-col cols="12" md="6" lg="4" class="text-right">
        <v-dialog v-model="showAddEditDialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="indigo darken-4"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Add New {{title}}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">
                <span v-if="isEditing">Edit</span>
                <span v-else>Add</span>
                {{title}}
              </span>
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <ValidationObserver ref="observer" v-slot="{ validate, reset }">
                  <form>
                    <v-row>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="First Name" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="First Name*"
                            v-model="form.first_name"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Last Name" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Last Name*"
                            v-model="form.last_name"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Position" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Position*"
                            v-model="form.position"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Country" rules="required">
                          <v-select
                            :error-messages="errors"
                            :items="countries"
                            label="Country"
                            v-model="form.country"
                            required
                          ></v-select>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Phone Number" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Phone Number*"
                            v-model="form.phone"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Email Address" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Email Address*"
                            v-model="form.email"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Address" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Address*"
                            v-model="form.address"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Status" rules="required">
                          <v-switch
                            v-model="form.show"
                            label="Active"
                          ></v-switch>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12" v-if="newFile">
                        <ValidationProvider v-slot="{ errors }" name="Image" rules="required">
                          <v-file-input
                            @change="previewImage"
                            v-model="form.image"
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Pick an image"
                            prepend-icon="mdi-camera"
                            label="Image"
                          ></v-file-input>
                        </ValidationProvider>
                        <v-img width="50%" :src="preview"></v-img>
                      </v-col>

                      <v-col cols="12" v-else>
                        <v-btn
                          color="indigo darken-4"
                          dark
                          @click="newFile = true"
                        >
                          Change Image
                        </v-btn>
                        <v-img width="50%" :src="setSrc(form.image.path)"></v-img>
                      </v-col>
                    </v-row>
                  </form>
                </ValidationObserver>
              </v-container>
              <span>*indicates required field</span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close('combo')">Close</v-btn>
              <v-btn color="blue darken-1" text @click="saveItem">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="12" lg="12">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="items"
          item-key="name"
          show-select
          fixed-header
          class="elevation-1"
          :search="search"
          :footer-props="{
                itemsPerPageOptions: [25, 50, 100]
              }"
        >
          <template v-slot:top>
            <v-card-title>
              {{title}}
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
          </template>

          <template v-slot:item.avatar.path="{ item }">
            <div class="p-3">
              <v-img
                class="p-3"
                width="250"
                height="150"
                :src="setSrc(item.avatar.path)"
              ></v-img>
            </div>
          </template>

          <template v-slot:item.show="{ item }">
            <v-chip
              v-if="item.show"
              color="green accent-4"
              dark
            >
              Shown
            </v-chip>

            <v-chip
              v-else
              color="red accent-2"
              dark
            >
              Hidden
            </v-chip>
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn
              icon
              color="green accent-4"
              @click="openView(item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              icon
              color="primary accent-2"
              @click="editItem(item)"
            >
              <v-icon>mdi-circle-edit-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              color="red accent-2"
              @click="deleteItem(item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- View Dialog Box -->
    <v-dialog v-model="showViewDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{title}} View</span>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close('view')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row v-for="(value, key, index) in single" :key="index">
              <v-col cols="4">{{key}}</v-col>
              <v-col cols="8">{{value}}</v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Employee',
        api: '/employee',
        search: '',
        snackbarMessage: '',
        showAddEditDialog: false,
        showViewDialog: false,
        isEditing: false,
        snackbar: false,
        selected: [],
        items: [],
        headers: [
          {text: 'Avatar', align: 'start', value: 'avatar.path'},
          {text: 'First Name', align: 'start', value: 'first_name'},
          {text: 'Last Name', align: 'start', value: 'last_name'},
          {text: 'Position', align: 'start', value: 'position'},
          {text: 'Country', align: 'start', value: 'country'},
          {text: 'Status', align: 'start', value: 'show'},
          {text: 'Actions', value: 'action', sortable: false, align: 'end'},
        ],
        form: {
          first_name: '',
          last_name: '',
          position: '',
          country: '',
          phone: '',
          email: '',
          address: '',
          image: null,
          show: false
        },
        single: {},
        preview: '',
        newFile: true,
        countries: []
      }
    },
    async fetch() {
      this.countries = await this.$axios.get('/country/label').then(res => res.data.data);
      this.items = await this.$axios.get(`${this.api}`).then(res => res.data.data);
    },
    methods: {
      setSrc(path) {
        return process.env.baseURL + '/' + path;
      },
      previewImage() {
        if (this.form.image) {
          this.preview = URL.createObjectURL(this.form.image)
        } else {
          this.preview = ''
        }
      },
      openView(item) {
        this.single = item;
        this.showViewDialog = true;
      },
      close(dialog) {
        if (dialog !== 'view') {
          this.newFile = true;
          this.showAddEditDialog = false;
          this.isEditing = false;
          this.preview = '';
          this.form = {
            first_name: '',
            last_name: '',
            position: '',
            country: '',
            phone: '',
            email: '',
            address: '',
            image: null,
            show: false
          };
          this.$refs.observer.reset();
        }

        this.showViewDialog = false;
        this.single = {}
      },
      editItem(item) {
        this.newFile = false;
        this.isEditing = true;
        this.form = item;
        this.showAddEditDialog = true;
      },
      saveItem() {
        if (this.$refs.observer.validate()) {
          this.loading = true;
          this.error = null;

          if (this.form.show) {
            this.form.show = 1
          } else {
            this.form.show = 0
          }

          let data = new FormData();
          for (let key in this.form) {
            data.append(key, this.form[key])
          }

          if (this.isEditing) {
            data.append('_method', 'PUT');
            this.updateItem(data);
          } else {
            this.storeItem(data);
          }
        }
      },
      async storeItem(data) {
        await this.$axios.post(`${this.api}/store`, data, {
          headers: {
            'Content-Type': "multipart/form-data"
          }
        })
          .then(response => {
            this.$fetch();
            this.close('combo');
            this.showSnackBar('Item Created Successfully');
          })
          .catch(errors => {
            this.showSnackBar('Validation Error Found');
          });
      },
      async updateItem(data) {
        await this.$axios.post(`${this.api}/update`, data, {
          headers: {
            'Content-Type': "multipart/form-data"
          }
        })
          .then(response => {
            this.$fetch();
            this.close('combo');
            this.showSnackBar('Item Updated Successfully');
          })
          .catch(errors => {
            this.showSnackBar('Validation Error Found');
          });
      },
      async deleteItem(id) {
        if (confirm('You made a delete request, Are you sure?')) {
          await this.$axios.delete(`${this.api}/delete/` + id)
            .then(response => {
              this.$fetch();
              this.showSnackBar('Item Removed Successfully');
            })
            .catch(errors => {
            });
        }
      },
      showSnackBar(message) {
        this.snackbar = true;
        this.snackbarMessage = message;
      }
    }
  }
</script>

<style scoped>

</style>

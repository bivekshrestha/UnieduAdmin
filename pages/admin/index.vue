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
                        <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
                          <v-text-field
                            :error-messages="errors"
                            label="Email*"
                            v-model="form.email"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Admin Roles" rules="required">
                          <v-select
                            v-model="form.roles"
                            :items="roles"
                            label="Admin Roles*"
                            multiple
                            chips
                            persistent-hint
                          ></v-select>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Country" rules="required">
                          <v-select
                            :error-messages="errors"
                            :items="countries"
                            label="Country*"
                            v-model="form.country"
                            required
                          ></v-select>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Position" rules="">
                          <v-text-field
                            :error-messages="errors"
                            label="Position"
                            v-model="form.position"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="City" rules="">
                          <v-text-field
                            :error-messages="errors"
                            label="City"
                            v-model="form.city"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Primary Address" rules="">
                          <v-text-field
                            :error-messages="errors"
                            label="Primary Address"
                            v-model="form.primary_address"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Secondary Address" rules="">
                          <v-text-field
                            :error-messages="errors"
                            label="Secondary Address"
                            v-model="form.secondary_address"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Primary Number" rules="">
                          <v-text-field
                            :error-messages="errors"
                            label="Primary Number"
                            v-model="form.primary_number"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Secondary Number" rules="">
                          <v-text-field
                            :error-messages="errors"
                            label="Secondary Number"
                            v-model="form.secondary_number"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Status" rules="required">
                          <v-switch
                            v-model="form.is_active"
                            label="Active"
                          ></v-switch>
                        </ValidationProvider>
                      </v-col>

                    </v-row>
                  </form>
                </ValidationObserver>
              </v-container>
              <span>*indicates required field</span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Close</v-btn>
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

          <template v-slot:item.user.roles="{ item }">
            <template v-for="role in roles">
              <v-chip class="mr-2" v-if="item.user.roles.includes(role.value)">
                {{role.text}}
              </v-chip>
            </template>
          </template>

          <template v-slot:item.user.is_active="{ item }">
            <v-chip
              v-if="item.user.is_active"
              color="green accent-4"
              dark
            >
              Active
            </v-chip>

            <v-chip
              v-else
              color="red accent-2"
              dark
            >
              Inactive
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
              @click="deleteItem(item.user_id)"
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
          <v-btn color="blue darken-1" text @click="close">
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
        title: 'Admin',
        api: '',
        search: '',
        snackbarMessage: '',
        showAddEditDialog: false,
        showViewDialog: false,
        isEditing: false,
        snackbar: false,
        selected: [],
        items: [],
        headers: [
          {text: 'First Name', align: 'start', value: 'user.first_name'},
          {text: 'Last Name', align: 'start', value: 'user.last_name'},
          {text: 'Email', align: 'start', value: 'user.email'},
          {text: 'Country', align: 'start', value: 'country'},
          {text: 'Role', align: 'start', value: 'user.roles'},
          {text: 'Status', align: 'start', value: 'user.is_active'},
          {text: 'Actions', value: 'action', sortable: false, align: 'end'},
        ],
        form: {
          first_name: '',
          last_name: '',
          country: '',
          city: '',
          roles: '',
          position: '',
          email: '',
          primary_number: '',
          secondary_number: '',
          primary_address: '',
          secondary_address: '',
          is_active: false
        },
        single: {},
        roles: [],
        countries: [],
      }
    },
    async fetch() {
      this.roles = await this.$axios.get(`/role/select`).then(res => res.data.data);
      this.countries = await this.$axios.get(`/country/label`).then(res => res.data.data);
      this.items = await this.$axios.get(`/`).then(res => res.data.data);
    },
    methods: {
      openView(item) {
        this.single = item;
        this.showViewDialog = true;
      },
      close() {
        this.showAddEditDialog = false;
        this.showViewDialog = false;
        this.isEditing = false;
        this.form = {
          first_name: '',
          last_name: '',
          country: '',
          city: '',
          roles: '',
          position: '',
          email: '',
          primary_number: '',
          secondary_number: '',
          primary_address: '',
          secondary_address: '',
          is_active: false
        };
        this.single = {}
      },
      editItem(item) {
        this.isEditing = true;
        this.form = item;
        this.form.first_name = item.user.first_name;
        this.form.last_name = item.user.last_name;
        this.form.email = item.user.email;
        this.form.is_active = item.user.is_active;
        this.form.roles = item.user.roles;
        this.showAddEditDialog = true;
      },
      saveItem() {
        if (this.$refs.observer.validate()) {
          this.loading = true;
          this.error = null;

          if (this.isEditing) {
            this.updateItem();
          } else {
            this.storeItem();
          }
        }
      },
      async storeItem() {
        await this.$axios.post(`/store`, this.form)
          .then(response => {
            this.$fetch();
            this.$refs.observer.reset();
            this.close();
            this.showSnackBar('Item Created Successfully');
          })
          .catch(errors => {
            this.showSnackBar('Validation Error Found');
          });
      },
      async updateItem() {
        await this.$axios.put(`/update`, this.form)
          .then(response => {
            this.$fetch();
            this.$refs.observer.reset();
            this.close();
            this.showSnackBar('Item Updated Successfully');
          })
          .catch(errors => {
            this.showSnackBar('Validation Error Found');
          });
      },
      async deleteItem(id) {
        if (confirm('You made a delete request, Are you sure?')) {
          await this.$axios.delete(`/delete/` + id)
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

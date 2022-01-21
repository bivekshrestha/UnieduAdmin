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
                        <ValidationProvider v-slot="{ errors }" name="Title" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Title*"
                            v-model="form.title"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Status" rules="required">
                          <v-switch
                            v-model="form.status"
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

          <template v-slot:item.status="{ item }">
            <v-chip
              v-if="item.status"
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
        title: 'Enquiry',
        api: '/enquiry',
        search: '',
        snackbarMessage: '',
        showAddEditDialog: false,
        showViewDialog: false,
        linkCountriesDialog: false,
        isEditing: false,
        snackbar: false,
        selected: [],
        items: [],
        headers: [
          {text: 'Title', align: 'start', value: 'title'},
          {text: 'Status', align: 'start', value: 'status'},
          {text: 'Actions', value: 'action', sortable: false, align: 'end'},
        ],
        form: {
          title: '',
          status: false
        },
        single: {}
      }
    },
    async fetch() {
      this.items = await this.$axios.get(`${this.api}`).then(res => res.data.data);
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
          title: '',
          status: false
        };
        this.single = {}
      },
      editItem(item) {
        this.isEditing = true;
        this.form = item;
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
        await this.$axios.post(`${this.api}/store`, this.form)
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
        await this.$axios.put(`${this.api}/update`, this.form)
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

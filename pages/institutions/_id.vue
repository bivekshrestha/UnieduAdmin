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
                        <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Name*"
                            v-model="form.name"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Level" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Level*"
                            v-model="form.level"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Subject" rules="required">
                          <v-select
                            :error-messages="errors"
                            :items="subjects"
                            label="Subject"
                            v-model="form.subject_id"
                            required
                          ></v-select>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Intakes" rules="required">
                          <v-select
                            v-model="form.intakes"
                            :items="intakes"
                            label="Intakes"
                            multiple
                            chips
                            persistent-hint
                          ></v-select>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Duration" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Duration*"
                            v-model="form.duration"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Fee" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Fee*"
                            v-model="form.fee"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Location" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Location*"
                            v-model="form.location"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Requirements" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Requirements"
                            v-model="form.requirements"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="URL Link" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="URL Link"
                            v-model="form.url"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Details" rules="required">
                          <v-textarea
                            :error-messages="errors"
                            label="Details"
                            v-model="form.details"
                            required
                          ></v-textarea>
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
        <v-dialog v-model="uploadDialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="indigo darken-4"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Upload {{title}} File
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">
                Add {{title}} File
              </span>
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <ValidationObserver ref="fileObserver" v-slot="{ validate, reset }">
                  <form>
                    <v-row>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="File" rules="required">
                          <v-file-input
                            v-model="fileToUpload"
                            placeholder="Pick one file"
                            prepend-icon="mdi-file"
                            label="File"
                          ></v-file-input>
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
              <v-btn color="blue darken-1" text @click="closeUploadDialog">Close</v-btn>
              <v-btn color="blue darken-1" text @click="uploadFile">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h2>
          {{institution.name}}
          <em><small>{{institution.address}}, {{institution.country}}</small></em>
        </h2>
        <h3>Identifier: {{institution.identifier}}</h3>
        <h3>
          Route:
          <span v-if="institution.route === 'both'">
              Pathway and Direct
          </span>
          <span v-else>{{institution.route}}</span>
        </h3>
        <h3>Email: {{institution.email}}</h3>
        <h3>Cities: {{institution.cities}}</h3>
        <h3>Contact: {{institution.contact}}</h3>
        <h3>Website Link: {{institution.url}}</h3>
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
        title: 'Program',
        api: '/program',
        search: '',
        snackbarMessage: '',
        showAddEditDialog: false,
        showViewDialog: false,
        isEditing: false,
        snackbar: false,
        selected: [],
        items: [],
        headers: [
          {text: 'Program', align: 'start', value: 'name'},
          {text: 'Level', align: 'start', value: 'level'},
          {text: 'Subject', align: 'start', value: 'subject.name'},
          {text: 'Duration', align: 'start', value: 'duration'},
          {text: 'Location', align: 'start', value: 'location'},
          {text: 'Fee', align: 'start', value: 'fee'},
          {text: 'Actions', value: 'action', sortable: false, align: 'end'},
        ],
        form: {
          institution_id: this.$route.params.id,
          name: '',
          level: '',
          duration: '',
          fee: '',
          location: '',
          url: '',
          details: '',
          subject_id: '',
          requirements: '',
          intakes: []
        },
        single: {},
        fileToUpload: '',
        uploadDialog: false,
        institution: {},
        subjects: [],
        intakes: [],
      }
    },
    async fetch() {
      this.institution = await this.$axios.get(`/institution/get/` + this.$route.params.id).then(res => res.data.data);
      this.subjects = await this.$axios.get(`/subject/select`).then(res => res.data.data);
      this.intakes = await this.$axios.get(`/intake/select`).then(res => res.data.data);
      this.items = await this.$axios.get(`${this.api}/get/` + this.$route.params.id).then(res => res.data.data);
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
          institution_id: this.$route.params.id,
          name: '',
          level: '',
          duration: '',
          fee: '',
          location: '',
          url: '',
          details: '',
          requirements: '',
          intakes: []
        };
        this.single = {}
      },
      closeUploadDialog() {
        this.uploadDialog = false;
        this.fileToUpload = null;
        this.$refs.fileObserver.reset();
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
      async uploadFile() {
        let data = new FormData();

        data.append('institution_id', this.$route.params.id);
        data.append('programs', this.fileToUpload);

        await this.$axios.post(`${this.api}/file`, data, {
          headers: {
            'Content-Type': "multipart/form-data"
          }
        })
          .then(response => {
            this.$fetch();
            this.closeUploadDialog();
            this.showSnackBar('File Uploaded Successfully');
          })
          .catch(errors => {
            this.showSnackBar('Error uploading, Try Again.');
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

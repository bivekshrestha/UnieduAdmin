<template>
  <v-container fluid>
    <v-row justify="space-between">
      <v-col cols="12" md="6" lg="4">
        <h2>Countries List</h2>
      </v-col>

      <v-col cols="12" md="6" lg="4" class="text-right">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="indigo darken-4"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Add New Country
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{title}}</span>
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <ValidationObserver ref="observer" v-slot="{ validate, reset }">
                  <form>
                    <v-row>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Label" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Label*"
                            v-model="form.label"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="Phone Code" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="Phone Code*"
                            v-model="form.phone_code"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" name="ISO Code" rules="required">
                          <v-text-field
                            :error-messages="errors"
                            label="ISO Code*"
                            v-model="form.iso_code"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </form>
                </ValidationObserver>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Close</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
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
              Country
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
              color="primary accent-2"
              @click="editCountry(item)"
            >
              <v-icon>mdi-circle-edit-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              color="red accent-2"
              @click="deleteCountry(item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: "country",
    data() {
      return {
        dialog: false,
        title: 'Add Country',
        isModeEdit: false,
        search: '',
        selected: [],
        headers: [
          {text: 'Country Title', align: 'start', value: 'label'},
          {text: 'Phone Code', align: 'start', value: 'phone_code'},
          {text: 'ISO Code', align: 'start', value: 'iso_code'},
          {text: 'Actions', value: 'action', sortable: false, align: 'end'},
        ],
        items: [],
        form: {
          label: '',
          phone_code: '',
          iso_code: ''
        }
      }
    },
    async fetch() {
      this.items = await this.$axios.get('/country').then(res => res.data.data);
    },
    methods: {
      editCountry(item) {
        this.isModeEdit = true;
        this.title = 'Edit Country';
        this.form = item;
        this.dialog = true;
      },
      save() {
        if (this.$refs.observer.validate()) {
          this.loading = true;
          this.error = null;

          if (this.isModeEdit) {
            this.update();
          } else {
            this.store();
          }
        }
      },
      async store() {
        await this.$axios.post(`/country/store`, this.form)
          .then(response => {
            this.$fetch();
            this.close();
          })
          .catch(errors => {
          });
      },
      async update() {
        await this.$axios.put(`/country/update`, this.form)
          .then(response => {
            this.$fetch();
            this.close();
          })
          .catch(errors => {
          });
      },
      close() {
        this.dialog = false;
        this.isModeEdit = false;
        this.form = {
          label: ''
        }
      },
      async deleteCountry(id) {
        await this.$axios.delete(`/country/delete/` + id)
          .then(response => {
            this.$fetch();
          })
          .catch(errors => {
          });
      }
    }
  }
</script>

<style scoped>

</style>

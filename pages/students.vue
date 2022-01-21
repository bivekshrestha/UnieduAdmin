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
        title: 'Student',
        api: '/student',
        search: '',
        snackbarMessage: '',
        showViewDialog: false,
        snackbar: false,
        selected: [],
        items: [],
        headers: [
          {text: 'Label', align: 'start', value: 'label'},
        ],
        single: {},
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
        this.showViewDialog = false;
        this.single = {}
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

<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="6"
        md="4"
        lg="3">
        <v-card
          dark
          color="indigo darken-4"
        >
          <v-card-title>20</v-card-title>
          <v-card-text><h2>Institutions</h2></v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="6"
        md="4"
        lg="3">
        <v-card
          dark
          color="indigo darken-4"
        >
          <v-card-title>200</v-card-title>
          <v-card-text><h2>Programs</h2></v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="6"
        md="4"
        lg="3">
        <v-card
          dark
          color="indigo darken-4"
        >
          <v-card-title>200</v-card-title>
          <v-card-text><h2>Recruiters</h2></v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="6"
        md="4"
        lg="3">
        <v-card
          dark
          color="indigo darken-4"
        >
          <v-card-title>200</v-card-title>
          <v-card-text><h2>Students</h2></v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="6"
        md="4"
        lg="3">
        <v-card
          dark
          color="indigo darken-4"
        >
          <v-card-title>200</v-card-title>
          <v-card-text><h2>Leads</h2></v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="6"
        md="4"
        lg="3">
        <v-card
          dark
          color="indigo darken-4"
        >
          <v-card-title>200</v-card-title>
          <v-card-text><h2>Destinations</h2></v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <v-row class="mt-5">
      <v-col cols="12">
        <v-card
          class="mx-auto text-center"
          light
        >
          <v-card-text>
           <v-sheet>
              <v-sparkline
                :value="value"
                color="dark"
                :gradient="['#f72047', '#ffd200', '#1feaea']"
                line-width="1"
                padding="18"
              >
                <template v-slot:label="item">
                  {{ item.value }}
                </template>
              </v-sparkline>
            </v-sheet>
          </v-card-text>

          <v-card-text>
            <div class="display-1 font-weight-thin">Students Registered in Last 14 days</div>
          </v-card-text>

          <v-divider></v-divider>

<!--          <v-card-actions class="justify-center">-->
<!--            <v-btn block text>Go to Report</v-btn>-->
<!--          </v-card-actions>-->
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>

  export default {
    components: {},
    data() {
      return {
        value: [
          40,
          46,
          75,
          10,
          50,
          10,
          60,
          75,
          10,
          50,
          10,
          60,
          50,
          91,
        ],
      }
    }
  }
</script>

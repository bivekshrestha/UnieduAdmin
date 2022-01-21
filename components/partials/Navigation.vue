<template>
  <section>
    <!--
      Sidebar / Navigation Drawer
     -->
    <v-navigation-drawer
      dark
      v-model="drawer"
      :mini-variant="miniVariant"
      fixed
      color="grey darken-4"
      app
      width="300"
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar color="white black--text">
            A
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Uniedu.io
            </v-list-item-title>
            <v-list-item-subtitle>
              {{$auth.user.first_name}} {{$auth.user.last_name}}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{$auth.user.roles[0]}}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider/>

        <template
          v-for="(item, i) in items">

          <template v-if="item.children">
            <v-list-group
              :prepend-icon="item.icon"
              no-action
              color="yellow lighten-4"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="(child, i) in item.children"
                :key="i"
                :to="{name: child.to}"
                router
                exact
              >
                <v-list-item-content>
                  <v-list-item-title v-text="child.title"/>
                </v-list-item-content>
              </v-list-item>

            </v-list-group>
          </template>

          <template v-else>
            <v-list-item
              :to="{name: item.to}"
              router
              exact
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"/>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar
      class="pr-5"
      :clipped-left="clipped"
      fixed
      light
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>

      <v-toolbar-title v-text="title"/>

      <v-spacer/>

      <div class="d-flex justify-end align-center">

<!--        <v-btn-->
<!--          @click.stop="notificationDrawer = !notificationDrawer"-->
<!--          icon-->
<!--        >-->
<!--          <v-icon>mdi-bell</v-icon>-->
<!--        </v-btn>-->

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>mdi-account-circle-outline</v-icon>
              {{ $auth.user.first_name }} {{ $auth.user.last_name }}
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item :to="{name: 'profile'}">
              <v-list-item-title to>Profile</v-list-item-title to>
            </v-list-item>
            <v-list-item :to="{name: 'change-password'}">
              <v-list-item-title>Change Password</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

    </v-app-bar>

    <v-navigation-drawer
      temporary
      fixed
      v-model="notificationDrawer"
      right
    >
      I m new notification
    </v-navigation-drawer>

  </section>
</template>

<script>
  export default {
    name: "Navigation",
    data() {
      return {
        clipped: false,
        notificationDrawer: false,
        drawer: true,
        fixed: false,
        items: [
          {
            icon: 'mdi-apps',
            title: 'Dashboard',
            to: 'index'
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Company',
            to: '',
            children: [
              {
                icon: 'mdi-apps',
                title: 'Offices',
                to: 'company-office'
              },
              {
                icon: 'mdi-apps',
                title: 'Employees',
                to: 'company-employee'
              },
              {
                icon: 'mdi-apps',
                title: 'Packages',
                to: 'company-package'
              },
              {
                icon: 'mdi-apps',
                title: 'News & Blog',
                to: 'company-blog'
              },
              {
                icon: 'mdi-apps',
                title: 'Vacancies',
                to: 'company-vacancy'
              },
              {
                icon: 'mdi-apps',
                title: 'Candidates',
                to: 'company-candidate'
              },
              {
                icon: 'mdi-apps',
                title: 'Enquiries',
                to: 'company-enquiry'
              },
            ]
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Region & Countries',
            to: '',
            children: [
              {
                icon: 'mdi-apps',
                title: 'Regions',
                to: 'region'
              },
              {
                icon: 'mdi-apps',
                title: 'Countries',
                to: 'region-country'
              },
            ]
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Institutions',
            to: '',
            children: [
              {
                icon: 'mdi-apps',
                title: 'Subject',
                to: 'institutions-subject'
              },
              {
                icon: 'mdi-apps',
                title: 'Institution',
                to: 'institutions'
              },
            ]
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Knowledge Base',
            to: '',
            children: [
              {
                icon: 'mdi-apps',
                title: 'Categories',
                to: 'knowledge-base-category'
              },
              {
                icon: 'mdi-apps',
                title: 'Articles ',
                to: 'knowledge-base-article'
              },
            ]
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Recruiters & Partners',
            to: 'recruiters'
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Leads',
            to: 'leads'
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Students',
            to: 'students'
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Users',
            to: 'admin',
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Site Settings',
            to: 'setting'
          },
        ],
        miniVariant: false,
        title: 'Admin Dashboard',
      }
    },
    methods: {
      async logout() {
        await this.$auth.logout('laravelSanctum');
      }
    }
  }
</script>

<style scoped>

</style>

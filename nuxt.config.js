import colors from 'vuetify/es5/util/colors'

export default {
  /*
  ** Nuxt rendering mode
  */
  ssr: false,
  /*
  ** Nuxt target
  */
  target: 'static',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - Admin - Uniedu.io',
    title: 'Admin - Uniedu.io' || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Uniedu.io Admin Panel'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/styles/main.scss',
  ],
  /*
  ** Global SCSS variables
  */
  styleResources: {
    scss: ['~/assets/styles/variables.scss']
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~/plugins/vee-validate",
  ],
  /*
  ** Auto import components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    [
      "nuxt-compress",
      {
        gzip: {
          cache: true
        },
        brotli: {
          threshold: 10240
        }
      }
    ]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/auth-next',
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
  ],
  /*
  ** .env config
  */
  env: {
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.uniedu.io'
  },
  /*
  ** Axios module configuration
  */
  axios: {
    credentials: true,
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api/admin' : "https://api.uniedu.io/api/admin"
  },
  /*
 ** Router configurations
 */
  router: {
    middleware: [
      'auth'
    ]
  },
  /*
  ** Authentication methods
  */
  auth: {
    strategies: {
      'laravelSanctum': {
        provider: 'laravel/sanctum',
        url: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.uniedu.io'
      },
    },
    redirect: {
      login: '/login',
      logout: '/login',
      home: false
    }
  },
  /*
  ** vuetify module configuration
  */
  vuetify: {
    // customVariables: ['~/assets/vuetify/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    extractCss: true,
    transpile: [
      "vee-validate/dist/rules"
    ],
  }
}

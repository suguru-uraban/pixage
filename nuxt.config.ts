require('dotenv').config()
const BASE_URL = 'https://pixage.app'

export default {
  srcDir: 'src/',

  env: {
    baseUrl: BASE_URL || 'http://localhost:3000',
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Pixage',
    titleTemplate: '%s | Pixage',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Pixage' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/scss/reset.scss', '@/assets/scss/transition.scss', 'swiper/css/swiper.css'],
  styleResources: {
    scss: ['@/assets/scss/variables/_color.scss', '@/assets/scss/variables/_zIndex.scss'],
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/firebase',
    '@/plugins/cookie',
    { src: '@/plugins/vue-awesome-swiper', mode: 'client' },
    { src: '@/plugins/ga.ts', mode: 'client' },
    { src: '@/plugins/vue-croppa', mode: 'client' },
    { src: '@/plugins/vue-upload-drop-images', mode: 'client' },
    { src: '@/plugins/vue-dragscroll', mode: 'client' },
    { src: '@/plugins/vue-simple-accordion', mode: 'client' },
    { src: '@/plugins/vue-upload-component', mode: 'client' },
    { src: '@/plugins/vue-clipboard2', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    '@nuxtjs/device',
    [
      'nuxt-i18n',
      {
        locales: [
          { code: 'ja', name: '日本語', iso: 'ja_JP', file: 'ja.ts' },
          { code: 'en', name: 'English', iso: 'en-US', file: 'en.ts' },
        ],
        defaultLocale: 'ja',
        langDir: 'locales/',
        strategy: 'no_prefix',
        vueI18n: {
          fallbackLocale: 'ja',
        },
        vueI18nLoader: true,
        lazy: true,
      },
    ],
    'nuxt-fontawesome',
    'vue-social-sharing/nuxt',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: [
          'faHome',
          'faList',
          'faBookmark',
          'faCheck',
          'faSearch',
          'faTimes',
          'faGlobe',
          'faCaretDown',
          'faBars',
          'faThumbsUp',
          'faHeart',
          'faMeh',
          'faAddressCard',
          'faSignOutAlt',
          'faEdit',
          'faEnvelope',
          'faCoins',
          'faUserTag',
          'faUpload',
          'faUserPlus',
          'faFolderPlus',
          'faTh',
          'faLockOpen',
          'faLock',
          'faHandPointRight',
          'faBookOpen',
          'faChevronLeft',
          'faChevronRight',
          'faBackward',
          'faSearchPlus',
          'faSearchMinus',
          'faTrash',
          'faFileUpload',
          'faFileArchive',
          'faExclamation',
          'faDownload',
          'faClipboard',
          'faMoneyBill',
          'faHandshake',
          'faFileExport',
        ],
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['faTwitter'],
      },
      {
        set: '@fortawesome/free-regular-svg-icons',
        icons: ['faUser'],
      },
    ],
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    vendor: ['vue-awesome-swiper'],
  },

  generate: {
    dir: 'static',
    fallback: true,
  },
}

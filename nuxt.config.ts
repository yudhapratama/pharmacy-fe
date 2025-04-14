export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  ui: {
    global: true,
    icons: ['heroicons'],
    // Add theme configuration to force light mode
    preferences: {
      theme: {
        dark: false,
        system: false
      }
    }
  },

  // Add or update the colorMode configuration
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
    storageKey: 'nuxt-color-mode',
    disableTransition: true
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    config: {
      theme: {
        darkMode: false
      },
    }    
  },

  app: {
    head: {
      title: process.env.NUXT_PUBLIC_APP_NAME || 'Clinic Purchase Order'
    }
  },

  compatibilityDate: '2025-03-21',
  css: ['~/assets/css/globals.css'],
  
  runtimeConfig: {
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME,
      apiUrl: process.env.NUXT_PUBLIC_API_URL
    }
  }
})
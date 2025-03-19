import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/fonts'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  css: ['~/assets/css/main.css'],
   // App configuration
   app: {
    head: {
      title: 'Sudoku 1vs1',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Multiplayer Sudoku game where you can challenge your friends to Sudoku duels in real-time.' }
      ],
      link: [
        // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
 
  
  // Plugins to load
  plugins: [
    // '~/plugins/socket.ts'
  ],

  // Add runtime config for Pocketbase
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.NUXT_POCKETBASE_URL || 'https://pocketbase-soduko.cscclub.space'
    }
  }
})
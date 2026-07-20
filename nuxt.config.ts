// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },

  app: {
    head: {
      title: 'Kalbe Donor Kalori Leaderboard - Biopharma',
      meta: [
        {
          name: 'description',
          content: 'Track the best performers from PT Agroveta Husada Dharma, Corporate Function, and PT Global Chemindo Megatrading.',
        },
        { name: 'theme-color', content: '#15803D' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@500;600;700;800&display=swap',
        },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  typescript: {
    strict: true,
  },

  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/Flip', 'countup.js', 'canvas-confetti'],
    },
  },
})

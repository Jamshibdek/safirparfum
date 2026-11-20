// SafirParfum — frontend (mock ma'lumotlar bilan). Backend keyinroq ulanadi.
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'uz' },
      title: 'SafirParfum — original atirlar Toshkentda',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0E1A33' },
        { name: 'description', content: "SafirParfum — Toshkentda original Yevropa atirlari. 30, 50 va 100 ml, hidlab tanlash, 1 kunda yetkazib berish." },
        { property: 'og:site_name', content: 'SafirParfum' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://sefir.uz/og.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Prata&family=Onest:wght@400;500;600;700&display=swap'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  i18n: {
    baseUrl: 'https://sefir.uz',
    locales: [
      { code: 'uz', language: 'uz-UZ', name: "O'zbekcha", file: 'uz.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' }
    ],
    defaultLocale: 'uz',
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales',
    detectBrowserLanguage: false,
    bundle: { optimizeTranslationDirective: false }
  },

  // Dev-rejimda vite-node "/node_modules/vue/index.js" ni 403 bilan rad etmasligi uchun (production'ga ta'sir qilmaydi)
  vite: { server: { fs: { strict: false } } },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/shop', '/sitemap.xml'],
      failOnError: false
    }
  },

  routeRules: {
    '/checkout': { ssr: false },
    '/account/**': { ssr: false },
    '/order/**': { ssr: false },
    '/wishlist': { ssr: false },
    '/ru/checkout': { ssr: false },
    '/ru/account/**': { ssr: false },
    '/ru/order/**': { ssr: false },
    '/ru/wishlist': { ssr: false }
  }
})

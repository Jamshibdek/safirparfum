// SSR uchun bo'sh v-parallax (ish faqat klientda, parallax.client.ts)
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('parallax', { getSSRProps: () => ({}) })
})

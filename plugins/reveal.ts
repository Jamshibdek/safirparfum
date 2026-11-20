// v-reveal: ataylab "jim" direktiva. Dizayn qoidasi — har bo'limda fade-animatsiya emas,
// faqat bosh bannerdagi bitta harakat. Direktiva shablonlarda qoladi, keyin kerak bo'lsa yoqiladi.
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('reveal', { getSSRProps: () => ({}) })
})

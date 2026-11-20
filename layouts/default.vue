<script setup lang="ts">
import { useUi } from '~/stores/shop'
const ui = useUi()
const route = useRoute()
const anyOpen = computed(() => ui.cart || ui.quiz || ui.menu || !!ui.quick)

watch(anyOpen, v => { if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : '' })
watch(() => route.fullPath, () => { ui.cart = false; ui.quiz = false; ui.quick = null; ui.menu = false })
function key(e: KeyboardEvent) { if (e.key === 'Escape') ui.closeAll() }
onMounted(() => document.addEventListener('keydown', key))
onBeforeUnmount(() => document.removeEventListener('keydown', key))
</script>

<template>
  <div class="app">
    <a href="#main" class="skip">Kontentga o'tish</a>
    <AppHeader />
    <main id="main"><slot /></main>
    <AppFooter />
    <MobileNav />

    <ClientOnly>
      <Transition name="fade"><div v-if="anyOpen" class="scrim" @click="ui.closeAll()" /></Transition>
      <Transition name="slide-r"><CartDrawer v-if="ui.cart" /></Transition>
      <Transition name="slide-r"><QuizPanel v-if="ui.quiz" /></Transition>
      <Transition name="mm"><MobileMenu v-if="ui.menu" /></Transition>
      <Transition name="pop"><QuickView v-if="ui.quick" :key="ui.quick" /></Transition>
      <ToastBar />
    </ClientOnly>
  </div>
</template>

<style>
.skip { position: absolute; left: -999px; top: 8px; z-index: 200; background: var(--ink); color: #fff; padding: 10px 16px; border-radius: 8px; }
.skip:focus { left: 8px; }
main { min-height: 60vh; }
.mm-enter-active, .mm-leave-active { transition: transform .45s var(--ease); }
.mm-enter-from, .mm-leave-to { transform: translateX(-100%); }
</style>

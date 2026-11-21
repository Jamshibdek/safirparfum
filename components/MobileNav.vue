<script setup lang="ts">
import { useCart, useWishlist, useUi } from '~/stores/shop'
const { t } = useI18n()
const lp = useLocalePath()
const route = useRoute()
const cart = useCart()
const wish = useWishlist()
const ui = useUi()
const mounted = ref(false)
onMounted(() => (mounted.value = true))
const path = computed(() => route.path.replace(/^\/ru(?=\/|$)/, '') || '/')
</script>

<template>
  <nav class="mn" aria-label="Mobil">
    <NuxtLink :to="lp('/')" :class="{ on: path === '/' }"><Icon name="home" /><span>{{ t('nav.home') }}</span></NuxtLink>
    <NuxtLink :to="lp('/shop')" :class="{ on: path.startsWith('/shop') }"><Icon name="grid" /><span>{{ t('nav.catalog') }}</span></NuxtLink>
    <button @click="ui.quiz = true"><Icon name="sparkle" /><span>Test</span></button>
    <NuxtLink :to="lp('/wishlist')" :class="{ on: path.startsWith('/wishlist') }">
      <Icon name="heart" /><span>{{ t('nav.wishlist') }}</span>
      <i v-if="mounted && wish.count" class="dot">{{ wish.count }}</i>
    </NuxtLink>
    <button data-cart-target @click="ui.cart = true">
      <Icon name="bag" /><span>{{ t('nav.cart') }}</span>
      <i v-if="mounted && cart.count" class="dot">{{ cart.count }}</i>
    </button>
  </nav>
</template>

<style scoped>
.mn { display: none; }
@media (max-width: 767px) {
  .mn {
    display: grid; grid-template-columns: repeat(5, 1fr); position: fixed; left: 0; right: 0; bottom: 0; z-index: 45;
    height: calc(64px + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom);
    background: rgba(255, 253, 249, .94); backdrop-filter: blur(12px); border-top: 1px solid var(--line);
  }
  .mn a, .mn button { position: relative; display: grid; justify-items: center; align-content: center; gap: 3px; border: 0; background: transparent; font-size: 10.5px; font-weight: 600; color: var(--muted); }
  .mn .on { color: var(--sapphire); }
  .dot { position: absolute; top: 8px; left: 52%; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; background: var(--sapphire); color: #fff; font-size: 10px; font-style: normal; display: grid; place-items: center; }
}
</style>

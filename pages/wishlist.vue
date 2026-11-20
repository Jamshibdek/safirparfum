<script setup lang="ts">
import { getProduct } from '~/lib/catalog'
import { useWishlist } from '~/stores/shop'
const { t } = useI18n()
const lp = useLocalePath()
const wish = useWishlist()
const items = computed(() => wish.slugs.map(getProduct).filter(Boolean))
useSeoMeta({ title: () => `${t('wish.title')} — SafirParfum`, robots: 'noindex' })
</script>

<template>
  <div>
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs"><NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span><span>{{ t('wish.title') }}</span></nav>
        <h1 class="h1">{{ t('wish.title') }} <span class="c num">{{ items.length }}</span></h1>
      </div>
    </header>
    <section class="wrap section">
      <div v-if="items.length" class="grid-products">
        <ProductCard v-for="p in items" :key="p!.slug" :product="p!" />
      </div>
      <div v-else class="empty">
        <svg viewBox="0 0 120 120" width="110" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="var(--bg-2)" /><path d="M60 86s-22-13.5-22-31a12.5 12.5 0 0 1 22-8.1A12.5 12.5 0 0 1 82 55c0 17.5-22 31-22 31Z" fill="none" stroke="var(--sapphire)" stroke-width="2.5" /></svg>
        <h2 class="h2">{{ t('wish.empty') }}</h2>
        <p class="lead">{{ t('wish.emptyText') }}</p>
        <NuxtLink :to="lp('/shop')" class="btn">{{ t('wish.toShop') }}</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.c { font-family: var(--f-ui); font-size: 18px; color: var(--muted); vertical-align: middle; }
.empty { display: grid; justify-items: center; text-align: center; gap: 14px; padding: 40px 0; }
</style>

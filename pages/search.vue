<script setup lang="ts">
import { searchProducts, products } from '~/lib/catalog'
const route = useRoute()
const { t } = useI18n()
const lp = useLocalePath()
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))
const results = computed(() => (q.value ? searchProducts(q.value, 60) : []))
const popular = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8)
const tries = ['Dior', 'vanil', 'ud', 'Baccarat', 'атиргул', 'savage']
useSeoMeta({ title: () => `${t('search.title')}${q.value ? ': ' + q.value : ''} — SafirParfum`, robots: 'noindex, follow' })
</script>

<template>
  <div>
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs"><NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span><span>{{ t('nav.search') }}</span></nav>
        <h1 class="h1">{{ q ? `«${q}»` : t('search.title') }}</h1>
        <p class="lead" style="margin-top: 10px">{{ q ? (results.length ? t('search.count', { n: results.length }) : t('search.empty', { q })) : t('search.hint') }}</p>
        <div class="sb"><SearchBox :key="q" /></div>
        <div v-if="!results.length" class="tries">
          <NuxtLink v-for="w in tries" :key="w" :to="lp({ path: '/search', query: { q: w } })" class="chip soft">{{ w }}</NuxtLink>
        </div>
      </div>
    </header>
    <section class="wrap section">
      <div v-if="results.length" class="grid-products"><ProductCard v-for="p in results" :key="p.slug" :product="p" /></div>
      <template v-else>
        <div class="sec-head"><h2 class="h2">{{ t('header.popular') }}</h2></div>
        <div class="grid-products"><ProductCard v-for="p in popular" :key="p.slug" :product="p" /></div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.sb { max-width: 640px; margin-top: 22px; }
.tries { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; }
</style>

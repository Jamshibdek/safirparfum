<script setup lang="ts">
import { counts, getProduct } from '~/lib/catalog'
const { t } = useI18n()
const lp = useLocalePath()
const tiles = [
  { key: 'men', to: { path: '/shop', query: { gender: 'men' } }, n: counts.men, p: getProduct('creed-aventus')!, tone: ['#1F2E5A', '#0E1A33'], dark: true },
  { key: 'women', to: { path: '/shop', query: { gender: 'women' } }, n: counts.women, p: getProduct('parfums-de-marly-delina')!, tone: ['#F3D3D9', '#E2B5BF'], dark: false },
  { key: 'unisex', to: { path: '/shop', query: { gender: 'unisex' } }, n: counts.unisex, p: getProduct('le-labo-santal-33')!, tone: ['#E8DCC6', '#CDB48A'], dark: false },
  { key: 'sale', to: { path: '/shop', query: { sale: '1' } }, n: counts.sale, p: getProduct('versace-eros')!, tone: ['#B23A2E', '#6B1D16'], dark: true }
]
</script>

<template>
  <div class="tiles">
    <NuxtLink v-for="(c, k) in tiles" :key="c.key" v-reveal :to="lp(c.to)" class="tile" :class="{ dark: c.dark, wide: k === 0 }" :style="{ '--a': c.tone[0], '--b': c.tone[1], transitionDelay: k * 60 + 'ms' }">
      <div class="art"><BottleArt :product="c.p" bare /></div>
      <div class="txt">
        <span class="n">{{ c.n }} {{ t('home.items') }}</span>
        <span class="nm display">{{ c.key === 'sale' ? t('badge.sale') : t(`gender.${c.key}`) }}</span>
        <span class="go">{{ t('home.explore') }}</span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.tiles { display: grid; grid-template-columns: 1.4fr 1fr 1fr; grid-template-rows: 240px 240px; gap: 16px; }
.tile { position: relative; overflow: hidden; border-radius: 22px; background: radial-gradient(110% 120% at 80% 30%, var(--a), var(--b)); color: var(--ink); display: flex; align-items: flex-end; padding: 24px; isolation: isolate; }
.tile.dark { color: #F3EFE7; }
.tile.wide { grid-row: span 2; }
.tile:nth-child(4) { grid-column: span 2; }
.art { position: absolute; right: -6%; bottom: -10%; width: 62%; z-index: -1; transition: transform .8s var(--ease); filter: drop-shadow(0 20px 24px rgba(0, 0, 0, .25)); }
.wide .art { width: 86%; right: -10%; bottom: -4%; }
.tile:nth-child(4) .art { width: 34%; right: 4%; }
.tile:hover .art { transform: translateY(-8px) rotate(-2deg); }
.txt { display: grid; gap: 4px; }
.n { font-size: 13px; opacity: .75; }
.nm { font-size: clamp(30px, 3.2vw, 46px); line-height: 1; }
.go { font-size: 13.5px; font-weight: 600; margin-top: 10px; padding-bottom: 2px; border-bottom: 1px solid currentColor; align-self: start; justify-self: start; }
@media (max-width: 767px) {
  .tiles { grid-template-columns: 1fr 1fr; grid-template-rows: 220px 170px 150px; gap: 10px; }
  .tile.wide { grid-row: auto; grid-column: span 2; }
  .tile:nth-child(4) { grid-column: span 2; }
  .tile { padding: 16px; border-radius: 18px; }
  .art { width: 50%; right: -14%; bottom: -12%; }
  .wide .art { width: 52%; right: 0; bottom: -8%; }
}
</style>

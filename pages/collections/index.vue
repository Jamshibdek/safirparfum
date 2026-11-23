<script setup lang="ts">
import { collections, products, matchCollection, getProduct, useL } from '~/lib/catalog'
const { t } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const art: Record<string, string[]> = {
  yangi: ['amouage-guidance', 'yves-saint-laurent-myslf'], top: ['creed-aventus', 'chanel-coco-mademoiselle'], sovga: ['tom-ford-lost-cherry', 'parfums-de-marly-delina'],
  yozgi: ['tom-ford-neroli-portofino', 'xerjoff-erba-pura'], kechki: ['initio-side-effect', 'tom-ford-tobacco-vanille'], chegirma: ['giorgio-armani-stronger-with-you-intensely', 'versace-eros']
}
useSeoMeta({ title: () => `${t('collections.title')} — Sefir Parfum` })
</script>

<template>
  <div>
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs"><NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span><span>{{ t('collections.title') }}</span></nav>
        <h1 class="h1">{{ t('collections.title') }}</h1>
      </div>
    </header>
    <section class="wrap section grid">
      <NuxtLink v-for="(c, k) in collections" :key="c.slug" :to="lp(`/collections/${c.slug}`)" class="c" :class="{ big: k === 0 }" :style="{ '--a': c.tone[0], '--b': c.tone[1] }">
        <div class="arts">
          <div class="a1"><BottleArt :product="getProduct(art[c.slug][0])!" bare /></div>
          <div class="a2"><BottleArt :product="getProduct(art[c.slug][1])!" bare /></div>
        </div>
        <div class="tx">
          <span class="n">{{ products.filter(p => matchCollection(p, c.rule)).length }} {{ t('collections.items') }}</span>
          <h2 class="display nm">{{ L(c.name) }}</h2>
          <p>{{ L(c.text) }}</p>
        </div>
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.c { position: relative; min-height: 340px; border-radius: 24px; overflow: hidden; padding: 26px; display: flex; align-items: flex-end; color: #F2F3F6; background: radial-gradient(120% 120% at 80% 20%, var(--a), var(--b)); isolation: isolate; }
.c.big { grid-column: span 2; }
.arts { position: absolute; inset: 0; z-index: -1; }
.a1, .a2 { position: absolute; filter: drop-shadow(0 26px 26px rgba(0, 0, 0, .35)); transition: transform .8s var(--ease); }
.a1 { width: 52%; right: 14%; top: -6%; }
.a2 { width: 40%; right: -8%; top: 14%; }
.big .a1 { width: 34%; right: 22%; } .big .a2 { width: 28%; right: 2%; }
.c:hover .a1 { transform: translateY(-6px); }
.tx { display: grid; gap: 4px; max-width: 70%; }
.n { font-size: 13px; opacity: .75; }
.nm { font-size: clamp(30px, 3vw, 44px); line-height: 1.05; }
.tx p { opacity: .8; font-size: 14px; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .c.big { grid-column: auto; } .c { min-height: 260px; } }
</style>

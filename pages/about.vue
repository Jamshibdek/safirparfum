<script setup lang="ts">
import { getProduct } from '~/lib/catalog'
const { t, tm, rt } = useI18n()
const lp = useLocalePath()
const stats = computed(() => (tm('about.stats') as any[]).map(r => r.map((x: any) => rt(x))))
const values = computed(() => (tm('about.values') as any[]).map(r => r.map((x: any) => rt(x))))
const art = getProduct('amouage-interlude-man')!
const art2 = getProduct('maison-francis-kurkdjian-baccarat-rouge-540')!
useSeoMeta({ title: () => `${t('nav.about')} — Sefir Parfum`, description: () => t('about.p1') })
</script>

<template>
  <div>
    <section class="wrap hero">
      <nav class="crumbs"><NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span><span>{{ t('nav.about') }}</span></nav>
      <h1 class="h1 ttl">{{ t('about.title') }}</h1>
    </section>

    <section class="wrap story">
      <div class="pic">
        <div class="gem-frame"><BottleArt :product="art" scene="mood" /></div>
        <div class="small"><BottleArt :product="art2" /></div>
      </div>
      <div class="txt">
        <p class="first">{{ t('about.p1') }}</p>
        <p>{{ t('about.p2') }}</p>
        <p>{{ t('about.p3') }}</p>
      </div>
    </section>

    <section class="wrap">
      <dl class="stats">
        <div v-for="s in stats" :key="s[1]"><dt class="display num">{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
      </dl>
    </section>

    <section class="wrap section values">
      <div v-for="v in values" :key="v[0]" class="val">
        <h2 class="h3">{{ v[0] }}</h2>
        <p class="muted">{{ v[1] }}</p>
      </div>
    </section>

    <section class="visit">
      <div class="wrap vin">
        <div>
          <h2 class="h2">{{ t('about.visit') }}</h2>
          <p>{{ t('about.visitText') }}</p>
        </div>
        <div class="vb">
          <NuxtLink :to="lp('/locations')" class="btn champagne">{{ t('nav.locations') }}</NuxtLink>
          <NuxtLink :to="lp('/contact')" class="btn ghost-light">{{ t('nav.contact') }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero { padding-top: 32px; }
.ttl { max-width: 18ch; margin-top: 22px; font-size: clamp(40px, 5.6vw, 80px); }
.story { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; padding-top: 56px; padding-bottom: 64px; align-items: center; }
.pic { position: relative; }
.gem-frame { aspect-ratio: 4 / 5; border-radius: 200px 200px 24px 24px; overflow: hidden; }
.small { position: absolute; width: 42%; aspect-ratio: 1; right: -8%; bottom: -8%; border-radius: 50%; overflow: hidden; border: 8px solid var(--bg); }
.txt { display: grid; gap: 18px; font-size: 17px; line-height: 1.75; color: var(--ink-2); max-width: 58ch; }
.first { font-family: var(--f-display); font-size: clamp(24px, 2.4vw, 32px); line-height: 1.35; color: var(--ink); }
.stats { margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.stats div { padding: 32px 24px; border-left: 1px solid var(--line); }
.stats div:first-child { border-left: 0; padding-left: 0; }
.stats dt { font-size: clamp(44px, 5vw, 68px); line-height: 1; color: var(--sapphire); }
.stats dd { margin: 10px 0 0; color: var(--ink-2); font-size: 14px; }
.values { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
.val { display: grid; gap: 8px; align-content: start; }
.visit { background: var(--night); color: #F2F3F6; }
.vin { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding-block: 56px; flex-wrap: wrap; }
.vin p { margin-top: 8px; opacity: .75; }
.vb { display: flex; gap: 10px; flex-wrap: wrap; }
@media (max-width: 900px) {
  .story { grid-template-columns: 1fr; gap: 56px; }
  .pic { max-width: 420px; }
  .small { right: 0; bottom: -6%; }
  .stats, .values { grid-template-columns: 1fr 1fr; }
  .stats div:nth-child(3) { border-left: 0; padding-left: 0; }
}
@media (max-width: 560px) { .values { grid-template-columns: 1fr; } .stats div { padding: 22px 12px; } }
</style>

<script setup lang="ts">
import { branches, useL } from '~/lib/catalog'
const { t } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const sel = ref(branches[0].id)
useSeoMeta({ title: () => `${t('nav.locations')} — SafirParfum`, description: () => t('locations.text') })
</script>

<template>
  <div>
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs"><NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span><span>{{ t('nav.locations') }}</span></nav>
        <h1 class="h1">{{ t('locations.title') }}</h1>
        <p class="lead" style="margin-top: 10px">{{ t('locations.text') }}</p>
      </div>
    </header>
    <section class="wrap section lay">
      <div class="list">
        <article v-for="b in branches" :key="b.id" class="b" :class="{ on: sel === b.id }" @click="sel = b.id">
          <h2 class="h3">{{ L(b.name) }}</h2>
          <p><Icon name="pin" :size="16" />{{ L(b.city) }}, {{ L(b.address) }}</p>
          <p class="muted">{{ L(b.landmark) }}</p>
          <p><Icon name="clock" :size="16" />{{ b.hours }}</p>
          <div class="acts">
            <a :href="`https://yandex.uz/maps/?rtext=~${b.lat},${b.lng}&rtt=auto`" target="_blank" rel="noopener" class="btn sm">{{ t('locations.route') }}</a>
            <a :href="`tel:${b.phone.replace(/\s/g, '')}`" class="btn ghost sm num"><Icon name="phone" :size="15" />{{ b.phone }}</a>
          </div>
        </article>
      </div>
      <div class="mapw"><BranchMap :selected="sel" :height="560" /></div>
    </section>
  </div>
</template>

<style scoped>
.lay { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; align-items: start; }
.list { display: grid; gap: 12px; }
.b { padding: 22px; border-radius: 20px; border: 1px solid var(--line); background: var(--surface); cursor: pointer; display: grid; gap: 6px; transition: border-color .2s; }
.b.on { border-color: var(--sapphire); box-shadow: inset 0 0 0 1px var(--sapphire); }
.b p { display: flex; gap: 8px; align-items: center; font-size: 14px; }
.b :deep(svg) { color: var(--gold); flex: none; }
.acts { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
.acts :deep(svg) { color: inherit; }
.mapw { position: sticky; top: calc(var(--header-h) + 16px); }
@media (max-width: 900px) { .lay { grid-template-columns: 1fr; } .mapw { position: static; order: -1; } }
</style>

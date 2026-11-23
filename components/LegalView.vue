<script setup lang="ts">
import { legal } from '~/lib/legal'
import { useL } from '~/lib/catalog'
const props = defineProps<{ page: 'delivery' | 'returns' | 'offer' }>()
const { t } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const d = computed(() => legal[props.page])
const others = computed(() => (['delivery', 'returns', 'offer'] as const).filter(k => k !== props.page))
useSeoMeta({ title: () => `${L(d.value.title)} — Sefir Parfum` })
</script>

<template>
  <div>
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs"><NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span><span>{{ L(d.title) }}</span></nav>
        <h1 class="h1">{{ L(d.title) }}</h1>
        <p class="muted upd num">{{ d.updated.split('-').reverse().join('.') }}</p>
      </div>
    </header>
    <div class="wrap section lay">
      <article class="doc">
        <section v-for="b in d.blocks" :key="b.h.uz">
          <h2 class="h3">{{ L(b.h) }}</h2>
          <p v-for="(p, i) in b.p" :key="i">{{ L(p) }}</p>
        </section>
      </article>
      <aside class="side">
        <NuxtLink v-for="k in others" :key="k" :to="lp(`/${k}`)" class="o">{{ L(legal[k].title) }}</NuxtLink>
        <NuxtLink :to="lp('/contact')" class="btn ghost">{{ t('nav.contact') }}</NuxtLink>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.upd { margin-top: 10px; font-size: 13px; }
.lay { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 64px; }
.doc { display: grid; gap: 34px; max-width: 68ch; }
.doc section { display: grid; gap: 10px; }
.doc p { font-size: 16px; line-height: 1.75; color: var(--ink-2); }
.side { display: grid; gap: 4px; align-content: start; position: sticky; top: calc(var(--header-h) + 20px); }
.o { padding: 12px 0; border-bottom: 1px solid var(--line); font-weight: 500; }
.o:hover { color: var(--sapphire); }
.side .btn { margin-top: 16px; justify-self: start; }
@media (max-width: 900px) { .lay { grid-template-columns: 1fr; gap: 32px; } .side { position: static; } }
</style>

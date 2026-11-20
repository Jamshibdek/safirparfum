<script setup lang="ts">
import { brands } from '~/lib/catalog'
const lp = useLocalePath()
const row = [...brands, ...brands]
</script>

<template>
  <div class="strip" aria-label="Brendlar">
    <div class="move">
      <NuxtLink v-for="(b, k) in row" :key="b.slug + k" :to="lp({ path: '/shop', query: { brand: b.slug } })" class="b" :tabindex="k >= brands.length ? -1 : 0">
        {{ b.name }}<span class="gem">◆</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.strip { overflow: hidden; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 22px 0; mask: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.move { display: flex; width: max-content; animation: marquee 60s linear infinite; }
.strip:hover .move { animation-play-state: paused; }
.b { display: inline-flex; align-items: center; gap: 28px; padding-right: 28px; font-family: var(--f-display); font-size: clamp(24px, 2.6vw, 34px); font-weight: 600; white-space: nowrap; color: var(--ink-2); transition: color .2s; }
.b:hover { color: var(--sapphire); }
.gem { font-size: 10px; color: var(--gold); }
@keyframes marquee { to { transform: translateX(-50%); } }
</style>

<script setup lang="ts">
import type { Product } from '~/lib/catalog'
defineProps<{ items: Product[] }>()
const track = ref<HTMLElement | null>(null)
const scroll = (d: number) => track.value?.scrollBy({ left: d * (track.value.clientWidth * 0.8), behavior: 'smooth' })
</script>

<template>
  <div class="rail">
    <div ref="track" class="track">
      <div v-for="p in items" :key="p.slug" class="cell"><ProductCard :product="p" /></div>
    </div>
    <button class="nav l" aria-label="←" @click="scroll(-1)"><Icon name="left" :size="18" /></button>
    <button class="nav r" aria-label="→" @click="scroll(1)"><Icon name="right" :size="18" /></button>
  </div>
</template>

<style scoped>
.rail { position: relative; }
.track { position: relative; display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 60px) / 4); gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 6px; }
.track::-webkit-scrollbar { display: none; }
.cell { scroll-snap-align: start; display: grid; }
.nav { position: absolute; top: 34%; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: var(--surface); display: grid; place-items: center; box-shadow: 0 10px 24px -14px rgba(14, 26, 51, .5); }
.nav.l { left: -18px; }
.nav.r { right: -18px; }
@media (max-width: 1100px) { .track { grid-auto-columns: calc((100% - 40px) / 3); } }
@media (max-width: 767px) { .track { grid-auto-columns: 46%; gap: 12px; } .nav { display: none; } }
</style>

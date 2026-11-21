<script setup lang="ts">
// Haqiqiy suratli atirlar uchun hajm o'lchagich: kichik flakon, ichidagi atir tanlangan hajmga qarab
// 30 ml — kamayadi, 100 ml — to'ladi (suratdagi flakonni o'zgartirib bo'lmagani uchun).
import { fillLevel } from '~/lib/catalog'
const props = withDefaults(defineProps<{ ml: number; color?: string; small?: boolean }>(), { color: '#E9B8B0', small: false })
const shift = computed(() => 44 * (1 - fillLevel(props.ml)) + 2) // suyuqlik sathi (viewBox birligida)
</script>

<template>
  <span class="gauge" :class="{ small }" :aria-label="`${ml} ml`">
    <svg viewBox="0 0 32 60" aria-hidden="true">
      <defs><clipPath id="g-body"><rect x="4" y="14" width="24" height="44" rx="5" /></clipPath></defs>
      <rect x="11" y="2" width="10" height="8" rx="2" fill="#D9C08A" />
      <rect x="13" y="9" width="6" height="6" fill="#C9AE76" />
      <rect x="4" y="14" width="24" height="44" rx="5" fill="rgba(255,255,255,.75)" />
      <g clip-path="url(#g-body)">
        <rect class="liq" x="0" y="14" width="32" height="50" :fill="color" :style="{ transform: `translateY(${shift}px)` }" />
        <rect class="liq" x="0" y="14" width="32" height="2" fill="#fff" opacity=".6" :style="{ transform: `translateY(${shift}px)` }" />
      </g>
      <rect x="4" y="14" width="24" height="44" rx="5" fill="none" stroke="rgba(20,33,61,.35)" stroke-width="1.2" />
      <rect x="7" y="17" width="2.5" height="36" rx="1.2" fill="#fff" opacity=".55" />
    </svg>
    <b class="num">{{ ml }} ml</b>
  </span>
</template>

<style scoped>
.gauge { display: inline-grid; justify-items: center; gap: 2px; padding: 8px 8px 6px; border-radius: 14px; background: rgba(255, 255, 255, .86); box-shadow: 0 8px 20px -12px rgba(11, 22, 49, .5); backdrop-filter: blur(6px); pointer-events: none; }
.gauge svg { width: 26px; height: 48px; overflow: visible; }
.gauge b { font-size: 11px; font-weight: 700; color: var(--ink); }
.liq { transition: transform .8s var(--ease); }
.small { padding: 6px 6px 4px; border-radius: 12px; }
.small svg { width: 18px; height: 34px; }
.small b { font-size: 10px; }
</style>

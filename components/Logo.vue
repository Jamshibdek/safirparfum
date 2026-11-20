<script setup lang="ts">
withDefaults(defineProps<{ light?: boolean; compact?: boolean }>(), { light: false, compact: false })
</script>

<template>
  <span class="logo" :class="{ light, compact }">
    <!-- Safir toshi: qirrali gavhar belgisi -->
    <svg class="gem" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="gem-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#5C83C9" />
          <stop offset=".55" stop-color="#1F3F78" />
          <stop offset="1" stop-color="#0E1A33" />
        </linearGradient>
      </defs>
      <path d="M8 14 14 7h12l6 7-12 19L8 14Z" fill="url(#gem-a)" />
      <path d="M8 14h24M14 7l6 7 6-7M20 14v19M14 14l6 19 6-19" fill="none" stroke="rgba(255,255,255,.45)" stroke-width=".8" />
      <path d="M14 7h12l-6 7-6-7Z" fill="rgba(255,255,255,.18)" />
    </svg>
    <span class="word">
      <span class="w1">SAFIR</span>
      <span v-if="!compact" class="w2">PARFUM</span>
    </span>
  </span>
</template>

<style scoped>
.logo { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); }
.logo.light { color: #F3EFE7; }
.gem { width: 34px; height: 34px; flex: none; filter: drop-shadow(0 4px 8px rgba(31, 63, 120, .25)); }
.word { display: grid; line-height: 1; }
.w1 { font-family: var(--f-display); font-weight: 700; font-size: 25px; letter-spacing: .14em; }
.w2 { font-size: 9px; font-weight: 600; letter-spacing: .52em; margin-top: 4px; color: var(--gold); }
.compact .w1 { font-size: 21px; }
.compact .gem { width: 28px; height: 28px; }
</style>

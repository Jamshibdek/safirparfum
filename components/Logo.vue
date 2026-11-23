<script setup lang="ts">
withDefaults(defineProps<{ light?: boolean; compact?: boolean }>(), { light: false, compact: false })
</script>

<template>
  <span class="logo" :class="{ light, compact }">
    <!-- Mijoz logotipidagi belgi (rasmvidio/SEFIR/SVG/3.svg, faqat sariq "S" qismi) -->
    <svg class="gem" viewBox="104 -4 251 164" aria-hidden="true">
      <g fill="#F3B802">
        <polygon points="171.74 124.8 140.91 155.63 108.21 155.63 139.04 124.8 171.74 124.8" />
        <polygon points="350.87 0 320.03 30.84 287.33 30.84 318.17 0 350.87 0" />
        <path d="M188.84,85.65h22.06l-23.12,23.12h-4.35c-30.51,0-45.790-36.89-24.22-58.46L209.52,0h32.7l-62.83,62.83c-8.42,8.42-2.46,22.82,9.450,22.82Z" />
        <path d="M300.24,104.96l-50.68,50.68h-32.71l63.2-63.2c8.42-8.42,2.46-22.81-9.45-22.81h-22.06l23.12-23.12h4.36c30.51,0,45.79,36.88,24.21,58.46Z" />
        <polygon points="265.22 85.65 195.24 155.63 162.53 155.63 232.52 85.65 265.22 85.65" />
        <polygon points="296.55 0 226.92 69.62 194.22 69.62 263.84 0 296.55 0" />
      </g>
    </svg>
    <span class="word">
      <span class="w1">SEFIR</span>
      <span v-if="!compact" class="w2">PARFUM</span>
    </span>
  </span>
</template>

<style scoped>
.logo { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); }
.logo.light { color: #F3EFE7; }
.gem { width: 44px; height: 30px; flex: none; }
.word { display: grid; line-height: 1; }
.w1 { font-family: var(--f-display); font-weight: 700; font-size: 25px; letter-spacing: .14em; }
.w2 { font-size: 9px; font-weight: 600; letter-spacing: .52em; margin-top: 4px; color: var(--gold); }
.compact .w1 { font-size: 21px; }
.compact .gem { width: 38px; height: 26px; }
</style>

<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; size?: number | string; stroke?: number }>(), { size: 20, stroke: 1.5 })

const P: Record<string, string> = {
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-4-4',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  bag: 'M6 8h12l-1 12H7L6 8Zm3 0V7a3 3 0 0 1 6 0v1',
  menu: 'M4 7h16M4 12h16M4 17h10',
  close: 'M6 6l12 12M18 6 6 18',
  down: 'm6 9 6 6 6-6',
  right: 'm9 6 6 6-6 6',
  left: 'm15 6-6 6 6 6',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M5 7h14M10 7V5h4v2m-7 0 1 13h8l1-13',
  phone: 'M6 3h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z',
  pin: 'M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  check: 'm5 12 5 5 9-10',
  filter: 'M4 6h16M7 12h10M10 18h4',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  shield: 'M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Zm-3 9 2 2 4-4',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7S10 3 8 4s0 3 4 3Zm0 0s2-4 4-3 0 3-4 3Z',
  home: 'M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  telegram: 'M21 4 3 11l6 2 2 6 3-4 5 4 2-15ZM9 13l9-7',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm5-9.5v.01',
  youtube: 'M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8Zm7 1v6l5-3-5-3Z',
  facebook: 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8Z',
  tiktok: 'M14 3v11a3 3 0 1 1-3-3m3-8c.5 2.5 2.5 4.5 5 5',
  share: 'M16 6l-4-3-4 3M12 3v12M5 12v7h14v-7',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-11v6m0-9v.01',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z',
  zoom: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-4-4M11 8v6M8 11h6'
}
const d = computed(() => P[props.name] ?? '')
const fill = computed(() => props.name === 'heart-fill')
</script>

<template>
  <svg
    :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true"
    :fill="fill ? 'currentColor' : 'none'" stroke="currentColor" :stroke-width="stroke"
    stroke-linecap="round" stroke-linejoin="round"
  >
    <path v-if="name === 'heart-fill'" :d="P.heart" />
    <path v-else :d="d" />
  </svg>
</template>

<script setup lang="ts">
// Har bir atir uchun original SVG "studiya surati": flakon shakli, suyuqlik rangi va qopqoq mahsulot ma'lumotidan olinadi.
// Haqiqiy fotosuratlar kelganda shu komponent <img> bilan almashtiriladi.
import type { Product } from '~/lib/catalog'
import { brandName } from '~/lib/catalog'

// level: suyuqlik sathi 0..1 (hajm tanlanganda o'zgaradi); open: qopqoq ochiladi va hid izi ko'tariladi; wisps: hid izlarini chizish
const props = withDefaults(defineProps<{ product: Product; scene?: 'studio' | 'notes' | 'box' | 'mood'; rounded?: boolean; bare?: boolean; level?: number | null; open?: boolean; wisps?: boolean }>(), { scene: 'studio', rounded: false, bare: false, level: null, open: false, wisps: false })

const uid = useId()
const id = (s: string) => `${uid}-${s}`

function hexToRgb(h: string) {
  const n = parseInt(h.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function mix(h: string, w: string, t: number) {
  const a = hexToRgb(h), b = hexToRgb(w)
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
function lumOf(h: string) {
  const [r, g, b] = hexToRgb(h)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

const liquid = computed(() => props.product.art.liquid)
const isDark = computed(() => props.scene === 'mood')
const bgA = computed(() => (isDark.value ? mix(liquid.value, '#0b0f1c', 0.72) : mix(liquid.value, '#fbf8f2', 0.84)))
const bgB = computed(() => (isDark.value ? '#070a12' : mix(liquid.value, '#efe8dc', 0.7)))
const liqLight = computed(() => mix(liquid.value, '#ffffff', 0.35))
const liqDark = computed(() => mix(liquid.value, '#000000', 0.35))
const lightLiquid = computed(() => lumOf(liquid.value) > 0.72)

const capStops = computed(() => {
  switch (props.product.art.cap) {
    case 'gold': return ['#F3DFAE', '#C59A52', '#8A6427']
    case 'silver': return ['#F4F5F7', '#B8BDC6', '#7D838E']
    default: return ['#4A4C55', '#1A1B20', '#050506']
  }
})

const brand = computed(() => brandName(props.product.brand).toUpperCase())
// Yorliq matni yorliq eniga sig'adi: Onest qalin bosh harflar ~0,72em + 1,6 oraliq; Prata ~0,6em
const brandSize = computed(() => { const w = geo.value.label[2] - 14, n = brand.value.length; return Math.min(12 * (w + 14) / 120, Math.max(4, (w / n - 1.6) / 0.72)) })
const nameSize = computed(() => { const w = geo.value.label[2] - 16; return Math.min(17 * (w + 16) / 120, w / (props.product.name.length * 0.6)) })

// flakon geometriyasi (viewBox 400x400)
const geo = computed(() => {
  switch (props.product.art.shape) {
    case 'tall': return { body: 'M142 132h116a10 10 0 0 1 10 10v186a12 12 0 0 1-12 12H144a12 12 0 0 1-12-12V142a10 10 0 0 1 10-10Z', neck: [182, 116, 36, 18], cap: [168, 62, 64, 56, 6], label: [150, 236, 100, 58], liq: 150 }
    case 'round': return { body: 'M200 158c56 0 96 40 96 92s-40 92-96 92-96-40-96-92 40-92 96-92Z', neck: [182, 140, 36, 22], cap: [170, 92, 60, 50, 24], label: [146, 228, 108, 52], liq: 178 }
    case 'facet': return { body: 'M150 150h100l38 40v110l-38 40H150l-38-40V190l38-40Z', neck: [182, 132, 36, 20], cap: [160, 72, 80, 62, 8], label: [140, 232, 120, 56], liq: 168 }
    case 'slim': return { body: 'M160 120h80a8 8 0 0 1 8 8v204a8 8 0 0 1-8 8h-80a8 8 0 0 1-8-8V128a8 8 0 0 1 8-8Z', neck: [186, 104, 28, 18], cap: [178, 58, 44, 50, 4], label: [162, 210, 76, 74], liq: 136 }
    case 'orb': return { body: 'M200 168c62 0 104 34 104 80s-42 92-104 92-104-46-104-92 42-80 104-80Z', neck: [184, 148, 32, 22], cap: [160, 88, 80, 62, 40], label: [148, 234, 104, 50], liq: 186 }
    default: return { body: 'M128 150h144a12 12 0 0 1 12 12v166a12 12 0 0 1-12 12H128a12 12 0 0 1-12-12V162a12 12 0 0 1 12-12Z', neck: [180, 132, 40, 20], cap: [162, 74, 76, 60, 6], label: [140, 230, 120, 62], liq: 166 }
  }
})

// shisha tanasining yuqori cheti (suyuqlik sathini hisoblash uchun)
const BODY_TOP: Record<string, number> = { tall: 132, round: 158, facet: 150, slim: 120, orb: 168, square: 150 }
const liqShift = computed(() => {
  if (props.level == null) return 0
  const top = BODY_TOP[props.product.art.shape] ?? 150
  const y = top + (340 - top) * (1 - Math.min(1, Math.max(0, props.level)))
  return y - geo.value.liq
})
const wispPaths = computed(() => {
  const y = geo.value.neck[1]
  return [`M200 ${y} C 186 ${y - 24}, 214 ${y - 46}, 200 ${y - 70} S 192 ${y - 108}, 206 ${y - 130}`,
    `M190 ${y + 2} C 172 ${y - 22}, 196 ${y - 44}, 182 ${y - 66} S 172 ${y - 100}, 182 ${y - 120}`,
    `M210 ${y + 2} C 228 ${y - 22}, 204 ${y - 44}, 218 ${y - 66} S 228 ${y - 100}, 218 ${y - 120}`]
})

const noteDots = computed(() => {
  const keys = [...props.product.notes.top, ...props.product.notes.heart].slice(0, 4)
  const tones = ['#E9C46A', '#E76F51', '#8AB17D', '#B5838D', '#6D9DC5', '#D4A373']
  return keys.map((k, i) => ({ k, c: tones[(k.length + i) % tones.length], x: 70 + (i % 2) * 260, y: 120 + Math.floor(i / 2) * 150, r: 22 + (k.length % 3) * 6 }))
})
</script>

<template>
  <svg class="bottle-art" :class="{ rounded, open }" viewBox="0 0 400 400" role="img" :aria-label="`${brand} ${product.name}`" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient :id="id('bg')" cx="50%" cy="38%" r="75%">
        <stop offset="0" :stop-color="bgA" />
        <stop offset="1" :stop-color="bgB" />
      </radialGradient>
      <linearGradient :id="id('liq')" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" :stop-color="liqLight" />
        <stop offset=".55" :stop-color="liquid" />
        <stop offset="1" :stop-color="liqDark" />
      </linearGradient>
      <linearGradient :id="id('glass')" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".55" />
        <stop offset=".18" stop-color="#fff" stop-opacity=".08" />
        <stop offset=".8" stop-color="#fff" stop-opacity="0" />
        <stop offset="1" stop-color="#fff" stop-opacity=".3" />
      </linearGradient>
      <linearGradient :id="id('cap')" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" :stop-color="capStops[2]" />
        <stop offset=".35" :stop-color="capStops[0]" />
        <stop offset=".7" :stop-color="capStops[1]" />
        <stop offset="1" :stop-color="capStops[2]" />
      </linearGradient>
      <radialGradient :id="id('floor')" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#000" :stop-opacity="isDark ? .55 : .22" />
        <stop offset="1" stop-color="#000" stop-opacity="0" />
      </radialGradient>
      <clipPath :id="id('body')"><path :d="geo.body" /></clipPath>
      <filter :id="id('blur')"><feGaussianBlur stdDeviation="18" /></filter>
    </defs>

    <rect v-if="!bare" width="400" height="400" :fill="`url(#${id('bg')})`" />

    <!-- sahna bezaklari -->
    <g v-if="bare" />
    <g v-else-if="scene === 'studio'">
      <rect x="0" y="318" width="400" height="82" :fill="isDark ? '#000' : '#fff'" opacity=".22" />
      <circle cx="318" cy="92" r="60" :fill="liqLight" opacity=".35" :filter="`url(#${id('blur')})`" />
    </g>
    <g v-else-if="scene === 'notes'">
      <circle v-for="d in noteDots" :key="d.k" :cx="d.x" :cy="d.y" :r="d.r" :fill="d.c" opacity=".55" />
      <circle v-for="d in noteDots" :key="d.k + 'b'" :cx="d.x + 8" :cy="d.y - 6" :r="d.r / 3" fill="#fff" opacity=".5" />
    </g>
    <g v-else-if="scene === 'box'">
      <rect x="236" y="120" width="128" height="214" rx="4" :fill="mix(liquid, '#1a1a1a', .55)" />
      <rect x="248" y="132" width="104" height="190" rx="2" fill="none" stroke="#d8c3a0" stroke-width="1" opacity=".8" />
      <text x="300" y="232" text-anchor="middle" fill="#d8c3a0" font-family="Prata, serif" font-size="13" letter-spacing="3">{{ brand.split(' ')[0] }}</text>
    </g>
    <g v-else>
      <circle cx="200" cy="170" r="140" :fill="liquid" opacity=".18" :filter="`url(#${id('blur')})`" />
      <path d="M0 330 Q200 300 400 330 V400 H0Z" fill="#000" opacity=".4" />
    </g>

    <g :transform="scene === 'box' ? 'translate(-56 6) scale(.96)' : ''">
      <!-- soya -->
      <ellipse cx="200" cy="344" rx="104" ry="14" :fill="`url(#${id('floor')})`" />
      <!-- hid izlari (qopqoq ochilganda ko'tariladi) -->
      <g v-if="wisps" class="wisps" aria-hidden="true">
        <path v-for="(d, i) in wispPaths" :key="i" class="wisp" :d="d" :stroke="liqLight" />
      </g>
      <!-- bo'yin va qopqoq -->
      <rect :x="geo.neck[0]" :y="geo.neck[1]" :width="geo.neck[2]" :height="geo.neck[3]" :fill="capStops[1]" opacity=".9" />
      <g class="cap">
        <rect :x="geo.cap[0]" :y="geo.cap[1]" :width="geo.cap[2]" :height="geo.cap[3]" :rx="geo.cap[4]" :fill="`url(#${id('cap')})`" />
        <rect :x="geo.cap[0] + 6" :y="geo.cap[1] + 4" :width="6" :height="geo.cap[3] - 8" rx="3" fill="#fff" opacity=".35" />
      </g>
      <!-- shisha -->
      <path :d="geo.body" :fill="isDark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.45)'" />
      <g :clip-path="`url(#${id('body')})`">
        <g class="liq" :style="{ transform: `translateY(${liqShift}px)` }">
          <rect x="80" :y="geo.liq" width="240" height="260" :fill="`url(#${id('liq')})`" />
          <rect x="80" :y="geo.liq" width="240" height="4" fill="#fff" opacity=".35" />
        </g>
        <rect x="80" y="100" width="240" height="260" :fill="`url(#${id('glass')})`" />
      </g>
      <path :d="geo.body" fill="none" :stroke="isDark ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.9)'" stroke-width="2" />
      <path :d="geo.body" fill="none" stroke="rgba(0,0,0,.12)" stroke-width=".8" />
      <!-- yorliq -->
      <g>
        <rect :x="geo.label[0]" :y="geo.label[1]" :width="geo.label[2]" :height="geo.label[3]" rx="2"
          :fill="lightLiquid ? 'rgba(18,19,24,.88)' : 'rgba(255,253,249,.92)'" />
        <rect :x="geo.label[0] + 4" :y="geo.label[1] + 4" :width="geo.label[2] - 8" :height="geo.label[3] - 8" rx="1" fill="none"
          :stroke="lightLiquid ? '#d8c3a0' : '#a8844f'" stroke-width=".6" opacity=".9" />
        <text :x="200" :y="geo.label[1] + geo.label[3] * .42" text-anchor="middle"
          :fill="lightLiquid ? '#F3EFE7' : '#121318'" font-family="Onest, sans-serif" font-weight="700"
          :font-size="brandSize" letter-spacing="1.6">{{ brand }}</text>
        <text :x="200" :y="geo.label[1] + geo.label[3] * .76" text-anchor="middle"
          :fill="lightLiquid ? '#d8c3a0' : '#3b3d45'" font-family="Prata, serif"
          :font-size="nameSize">{{ product.name }}</text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.bottle-art { width: 100%; height: 100%; display: block; overflow: visible; }
.bottle-art.rounded { border-radius: var(--r); }
.liq { transition: transform .8s var(--ease); }
.cap { transition: transform .6s var(--ease); transform-box: fill-box; transform-origin: 0% 100%; }
.open .cap { transform: translate(52px, -46px) rotate(22deg); }
.wisp { fill: none; stroke-width: 3.2; stroke-linecap: round; opacity: 0; stroke-dasharray: 140; stroke-dashoffset: 140; }
.open .wisp { animation: wisp 2.4s ease-out .35s infinite; }
.open .wisp:nth-child(2) { animation-delay: .9s; }
.open .wisp:nth-child(3) { animation-delay: 1.45s; }
@keyframes wisp {
  0% { opacity: 0; stroke-dashoffset: 140; transform: translateY(0); }
  25% { opacity: .85; }
  100% { opacity: 0; stroke-dashoffset: -80; transform: translateY(-30px); }
}
@media (prefers-reduced-motion: reduce) { .open .wisp { animation: none; } }
</style>

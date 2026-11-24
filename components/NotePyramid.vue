<script setup lang="ts">
import { useL } from '~/lib/catalog'

// Hid piramidasi: ko'ringanda qavatlar yuqoridan pastga (hid ochilish tartibida) chiqadi,
// chap tomondagi vaqt chizig'i o'sadi, notalar birin-ketin paydo bo'ladi.
// Faqat transform/opacity. JS bo'lmasa yoki reduced-motion'da hammasi darhol ko'rinadi.
const props = defineProps<{ notes: { top: string[]; heart: string[]; base: string[] } }>()
const { t } = useI18n()
const { noteL } = useL()
const tiers = computed(() => (['top', 'heart', 'base'] as const).map(k => ({ k, list: props.notes[k].map(noteL) })))

const root = ref<HTMLElement | null>(null)
const armed = ref(false) // animatsiyaga tayyor (yashirin holat)
const shown = ref(false)
let io: IntersectionObserver | null = null
onMounted(() => {
  const el = root.value
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
  const r = el.getBoundingClientRect()
  if (r.top < innerHeight * 0.85) return // allaqachon ko'rinib turibdi
  armed.value = true
  io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { shown.value = true; io?.disconnect() } }, { threshold: 0.35 })
  io.observe(el)
})
onBeforeUnmount(() => io?.disconnect())
// mahsulot almashsa (o'xshash atirga o'tish) animatsiyani qayta ishlatmaymiz
watch(() => props.notes, () => { armed.value = false })
</script>

<template>
  <section ref="root" class="pyr" :class="{ armed, shown }" :aria-label="t('product.pyramid')">
    <h2 class="h3">{{ t('product.pyramid') }}</h2>
    <p class="hint">{{ t('product.pyrHint') }}</p>
    <div class="body">
      <span class="line" aria-hidden="true"><i /></span>
      <div v-for="(x, n) in tiers" :key="x.k" class="tier" :class="`t${n + 1}`" :style="{ '--d': n * 0.32 + 's' }">
        <span class="dot" aria-hidden="true" />
        <div class="head"><span class="tn">{{ t(`product.${x.k}`) }}</span><span class="tm">{{ t(`product.pyrTime.${x.k}`) }}</span></div>
        <ul class="chips">
          <li v-for="(nm, j) in x.list" :key="nm" :style="{ '--j': j }">{{ nm }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pyr { display: grid; gap: 8px; align-content: start; min-width: 0; }
.hint { font-size: 13px; color: var(--muted); margin: -4px 0 6px; }
.body { position: relative; display: grid; gap: 10px; padding-left: 22px; }
.line { position: absolute; left: 6px; top: 18px; bottom: 18px; width: 2px; border-radius: 1px; background: var(--line); overflow: hidden; }
.line i { position: absolute; inset: 0; background: linear-gradient(180deg, var(--champagne), var(--sapphire) 55%, var(--night)); transform-origin: 50% 0; }
.tier { position: relative; display: grid; gap: 8px; padding: 14px 16px; border-radius: 14px; background: var(--surface); border: 1px solid var(--line); min-width: 0; }
.dot { position: absolute; left: -21px; top: 19px; width: 10px; height: 10px; border-radius: 50%; background: var(--surface); border: 2px solid var(--champagne); }
.t2 .dot { border-color: var(--sapphire); }
.t3 .dot { border-color: var(--night); background: var(--night); }
.head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.tn { font-size: 12.5px; color: var(--muted); font-weight: 600; }
.tm { font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.chips li { font-family: var(--f-display); font-size: 16px; line-height: 1.2; text-transform: capitalize; padding: 5px 11px; border-radius: 999px; background: var(--bg); border: 1px solid var(--line); }
.t3 { background: var(--night); border-color: var(--night); color: #F2F3F6; }
.t3 .tn, .t3 .tm { color: var(--champagne); }
.t3 .chips li { background: rgba(255, 255, 255, .06); border-color: rgba(255, 255, 255, .14); }

/* animatsiya: faqat .armed bo'lsa yashiramiz, .shown bilan ochamiz */
.armed .line i { transform: scaleY(0); }
.armed .tier { opacity: 0; transform: translateY(14px); }
.armed .chips li { opacity: 0; transform: translateY(8px) scale(.94); }
.armed .dot { transform: scale(0); }
.armed.shown .line i { transform: none; transition: transform 1.3s var(--ease); }
.armed.shown .tier { opacity: 1; transform: none; transition: opacity .6s var(--ease) var(--d), transform .6s var(--ease) var(--d); }
.armed.shown .dot { transform: none; transition: transform .4s var(--ease) calc(var(--d) + .1s); }
.armed.shown .chips li { opacity: 1; transform: none; transition: opacity .45s var(--ease) calc(var(--d) + .2s + var(--j) * .07s), transform .45s var(--ease) calc(var(--d) + .2s + var(--j) * .07s); }
</style>

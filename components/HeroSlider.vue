<script setup lang="ts">
// Bosh banner: mijoz suratlari. Birinchi slaydda saytga kirganda atir flakon qopqog'idan sepiladi (sessiyada bir marta).
import { banners, useL } from '~/lib/catalog'
const { L } = useL()
const { t } = useI18n()
const lp = useLocalePath()
const i = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
const n = banners.length
const go = (k: number) => (i.value = (k + n) % n)
onMounted(() => { timer = setInterval(() => { if (!paused.value) go(i.value + 1) }, 6500) })
onBeforeUnmount(() => clearInterval(timer))

let x0 = 0
const ts = (e: TouchEvent) => (x0 = e.touches[0].clientX)
const te = (e: TouchEvent) => { const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) go(i.value + (d < 0 ? 1 : -1)) }
const pos = (b: (typeof banners)[number]) => `${b.focal[0] * 100}% ${b.focal[1] * 100}%`

// ---------- Kirishda atir sepilishi ----------
// Sahifa chizilishidan oldin <html> ga "sp-intro" qo'yiladi — sarlavha avval ko'rinib, keyin yashirinmasligi uchun.
useHead({
  script: [{
    key: 'sp-intro',
    innerHTML: "try{if(!sessionStorage.getItem('sp-sprayed')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('sp-intro')}catch(e){}"
  }]
})
const stage = ref<HTMLElement | null>(null)
const mist = ref<HTMLCanvasElement | null>(null)
const intro = ref(false)
let raf = 0
let introTimer: ReturnType<typeof setTimeout> | undefined

function endIntro() {
  cancelAnimationFrame(raf)
  clearTimeout(introTimer)
  const c = mist.value
  c?.getContext('2d')?.clearRect(0, 0, c.width, c.height)
  intro.value = false
  paused.value = false
  document.documentElement.classList.remove('sp-intro')
  try { sessionStorage.setItem('sp-sprayed', '1') } catch { /* noop */ }
}

/** object-fit: cover bilan chizilgan suratdagi nuqtaning ekrandagi joyi */
function pointOnCover(img: HTMLImageElement, fx: number, fy: number, px: number, py: number) {
  const r = img.getBoundingClientRect()
  const nw = img.naturalWidth || 1086, nh = img.naturalHeight || 1448
  const s = Math.max(r.width / nw, r.height / nh)
  const w = nw * s, h = nh * s
  return { x: r.left + (r.width - w) * px + fx * w, y: r.top + (r.height - h) * py + fy * h }
}

function spray() {
  const b = banners[0]
  const c = mist.value, st = stage.value
  const img = st?.querySelector<HTMLImageElement>('.slide[data-k="0"] .photo img')
  if (!c || !st || !img || !b.nozzle) return endIntro()
  intro.value = true
  paused.value = true
  const ctx = c.getContext('2d')!
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const W = c.clientWidth, H = c.clientHeight
  c.width = W * dpr; c.height = H * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const sb = st.getBoundingClientRect()
  const p = pointOnCover(img, b.nozzle[0], b.nozzle[1], b.focal[0], b.focal[1])
  const nx = p.x - sb.left, ny = p.y - sb.top
  const copy = st.querySelector('.slide[data-k="0"] .copy')!.getBoundingClientRect()
  const tx = copy.left - sb.left + copy.width * 0.55, ty = copy.top - sb.top + copy.height * 0.35
  const base = Math.atan2(ty - ny, tx - nx)

  const sprite = document.createElement('canvas'); sprite.width = sprite.height = 64
  const g = sprite.getContext('2d')!
  const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  rg.addColorStop(0, 'rgba(255,255,255,.9)'); rg.addColorStop(0.45, b.mist + '55'); rg.addColorStop(1, b.mist + '00')
  g.fillStyle = rg; g.fillRect(0, 0, 64, 64)

  const t0 = performance.now() + 250
  const parts = Array.from({ length: W < 600 ? 130 : 210 }, () => {
    const a = base + (Math.random() - 0.5) * 0.9, sp = 2.2 + Math.random() * 7.5
    return { x: nx, y: ny, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 6 + Math.random() * 16, born: t0 + Math.random() * 450, life: 1050 + Math.random() * 700 }
  })
  const draw = (now: number) => {
    ctx.clearRect(0, 0, W, H)
    let alive = 0
    for (const q of parts) {
      const tt = now - q.born
      if (tt < 0) { alive++; continue }
      if (tt > q.life) continue
      alive++
      q.x += q.vx; q.y += q.vy; q.vx *= 0.962; q.vy = q.vy * 0.962 - 0.03; q.r += 1
      ctx.globalAlpha = Math.min(1, tt / 110) * (1 - tt / q.life) * 0.55
      ctx.drawImage(sprite, q.x - q.r, q.y - q.r, q.r * 2, q.r * 2)
    }
    ctx.globalAlpha = 1
    if (alive) raf = requestAnimationFrame(draw)
  }
  raf = requestAnimationFrame(draw)
}

function startIntro() {
  // ?spray — sepilishni qayta ko'rsatish (mijozga namoyish va sinov uchun)
  const force = new URLSearchParams(location.search).has('spray')
  let seen = true
  try { seen = !!sessionStorage.getItem('sp-sprayed') } catch { /* noop */ }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!force && (seen || reduce)) { document.documentElement.classList.remove('sp-intro'); return }
  document.documentElement.classList.add('sp-intro')
  if ((!force && document.hidden) || i.value !== 0) return endIntro()
  introTimer = setTimeout(endIntro, 2600) // himoya: nima bo'lsa ham sarlavha ko'rinadi
  const img = stage.value?.querySelector<HTMLImageElement>('.slide[data-k="0"] .photo img')
  // surat o'lchami ma'lum bo'lgach sepamiz (nozzle nuqtasini aniq hisoblash uchun)
  if (img && !img.complete) img.addEventListener('load', () => spray(), { once: true })
  else setTimeout(spray, 60)
}
onMounted(startIntro)
onBeforeUnmount(() => { cancelAnimationFrame(raf); clearTimeout(introTimer); document.documentElement.classList.remove('sp-intro') })
</script>

<template>
  <section class="hero wrap" @mouseenter="paused = true" @mouseleave="paused = false" @touchstart.passive="ts" @touchend="te">
    <div ref="stage" class="stage" :class="{ intro }">
      <canvas ref="mist" class="mist" aria-hidden="true" />
      <button v-if="intro" class="skip" @click="endIntro">{{ t('common.skip') }}</button>
      <TransitionGroup name="xf">
        <div
          v-for="(b, k) in banners" v-show="k === i" :key="b.id" class="slide" :class="b.theme" :data-k="k"
          :style="{ '--a': b.panel[0], '--b': b.panel[1] }"
        >
          <div class="photo">
            <img
              :src="`${b.photo}-sm.webp`" :srcset="`${b.photo}-sm.webp 640w, ${b.photo}.webp 1100w`"
              sizes="(max-width: 767px) 100vw, 60vw" :alt="L(b.title)" :style="{ objectPosition: pos(b) }"
              :loading="k === 0 ? 'eager' : 'lazy'" :fetchpriority="k === 0 ? 'high' : 'auto'" decoding="async" width="1100" height="1467"
            >
          </div>
          <div class="copy">
            <component :is="k === 0 ? 'h1' : 'h2'" class="h1 title">{{ L(b.title) }}</component>
            <p class="sub">{{ L(b.text) }}</p>
            <NuxtLink :to="lp(b.to)" class="btn" :class="b.theme === 'dark' ? 'champagne' : ''">{{ L(b.cta) }}</NuxtLink>
          </div>
        </div>
      </TransitionGroup>

      <div class="ctrl" :class="banners[i].theme">
        <button class="arr" aria-label="←" @click="go(i - 1)"><Icon name="left" :size="18" /></button>
        <div class="dots">
          <button v-for="(b, k) in banners" :key="b.id" :class="{ on: k === i }" :aria-label="`${k + 1}`" @click="go(k)"><span /></button>
        </div>
        <button class="arr" aria-label="→" @click="go(i + 1)"><Icon name="right" :size="18" /></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { padding-top: 20px; }
.stage { position: relative; height: clamp(440px, 44vw, 560px); border-radius: 26px; overflow: hidden; background: var(--night); }
.slide { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 42%) minmax(0, 1fr); background: linear-gradient(135deg, var(--a), var(--b)); }
.slide.dark { color: #F2F3F6; }
.slide.light { color: var(--ink); }
/* surat o'ng tomonda, chap cheti panel rangiga yumshoq qo'shiladi */
.photo { grid-column: 2; position: relative; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 22%); mask-image: linear-gradient(90deg, transparent 0, #000 22%); }
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.copy { grid-column: 1; grid-row: 1; align-self: center; padding: 0 0 48px clamp(28px, 5vw, 72px); display: grid; gap: 18px; justify-items: start; position: relative; z-index: 2; }
.title { font-size: clamp(38px, 4.8vw, 68px); }
.sub { font-size: 16px; max-width: 36ch; opacity: .85; }

.mist { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 4; pointer-events: none; }
.skip { position: absolute; top: 14px; right: 14px; z-index: 6; border: 0; border-radius: 999px; padding: 7px 14px; font-size: 12.5px; font-weight: 600; color: var(--ink); background: rgba(250, 250, 251, .82); backdrop-filter: blur(6px); }
/* kirish: sarlavha tuman orasidan chiqadi */
.intro .slide[data-k="0"] .copy > * { animation: copy-in .8s var(--ease) both; }
.intro .slide[data-k="0"] .copy > :nth-child(1) { animation-delay: .95s; }
.intro .slide[data-k="0"] .copy > :nth-child(2) { animation-delay: 1.12s; }
.intro .slide[data-k="0"] .copy > :nth-child(3) { animation-delay: 1.28s; }
.intro .ctrl { animation: copy-in .5s var(--ease) 1.5s both; }
@keyframes copy-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }

.ctrl { position: absolute; left: clamp(28px, 5vw, 72px); bottom: 26px; display: flex; align-items: center; gap: 14px; z-index: 3; }
.arr { width: 42px; height: 42px; border-radius: 50%; border: 0; background: rgba(255, 253, 249, .85); color: var(--ink); display: grid; place-items: center; backdrop-filter: blur(4px); }
.dots { display: flex; gap: 6px; }
.dots button { width: 34px; height: 20px; border: 0; background: transparent; padding: 0; display: grid; place-items: center; }
.dots span { display: block; width: 100%; height: 2px; border-radius: 1px; background: rgba(20, 33, 61, .25); transition: background .3s; }
.dots .on span { background: var(--ink); }
.ctrl.dark .dots span { background: rgba(255, 255, 255, .3); }
.ctrl.dark .dots .on span { background: #fff; }

.xf-enter-active, .xf-leave-active { transition: opacity .8s var(--ease); }
.xf-enter-from, .xf-leave-to { opacity: 0; }
.xf-enter-active .photo img { animation: settle 1.4s var(--ease) both; }
@keyframes settle { from { transform: scale(1.06); } }

@media (max-width: 767px) {
  .hero { padding-top: 12px; }
  /* banner telefonning ko'rinadigan qismiga sig'adi: ekran − header − pastki panel */
  .stage { height: clamp(420px, calc(100vh - var(--header-h) - 64px - 28px), 560px); height: clamp(420px, calc(100svh - var(--header-h) - 64px - env(safe-area-inset-bottom, 0px) - 28px), 560px); border-radius: 20px; }
  /* surat butun banner foni, matn ustida */
  .slide { grid-template-columns: 1fr; grid-template-rows: 1fr; }
  .photo { grid-column: 1; grid-row: 1; -webkit-mask-image: none; mask-image: none; }
  .photo::after { content: ''; position: absolute; inset: 0; pointer-events: none; }
  .slide.dark .photo::after { background: linear-gradient(180deg, rgba(5, 5, 7, .82) 0%, rgba(5, 5, 7, .35) 34%, transparent 52%, rgba(5, 5, 7, .55) 100%); }
  .slide.light .photo::after { background: linear-gradient(180deg, rgba(250, 238, 232, .92) 0%, rgba(250, 238, 232, .55) 32%, transparent 50%, rgba(40, 20, 15, .25) 100%); }
  .copy { grid-row: 1; align-self: start; padding: 24px 20px 0; gap: 10px; }
  .title { font-size: clamp(30px, 9vw, 40px); }
  .sub { font-size: 14px; }
  .copy .btn { height: 44px; padding: 0 20px; }
  .ctrl { left: 18px; bottom: 14px; }
  .arr { width: 38px; height: 38px; }
}
</style>

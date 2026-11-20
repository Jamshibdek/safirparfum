<script setup lang="ts">
import { banners, getProduct, useL } from '~/lib/catalog'
const { L } = useL()
const lp = useLocalePath()
const i = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
const n = banners.length
const go = (k: number) => (i.value = (k + n) % n)
onMounted(() => { timer = setInterval(() => { if (!paused.value) go(i.value + 1) }, 6000) })
onBeforeUnmount(() => clearInterval(timer))

let x0 = 0
const ts = (e: TouchEvent) => (x0 = e.touches[0].clientX)
const te = (e: TouchEvent) => { const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) go(i.value + (d < 0 ? 1 : -1)) }

const trio = ['dior-sauvage-elixir', 'chanel-coco-mademoiselle', 'maison-francis-kurkdjian-baccarat-rouge-540'].map(s => getProduct(s)!)
const night = getProduct('initio-oud-for-greatness')!
const night2 = getProduct('tom-ford-tobacco-vanille')!
const sale = ['versace-eros', 'versace-bright-crystal', 'montale-arabians-tonka'].map(s => getProduct(s)!)
</script>

<template>
  <section class="hero wrap" @mouseenter="paused = true" @mouseleave="paused = false" @touchstart.passive="ts" @touchend="te">
    <div class="stage">
      <TransitionGroup name="xf">
        <div v-for="(b, k) in banners" v-show="k === i" :key="b.id" class="slide" :class="b.scene" :style="{ '--a': b.tone[0], '--b': b.tone[1] }">
          <div class="copy">
            <component :is="k === 0 ? 'h1' : 'h2'" class="h1 title">{{ L(b.title) }}</component>
            <p class="sub">{{ L(b.text) }}</p>
            <NuxtLink :to="lp(b.to)" class="btn" :class="b.scene === 'night' ? 'champagne' : ''">{{ L(b.cta) }}</NuxtLink>
          </div>
          <div class="art" aria-hidden="true">
            <template v-if="b.scene === 'trio'">
              <div class="plinth" />
              <div class="bt b1"><BottleArt :product="trio[0]" bare /></div>
              <div class="bt b2"><BottleArt :product="trio[1]" bare /></div>
              <div class="bt b3"><BottleArt :product="trio[2]" bare /></div>
            </template>
            <template v-else-if="b.scene === 'night'">
              <div class="moon" />
              <div class="bt n1"><BottleArt :product="night" bare /></div>
              <div class="bt n2"><BottleArt :product="night2" bare /></div>
            </template>
            <template v-else>
              <div class="tag display">−30%</div>
              <div class="bt s1"><BottleArt :product="sale[0]" bare /></div>
              <div class="bt s2"><BottleArt :product="sale[1]" bare /></div>
              <div class="bt s3"><BottleArt :product="sale[2]" bare /></div>
            </template>
          </div>
        </div>
      </TransitionGroup>

      <div class="ctrl">
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
.stage { position: relative; height: clamp(440px, 46vw, 560px); border-radius: 26px; overflow: hidden; background: var(--bg-2); }
.slide { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1.05fr; align-items: center; background: radial-gradient(120% 120% at 75% 40%, var(--a), var(--b)); }
.slide.night { color: #F3EFE7; }
.copy { padding: 0 0 40px clamp(28px, 5vw, 72px); display: grid; gap: 18px; justify-items: start; max-width: 560px; position: relative; z-index: 2; }
.title { font-size: clamp(40px, 5.4vw, 76px); }
.sub { font-size: 16px; max-width: 40ch; opacity: .82; }
.art { position: relative; height: 100%; }
.bt { position: absolute; filter: drop-shadow(0 30px 30px rgba(14, 26, 51, .28)); }
.plinth { position: absolute; left: 6%; right: 10%; bottom: 12%; height: 18%; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(255, 255, 255, .7), transparent 70%); }
.b1 { width: 60%; left: -6%; bottom: 8%; transform: rotate(-4deg); }
.b2 { width: 70%; left: 20%; bottom: 13%; z-index: 2; }
.b3 { width: 58%; left: 48%; bottom: 7%; transform: rotate(5deg); }
.moon { position: absolute; width: 58%; aspect-ratio: 1; right: 16%; top: 10%; border-radius: 50%; background: radial-gradient(circle at 35% 35%, rgba(216, 195, 160, .55), rgba(216, 195, 160, .06) 62%, transparent 70%); }
.n1 { width: 74%; left: 14%; bottom: 4%; z-index: 2; }
.n2 { width: 58%; left: 50%; bottom: 8%; opacity: .92; }
.tag { position: absolute; right: 8%; top: 10%; font-size: clamp(64px, 9vw, 132px); color: var(--sale); font-weight: 700; line-height: 1; transform: rotate(-6deg); }
.s1 { width: 58%; left: 4%; bottom: 6%; }
.s2 { width: 64%; left: 22%; bottom: 11%; z-index: 2; }
.s3 { width: 56%; left: 50%; bottom: 5%; }

.ctrl { position: absolute; left: clamp(28px, 5vw, 72px); bottom: 26px; display: flex; align-items: center; gap: 14px; z-index: 3; }
.arr { width: 42px; height: 42px; border-radius: 50%; border: 0; background: rgba(255, 253, 249, .85); display: grid; place-items: center; backdrop-filter: blur(4px); }
.dots { display: flex; gap: 6px; }
.dots button { width: 34px; height: 20px; border: 0; background: transparent; padding: 0; display: grid; place-items: center; }
.dots span { display: block; width: 100%; height: 2px; background: rgba(18, 19, 24, .25); border-radius: 1px; transition: background .3s; }
.dots .on span { background: var(--ink); }
.slide.night ~ .ctrl .dots span { background: rgba(255, 255, 255, .3); }

.xf-enter-active, .xf-leave-active { transition: opacity .8s var(--ease); }
.xf-enter-from, .xf-leave-to { opacity: 0; }
.xf-enter-active .bt { animation: rise .9s var(--ease) both; }
.xf-enter-active .b2, .xf-enter-active .s2, .xf-enter-active .n2 { animation-delay: .08s; }
.xf-enter-active .b3, .xf-enter-active .s3 { animation-delay: .16s; }
@keyframes rise { from { opacity: 0; translate: 0 26px; } }

@media (max-width: 767px) {
  .hero { padding-top: 12px; }
  .stage { height: 560px; border-radius: 20px; }
  .slide { grid-template-columns: 1fr; grid-template-rows: auto 1fr; align-items: start; }
  .copy { padding: 30px 22px 0; gap: 12px; }
  .title { font-size: 38px; }
  .sub { font-size: 14.5px; }
  .art { height: 100%; }
  .ctrl { left: 22px; bottom: 18px; }
}
</style>

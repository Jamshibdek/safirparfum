<script setup lang="ts">
// Telefon ekraniga o'xshash kichik video oyna (Reels uslubi).
// Ovozsiz, o'zi aylanadi; faqat ekranda ko'ringanda yuklanadi va o'ynaydi; bir nechta video bo'lsa ketma-ket.
// Bosilsa katta (to'liq ekran) ochiladi.
const props = defineProps<{ videos: string[]; title: string }>()
const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const vid = ref<HTMLVideoElement | null>(null)
const big = ref<HTMLVideoElement | null>(null)
const i = ref(0)
const active = ref(false)   // ekranda ko'rinyaptimi
const loaded = ref(false)   // src qo'yildimi (birinchi ko'rinishda)
const progress = ref(0)
const expanded = ref(false)
const reduce = ref(false)
const src = (k: number) => `${props.videos[k]}.mp4`
const poster = (k: number) => `${props.videos[k]}.webp`

function play(el: HTMLVideoElement | null) { el?.play().catch(() => { /* brauzer avtoijroni rad etsa — poster qoladi */ }) }
function onTime(e: Event) {
  const v = e.target as HTMLVideoElement
  progress.value = v.duration ? v.currentTime / v.duration : 0
}
function next() {
  if (props.videos.length < 2) return
  i.value = (i.value + 1) % props.videos.length
  progress.value = 0
  nextTick(() => play(expanded.value ? big.value : vid.value))
}
function go(k: number) { i.value = k; progress.value = 0; nextTick(() => play(expanded.value ? big.value : vid.value)) }

function open() {
  expanded.value = true
  vid.value?.pause()
  nextTick(() => { if (big.value) { big.value.currentTime = vid.value?.currentTime ?? 0; play(big.value) } })
}
function close() {
  expanded.value = false
  nextTick(() => { if (active.value && !reduce.value) play(vid.value) })
}
function key(e: KeyboardEvent) { if (e.key === 'Escape' && expanded.value) close() }

let io: IntersectionObserver | null = null
onMounted(() => {
  reduce.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('keydown', key)
  if (!root.value || !('IntersectionObserver' in window)) { loaded.value = true; return }
  io = new IntersectionObserver(([e]) => {
    active.value = e.isIntersecting
    if (e.isIntersecting) {
      loaded.value = true
      if (!reduce.value) nextTick(() => play(vid.value))
    } else vid.value?.pause()
  }, { threshold: 0.35 })
  io.observe(root.value)
})
onBeforeUnmount(() => { io?.disconnect(); document.removeEventListener('keydown', key); document.documentElement.style.overflow = '' })
watch(expanded, v => { document.documentElement.style.overflow = v ? 'hidden' : '' })
watch(() => props.videos, () => { i.value = 0; progress.value = 0 })
</script>

<template>
  <div ref="root" class="reel">
    <button class="phone" :aria-label="`${title} — ${t('product.video')}`" @click="open">
      <span class="notch" aria-hidden="true" />
      <video
        ref="vid" class="screen" :src="loaded ? src(i) : undefined" :poster="poster(i)"
        muted playsinline :loop="videos.length < 2" preload="none"
        @timeupdate="onTime" @ended="next"
      />
      <span v-if="videos.length > 1" class="bars" aria-hidden="true">
        <i v-for="(v, k) in videos" :key="v"><b :style="{ width: (k < i ? 1 : k === i ? progress : 0) * 100 + '%' }" /></i>
      </span>
      <span class="tag"><Icon name="play" :size="10" />{{ t('product.video') }}</span>
      <span class="exp" aria-hidden="true"><Icon name="expand" :size="14" /></span>
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="expanded" class="lb" role="dialog" aria-modal="true" :aria-label="title" @click.self="close">
          <div class="big-phone">
            <video
              ref="big" class="big-screen" :src="src(i)" :poster="poster(i)" muted playsinline autoplay
              :loop="videos.length < 2" @timeupdate="onTime" @ended="next"
            />
            <span v-if="videos.length > 1" class="bars big" aria-hidden="true">
              <i v-for="(v, k) in videos" :key="v"><b :style="{ width: (k < i ? 1 : k === i ? progress : 0) * 100 + '%' }" /></i>
            </span>
            <p class="cap">{{ title }}</p>
            <div class="ctl">
              <button v-if="videos.length > 1" class="icon-btn" :aria-label="t('quiz.next')" @click="next"><Icon name="right" :size="18" /></button>
            </div>
            <div v-if="videos.length > 1" class="dots">
              <button v-for="(v, k) in videos" :key="v" :class="{ on: k === i }" :aria-label="`${k + 1}`" @click="go(k)" />
            </div>
          </div>
          <button class="icon-btn x" :aria-label="t('common.close')" @click="close"><Icon name="close" /></button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.reel { width: 100%; }
.phone {
  position: relative; display: block; width: 100%; aspect-ratio: 9 / 19; padding: 6px; border: 0; border-radius: 30px;
  background: #0B0F1A; box-shadow: 0 30px 60px -24px rgba(11, 22, 49, .6), inset 0 0 0 1.5px #2A3142; cursor: zoom-in;
  transition: transform .4s var(--ease);
}
.phone:hover { transform: translateY(-3px) rotate(-1deg); }
.notch { position: absolute; top: 12px; left: 50%; width: 34%; height: 16px; margin-left: -17%; border-radius: 10px; background: #0B0F1A; z-index: 2; }
.screen { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; background: #1a1f2b; display: block; }
.bars { position: absolute; left: 14px; right: 14px; top: 34px; display: flex; gap: 3px; z-index: 2; }
.bars i { flex: 1; height: 2px; border-radius: 1px; background: rgba(255, 255, 255, .35); overflow: hidden; }
.bars b { display: block; height: 100%; background: #fff; }
.tag { position: absolute; left: 14px; bottom: 16px; display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; background: rgba(0, 0, 0, .45); color: #fff; font-size: 10.5px; font-weight: 600; z-index: 2; }
.exp { position: absolute; right: 14px; bottom: 14px; width: 26px; height: 26px; border-radius: 50%; background: rgba(0, 0, 0, .45); color: #fff; display: grid; place-items: center; z-index: 2; }

.lb { position: fixed; inset: 0; z-index: 130; background: rgba(6, 10, 22, .9); display: grid; place-items: center; padding: 20px; }
.big-phone { position: relative; height: min(86vh, 820px); aspect-ratio: 9 / 16; max-width: calc(100vw - 32px); border-radius: 22px; overflow: hidden; background: #000; }
.big-screen { width: 100%; height: 100%; object-fit: cover; display: block; }
.bars.big { top: 12px; }
.cap { position: absolute; left: 16px; bottom: 18px; right: 110px; color: #fff; font-family: var(--f-display); font-size: 22px; line-height: 1.1; text-shadow: 0 2px 12px rgba(0, 0, 0, .6); }
.ctl { position: absolute; right: 12px; bottom: 12px; display: flex; gap: 6px; }
.ctl .icon-btn { background: rgba(0, 0, 0, .45); color: #fff; }
.dots { position: absolute; left: 0; right: 0; top: 22px; display: flex; justify-content: center; gap: 6px; }
.dots button { width: 7px; height: 7px; padding: 0; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .4); }
.dots button.on { background: #fff; }
.x { position: absolute; top: max(16px, env(safe-area-inset-top)); right: 16px; background: #fff; color: var(--ink); }
@media (prefers-reduced-motion: reduce) { .phone:hover { transform: none; } }
</style>

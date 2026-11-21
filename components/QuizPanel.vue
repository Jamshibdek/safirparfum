<script setup lang="ts">
import { recommend, type QuizAnswers, type Pick } from '~/lib/recommend'
import { brandName, useL, minSize } from '~/lib/catalog'
import { flyToCart } from '~/utils/fly'
import { useCart, useUi } from '~/stores/shop'

const { t } = useI18n()
const lp = useLocalePath()
const { seasonL, familyL, money } = useL()
const ui = useUi()
const cart = useCart()

const STEPS = ['age', 'gender', 'job', 'seasons', 'places', 'purpose', 'priority', 'compliment'] as const
const step = ref(0)
const phase = ref<'q' | 'thinking' | 'done'>('q')
const picks = ref<Pick[]>([])
const a = reactive<QuizAnswers>({ age: 28, gender: '', job: '', seasons: [], places: [], purpose: '', priority: '', compliment: '' })

const cur = computed(() => STEPS[step.value])
const progress = computed(() => phase.value === 'done' ? 100 : ((step.value) / STEPS.length) * 100)
const canNext = computed(() => {
  switch (cur.value) {
    case 'seasons': return a.seasons.length > 0
    case 'places': return a.places.length > 0
    default: return true
  }
})

const seasonOpts = [['spring', '🌱'], ['summer', '☀️'], ['autumn', '🍂'], ['winter', '❄️']]
const placeOpts = [['office', '🏢'], ['meetings', '🤝'], ['car', '🚗'], ['cafe', '☕'], ['uni', '🎓'], ['outdoor', '🌤']]

function toggle(list: string[], v: string) {
  const i = list.indexOf(v)
  i >= 0 ? list.splice(i, 1) : list.push(v)
}
function pick(key: 'gender' | 'purpose' | 'priority' | 'compliment', v: string) {
  ;(a as any)[key] = v
  setTimeout(next, 180)
}
function next() {
  if (step.value < STEPS.length - 1) step.value += 1
  else finish()
}
function back() { if (step.value > 0) step.value -= 1 }
function finish() {
  phase.value = 'thinking'
  setTimeout(() => { picks.value = recommend(a); phase.value = 'done' }, 1300)
}
function restart() {
  Object.assign(a, { age: 28, gender: '', job: '', seasons: [], places: [], purpose: '', priority: '', compliment: '' })
  step.value = 0; phase.value = 'q'; picks.value = []
}
function reasonText(r: Pick['reasons'][number]) {
  return t(`quiz.why.${r.key}`, { season: r.season ? seasonL(r.season) : '', family: r.family ? familyL(r.family).toLowerCase() : '', n: r.n ?? '' })
}
function add(p: Pick['p'], e?: Event) {
  const s = p.sizes.find(x => x.stock) ?? p.sizes[0]
  cart.add(p.slug, s.ml)
  flyToCart((e?.currentTarget as HTMLElement | undefined)?.closest('.rc'))
  ui.notify(t('card.added'), { label: t('card.openCart'), to: '#cart' }, `${p.name} · ${s.ml} ml`)
}
</script>

<template>
  <aside class="drawer quiz" role="dialog" aria-modal="true" :aria-label="t('quiz.title')">
    <div class="drawer-head">
      <div class="ttl"><Icon name="sparkle" :size="20" class="sp" /><h2 class="h3">{{ t('quiz.title') }}</h2></div>
      <button class="icon-btn" :aria-label="t('common.close')" @click="ui.quiz = false"><Icon name="close" /></button>
    </div>
    <div class="prog"><span :style="{ width: progress + '%' }" /></div>

    <div class="drawer-body">
      <template v-if="phase === 'q'">
        <p v-if="step === 0" class="bubble">{{ t('quiz.intro') }}</p>
        <p class="stepn">{{ t('quiz.step', { n: step + 1, total: STEPS.length }) }}</p>

        <Transition name="fade" mode="out-in">
          <div :key="cur" class="q">
            <template v-if="cur === 'age'">
              <h3 class="qh">{{ t('quiz.age') }}</h3>
              <div class="age">
                <input v-model.number="a.age" type="range" min="16" max="70" :aria-label="t('quiz.age')">
                <output class="num">{{ a.age }}</output>
              </div>
            </template>

            <template v-else-if="cur === 'gender'">
              <h3 class="qh">{{ t('quiz.gender') }}</h3>
              <div class="opts">
                <button v-for="g in ['men', 'women', 'unisex']" :key="g" class="opt" :class="{ on: a.gender === g }" @click="pick('gender', g)">{{ t(`quiz.genders.${g}`) }}</button>
              </div>
            </template>

            <template v-else-if="cur === 'job'">
              <h3 class="qh">{{ t('quiz.job') }}</h3>
              <input v-model="a.job" class="input" :placeholder="t('quiz.jobPh')" @keydown.enter="next">
            </template>

            <template v-else-if="cur === 'seasons'">
              <h3 class="qh">{{ t('quiz.seasons') }}</h3>
              <p class="hint">{{ t('quiz.multi') }}</p>
              <div class="tiles">
                <button v-for="[k, e] in seasonOpts" :key="k" class="tile" :class="{ on: a.seasons.includes(k) }" @click="toggle(a.seasons, k)">
                  <span class="em">{{ e }}</span>{{ seasonL(k) }}
                </button>
              </div>
            </template>

            <template v-else-if="cur === 'places'">
              <h3 class="qh">{{ t('quiz.places') }}</h3>
              <p class="hint">{{ t('quiz.multi') }}</p>
              <div class="tiles">
                <button v-for="[k, e] in placeOpts" :key="k" class="tile" :class="{ on: a.places.includes(k) }" @click="toggle(a.places, k)">
                  <span class="em">{{ e }}</span>{{ t(`quiz.placeOpts.${k}`) }}
                </button>
              </div>
            </template>

            <template v-else-if="cur === 'purpose'">
              <h3 class="qh">{{ t('quiz.purpose') }}</h3>
              <div class="opts">
                <button v-for="k in ['daily', 'work', 'date', 'event', 'all']" :key="k" class="opt" :class="{ on: a.purpose === k }" @click="pick('purpose', k)">{{ t(`quiz.purposeOpts.${k}`) }}</button>
              </div>
            </template>

            <template v-else-if="cur === 'priority'">
              <h3 class="qh">{{ t('quiz.priority') }}</h3>
              <div class="opts">
                <button v-for="k in ['long', 'unique']" :key="k" class="opt" :class="{ on: a.priority === k }" @click="pick('priority', k)">{{ t(`quiz.priorityOpts.${k}`) }}</button>
              </div>
            </template>

            <template v-else>
              <h3 class="qh">{{ t('quiz.compliment') }}</h3>
              <div class="opts">
                <button v-for="k in ['clean', 'rich', 'which', 'nice', 'memory']" :key="k" class="opt serif" :class="{ on: a.compliment === k }" @click="a.compliment = k">{{ t(`quiz.complimentOpts.${k}`) }}</button>
              </div>
            </template>
          </div>
        </Transition>
      </template>

      <div v-else-if="phase === 'thinking'" class="think">
        <span class="orb" />
        <p>{{ t('quiz.thinking') }}</p>
      </div>

      <div v-else class="res">
        <p class="bubble">{{ t('quiz.result') }} ✦</p>
        <article v-for="r in picks" :key="r.p.slug" class="rc">
          <NuxtLink :to="lp(`/product/${r.p.slug}`)" class="th" @click="ui.quiz = false"><BottleArt :product="r.p" /></NuxtLink>
          <div class="rinfo">
            <span class="match">{{ r.match }}% {{ t('quiz.match') }}</span>
            <span class="br">{{ brandName(r.p.brand) }}</span>
            <NuxtLink :to="lp(`/product/${r.p.slug}`)" class="nm" @click="ui.quiz = false">{{ r.p.name }}</NuxtLink>
            <ul class="why"><li v-for="(w, i) in r.reasons" :key="i">{{ reasonText(w) }}</li></ul>
            <div class="rfoot">
              <span class="num pr">{{ minSize(r.p).ml }} ml · {{ money(minSize(r.p).price) }}</span>
              <button class="btn sm" @click="add(r.p, $event)"><Icon name="bag" :size="15" />{{ t('card.add') }}</button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="phase !== 'thinking'" class="drawer-foot foot">
      <template v-if="phase === 'q'">
        <button v-if="step > 0" class="btn ghost" @click="back"><Icon name="left" :size="16" />{{ t('quiz.back') }}</button>
        <button class="btn grow" :disabled="!canNext" @click="next">{{ step === STEPS.length - 1 ? t('quiz.finish') : t('quiz.next') }}</button>
      </template>
      <button v-else class="btn ghost grow" @click="restart">{{ t('quiz.again') }}</button>
    </div>
  </aside>
</template>

<style scoped>
.ttl { display: flex; align-items: center; gap: 10px; }
.sp { color: var(--gold); }
.prog { height: 3px; background: var(--bg-2); }
.prog span { display: block; height: 100%; background: linear-gradient(90deg, var(--gold), var(--champagne)); transition: width .45s var(--ease); }
.bubble { background: var(--surface); border: 1px solid var(--line); border-radius: 4px 16px 16px 16px; padding: 12px 16px; font-size: 14px; margin-bottom: 18px; max-width: 90%; }
.stepn { font-size: 11.5px; font-weight: 700; letter-spacing: .14em; color: var(--muted); margin-bottom: 6px; }
.qh { font-family: var(--f-display); font-size: 28px; font-weight: 600; margin-bottom: 16px; line-height: 1.1; }
.hint { font-size: 13px; color: var(--muted); margin: -8px 0 14px; }
.age { display: flex; align-items: center; gap: 18px; }
.age input { flex: 1; accent-color: var(--sapphire); height: 4px; }
.age output { font-family: var(--f-display); font-size: 44px; font-weight: 600; min-width: 2ch; color: var(--sapphire); }
.opts { display: grid; gap: 8px; }
.opt { text-align: left; height: auto; min-height: 54px; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--line); background: var(--surface); font-size: 15px; font-weight: 500; transition: all .2s; }
.opt:hover { border-color: var(--ink); }
.opt.on { border-color: var(--sapphire); background: rgba(31, 63, 120, .07); box-shadow: inset 0 0 0 1px var(--sapphire); }
.opt.serif { font-family: var(--f-display); font-size: 19px; font-style: italic; }
.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.tile { text-transform: capitalize; display: grid; justify-items: start; gap: 6px; padding: 16px; border-radius: 14px; border: 1px solid var(--line); background: var(--surface); font-weight: 600; font-size: 14px; text-align: left; transition: all .2s; }
.tile .em { font-size: 22px; }
.tile.on { border-color: var(--sapphire); background: rgba(31, 63, 120, .07); box-shadow: inset 0 0 0 1px var(--sapphire); }
.foot { display: flex; gap: 10px; }
.grow { flex: 1; }
.think { display: grid; place-items: center; gap: 22px; padding: 80px 0; color: var(--ink-2); }
.orb { width: 72px; height: 72px; border-radius: 50%; background: conic-gradient(from 0deg, var(--sapphire), var(--champagne), var(--gold), var(--sapphire)); animation: spin 1.6s linear infinite; mask: radial-gradient(circle, transparent 52%, #000 54%); }
@keyframes spin { to { transform: rotate(1turn); } }
.res { display: grid; gap: 12px; }
.rc { display: grid; grid-template-columns: 96px 1fr; gap: 14px; padding: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; }
.th { width: 96px; height: 96px; border-radius: 12px; overflow: hidden; }
.rinfo { display: grid; gap: 2px; min-width: 0; }
.match { justify-self: start; font-size: 10.5px; font-weight: 800; color: var(--ok); background: rgba(47, 107, 79, .1); padding: 3px 8px; border-radius: 6px; margin-bottom: 2px; }
.br { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.nm { font-family: var(--f-display); font-size: 20px; font-weight: 600; line-height: 1.1; }
.why { margin: 4px 0 0; padding-left: 16px; font-size: 12.5px; color: var(--ink-2); }
.rfoot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
.pr { font-size: 13px; font-weight: 700; }
</style>

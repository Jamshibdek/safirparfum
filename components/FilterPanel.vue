<script setup lang="ts">
import { brands, families, seasons, popularNotes, products, PRICE_MIN, PRICE_MAX, useL, type Filters } from '~/lib/catalog'
import { formatSum } from '~/utils/text'

const f = defineModel<Filters>({ required: true })
defineProps<{ count: number }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const { L, noteL } = useL()
const bq = ref('')
const showAllNotes = ref(false)

const brandCount = (s: string) => products.filter(p => p.brand === s).length
const famKeys = Object.keys(families).filter(k => products.some(p => p.families.includes(k)))
const brandList = computed(() => brands.filter(b => b.name.toLowerCase().includes(bq.value.toLowerCase())))
const notesShown = computed(() => (showAllNotes.value ? popularNotes : popularNotes.slice(0, 10)))

function toggle<K extends 'brand' | 'family' | 'note' | 'season' | 'size'>(key: K, v: any) {
  const cur = [...((f.value[key] as any[]) ?? [])]
  const i = cur.indexOf(v)
  i >= 0 ? cur.splice(i, 1) : cur.push(v)
  f.value = { ...f.value, [key]: cur }
}
const on = (key: 'brand' | 'family' | 'note' | 'season' | 'size', v: any) => ((f.value[key] as any[]) ?? []).includes(v)

const step = 50000
const lo = computed({ get: () => f.value.min ?? PRICE_MIN, set: v => (f.value = { ...f.value, min: Math.min(v, (f.value.max ?? PRICE_MAX) - step) }) })
const hi = computed({ get: () => f.value.max ?? PRICE_MAX, set: v => (f.value = { ...f.value, max: Math.max(v, (f.value.min ?? PRICE_MIN) + step) }) })
const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
</script>

<template>
  <div class="fp">
    <div class="fp-head only-m">
      <h2 class="h3">{{ t('shop.filters') }}</h2>
      <button class="icon-btn" :aria-label="t('common.close')" @click="emit('close')"><Icon name="close" /></button>
    </div>

    <div class="fp-body">
      <details open>
        <summary>{{ t('shop.brand') }}</summary>
        <input v-model="bq" class="input sm" :placeholder="t('shop.brandSearch')">
        <div class="list scroll">
          <label v-for="b in brandList" :key="b.slug" class="ck">
            <input type="checkbox" :checked="on('brand', b.slug)" @change="toggle('brand', b.slug)">
            <span class="box"><Icon name="check" :size="12" :stroke="2.4" /></span>
            <span class="lbl">{{ b.name }}</span><span class="n">{{ brandCount(b.slug) }}</span>
          </label>
        </div>
      </details>

      <details open>
        <summary>{{ t('shop.family') }}</summary>
        <div class="chips">
          <button v-for="k in famKeys" :key="k" class="chip soft" :class="{ on: on('family', k) }" @click="toggle('family', k)">{{ L(families[k]) }}</button>
        </div>
      </details>

      <details open>
        <summary>{{ t('shop.price') }}</summary>
        <div class="range">
          <div class="track"><span :style="{ left: pct(lo) + '%', right: 100 - pct(hi) + '%' }" /></div>
          <input v-model.number="lo" type="range" :min="PRICE_MIN" :max="PRICE_MAX" :step="step" :aria-label="t('shop.from')">
          <input v-model.number="hi" type="range" :min="PRICE_MIN" :max="PRICE_MAX" :step="step" :aria-label="t('shop.to')">
        </div>
        <div class="rv num"><span>{{ formatSum(lo) }}</span><span>{{ formatSum(hi) }}</span></div>
      </details>

      <details open>
        <summary>{{ t('shop.size') }}</summary>
        <div class="chips">
          <button v-for="s in [30, 50, 100]" :key="s" class="chip soft" :class="{ on: on('size', s) }" @click="toggle('size', s)">{{ s }} ml</button>
        </div>
      </details>

      <details open>
        <summary>{{ t('shop.note') }}</summary>
        <div class="chips">
          <button v-for="n in notesShown" :key="n" class="chip soft" :class="{ on: on('note', n) }" @click="toggle('note', n)">{{ noteL(n) }}</button>
          <button class="more" @click="showAllNotes = !showAllNotes">{{ showAllNotes ? t('product.less') : '+' + (popularNotes.length - 10) }}</button>
        </div>
      </details>

      <details open>
        <summary>{{ t('shop.season') }}</summary>
        <div class="chips">
          <button v-for="(v, k) in seasons" :key="k" class="chip soft" :class="{ on: on('season', k) }" @click="toggle('season', k)">{{ L(v) }}</button>
        </div>
      </details>

      <label class="sw">
        <input type="checkbox" :checked="!!f.sale" @change="f = { ...f, sale: !f.sale }">
        <span class="knob" />
        {{ t('shop.saleOnly') }}
      </label>
    </div>

    <div class="fp-foot only-m">
      <button class="btn block" @click="emit('close')">{{ t('shop.show') }} · {{ count }}</button>
    </div>
  </div>
</template>

<style scoped>
.fp-body { display: grid; gap: 4px; }
details { border-bottom: 1px solid var(--line); padding: 14px 0 18px; }
summary { list-style: none; cursor: pointer; font-weight: 600; font-size: 14.5px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
summary::-webkit-details-marker { display: none; }
summary::after { content: '−'; color: var(--muted); font-size: 18px; }
details:not([open]) summary { margin-bottom: 0; }
details:not([open]) summary::after { content: '+'; }
.input.sm { height: 40px; font-size: 14px; margin-bottom: 8px; }
.list { display: grid; gap: 2px; }
.scroll { max-height: 230px; overflow: auto; padding-right: 4px; }
.ck { display: flex; align-items: center; gap: 10px; padding: 6px 0; cursor: pointer; font-size: 14px; }
.ck input { position: absolute; opacity: 0; pointer-events: none; }
.box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--line-2); display: grid; place-items: center; color: transparent; transition: all .15s; flex: none; }
.ck input:checked + .box { background: var(--sapphire); border-color: var(--sapphire); color: #fff; }
.ck input:focus-visible + .box { outline: 2px solid var(--sapphire-2); outline-offset: 2px; }
.lbl { flex: 1; }
.n { font-size: 12px; color: var(--muted); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip.soft.on { background: var(--ink); color: #fff; }
.more { border: 0; background: transparent; color: var(--sapphire); font-weight: 600; font-size: 13px; }
.range { position: relative; height: 24px; }
.track { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: var(--line); }
.track span { position: absolute; top: 0; bottom: 0; background: var(--sapphire); border-radius: 2px; }
.range input { position: absolute; inset: 0; width: 100%; margin: 0; background: none; pointer-events: none; -webkit-appearance: none; appearance: none; }
.range input::-webkit-slider-thumb { pointer-events: auto; -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--surface); border: 2px solid var(--sapphire); cursor: grab; }
.range input::-moz-range-thumb { pointer-events: auto; width: 18px; height: 18px; border-radius: 50%; background: var(--surface); border: 2px solid var(--sapphire); cursor: grab; }
.rv { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-2); margin-top: 6px; }
.sw { display: flex; align-items: center; gap: 12px; padding: 18px 0; cursor: pointer; font-size: 14.5px; font-weight: 500; }
.sw input { position: absolute; opacity: 0; }
.knob { width: 40px; height: 24px; border-radius: 12px; background: var(--line-2); position: relative; transition: background .2s; flex: none; }
.knob::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .2s; }
.sw input:checked + .knob { background: var(--sapphire); }
.sw input:checked + .knob::after { transform: translateX(16px); }
.only-m { display: none; }
@media (max-width: 1023px) {
  .fp { display: flex; flex-direction: column; height: 100%; }
  .only-m { display: flex; }
  .fp-head { justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--line); }
  .fp-body { flex: 1; overflow: auto; padding: 0 20px; }
  .fp-foot { padding: 14px 20px; border-top: 1px solid var(--line); background: var(--surface); }
}
</style>

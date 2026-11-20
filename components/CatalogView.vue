<script setup lang="ts">
// Katalog setkasi + filtrlar. Holat to'liq URL'da: /shop?gender=men&brand=dior,creed&sort=price_asc
import { filterProducts, brands, families, seasons, useL, counts, type Filters, type Product } from '~/lib/catalog'
import { formatSum } from '~/utils/text'

const props = withDefaults(defineProps<{ base?: Product[]; title: string; intro?: string; crumbs?: Array<{ to?: string; label: string }>; showGender?: boolean }>(), { showGender: true })
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const lp = useLocalePath()
const { L, noteL } = useL()

const list = (v: unknown) => (typeof v === 'string' && v ? v.split(',') : [])
const num = (v: unknown) => (typeof v === 'string' && v !== '' && !isNaN(+v) ? +v : undefined)

const f = computed<Filters>({
  get: () => {
    const q = route.query
    return {
      gender: typeof q.gender === 'string' ? q.gender : 'all',
      brand: list(q.brand), family: list(q.family), note: list(q.note), season: list(q.season),
      size: list(q.size).map(Number), min: num(q.min), max: num(q.max), sale: q.sale === '1',
      sort: typeof q.sort === 'string' ? q.sort : 'popular'
    }
  },
  set: v => {
    const q: Record<string, string> = {}
    if (v.gender && v.gender !== 'all') q.gender = v.gender
    for (const k of ['brand', 'family', 'note', 'season', 'size'] as const) if ((v[k] as any[])?.length) q[k] = (v[k] as any[]).join(',')
    if (v.min != null) q.min = String(v.min)
    if (v.max != null) q.max = String(v.max)
    if (v.sale) q.sale = '1'
    if (v.sort && v.sort !== 'popular') q.sort = v.sort
    router.replace({ query: q })
  }
})

const result = computed(() => filterProducts(f.value, props.base))
const PAGE = 12
const shown = ref(PAGE)
watch(() => route.query, () => (shown.value = PAGE))
const visible = computed(() => result.value.slice(0, shown.value))
const drawer = ref(false)
watch(drawer, v => { if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : '' })

const active = computed(() => {
  const a: Array<{ label: string; drop: () => void }> = []
  const v = f.value
  const without = (k: keyof Filters, x?: any) => () => {
    const n = { ...v } as any
    n[k] = x === undefined ? undefined : (n[k] as any[]).filter((y: any) => y !== x)
    f.value = n
  }
  v.brand?.forEach(b => a.push({ label: brands.find(x => x.slug === b)?.name ?? b, drop: without('brand', b) }))
  v.family?.forEach(k => a.push({ label: L(families[k]), drop: without('family', k) }))
  v.note?.forEach(k => a.push({ label: noteL(k), drop: without('note', k) }))
  v.season?.forEach(k => a.push({ label: L(seasons[k]), drop: without('season', k) }))
  v.size?.forEach(k => a.push({ label: `${k} ml`, drop: without('size', k) }))
  if (v.min != null || v.max != null) a.push({ label: `${v.min != null ? formatSum(v.min) : ''} – ${v.max != null ? formatSum(v.max) : ''}`, drop: () => (f.value = { ...v, min: undefined, max: undefined }) })
  if (v.sale) a.push({ label: t('badge.sale'), drop: () => (f.value = { ...v, sale: false }) })
  return a
})
const reset = () => (f.value = { gender: f.value.gender, sort: f.value.sort })
const sorts = ['popular', 'price_asc', 'price_desc', 'new', 'discount', 'az']
</script>

<template>
  <div>
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs" aria-label="breadcrumb">
          <NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink>
          <template v-for="c in crumbs" :key="c.label"><span>/</span><NuxtLink v-if="c.to" :to="lp(c.to)">{{ c.label }}</NuxtLink><span v-else>{{ c.label }}</span></template>
        </nav>
        <div class="title-row">
          <h1 class="h1">{{ title }}</h1>
          <span class="cnt num">{{ result.length }} {{ t('shop.found') }}</span>
        </div>
        <p v-if="intro" class="lead intro">{{ intro }}</p>
        <div v-if="showGender" class="genders">
          <button v-for="g in ['all', 'men', 'women', 'unisex']" :key="g" class="chip" :class="{ on: f.gender === g }" @click="f = { ...f, gender: g }">
            {{ t(`gender.${g}`) }} <span class="gn">{{ (counts as any)[g] }}</span>
          </button>
        </div>
      </div>
    </header>

    <div class="wrap layout">
      <aside class="side" :class="{ open: drawer }">
        <FilterPanel v-model="f" :count="result.length" @close="drawer = false" />
      </aside>
      <Transition name="fade"><div v-if="drawer" class="scrim side-scrim" @click="drawer = false" /></Transition>

      <section class="main">
        <div class="bar">
          <button class="chip filt" @click="drawer = true"><Icon name="filter" :size="16" />{{ t('shop.filters') }}<span v-if="active.length" class="fc">{{ active.length }}</span></button>
          <div class="act">
            <button v-for="(a, k) in active" :key="k" class="chip soft on-chip" @click="a.drop()">{{ a.label }} <Icon name="close" :size="13" /></button>
            <button v-if="active.length" class="clear" @click="reset">{{ t('shop.reset') }}</button>
          </div>
          <label class="sort">
            <span class="visually-hidden">{{ t('shop.sort') }}</span>
            <select :value="f.sort" @change="f = { ...f, sort: ($event.target as HTMLSelectElement).value }">
              <option v-for="s in sorts" :key="s" :value="s">{{ t(`shop.sorts.${s}`) }}</option>
            </select>
            <Icon name="down" :size="15" />
          </label>
        </div>

        <div v-if="visible.length" class="grid-products">
          <ProductCard v-for="p in visible" :key="p.slug" :product="p" />
        </div>
        <div v-else class="empty">
          <h2 class="h3">{{ t('shop.empty') }}</h2>
          <p class="muted">{{ t('shop.emptyHint') }}</p>
          <button class="btn ghost" @click="reset">{{ t('shop.reset') }}</button>
        </div>

        <div v-if="shown < result.length" class="more">
          <p class="muted num">{{ visible.length }} / {{ result.length }}</p>
          <div class="pbar"><span :style="{ width: (visible.length / result.length) * 100 + '%' }" /></div>
          <button class="btn ghost" @click="shown += PAGE">{{ t('shop.more') }} · {{ result.length - shown }} {{ t('shop.left') }}</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.title-row { display: flex; align-items: baseline; gap: 18px; flex-wrap: wrap; }
.cnt { color: var(--muted); font-size: 14px; }
.intro { margin-top: 10px; }
.genders { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 22px; }
.gn { font-size: 12px; opacity: .6; }
.layout { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 36px; padding-top: 28px; }
.side { position: sticky; top: calc(var(--header-h) + 16px); align-self: start; max-height: calc(100vh - var(--header-h) - 32px); overflow: auto; padding-right: 6px; }
.main { min-width: 0; }
.bar { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; min-height: 40px; }
.filt { display: none; }
.fc { background: var(--sapphire); color: #fff; border-radius: 9px; font-size: 11px; padding: 1px 7px; }
.act { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; align-items: center; }
.on-chip { background: var(--ink); color: #fff; gap: 6px; }
.clear { border: 0; background: transparent; color: var(--sapphire); font-weight: 600; font-size: 13px; }
.sort { position: relative; display: flex; align-items: center; margin-left: auto; }
.sort select { appearance: none; height: 40px; padding: 0 38px 0 16px; border-radius: var(--pill); border: 1px solid var(--line-2); background: var(--surface); font-size: 13.5px; font-weight: 500; cursor: pointer; }
.sort :deep(svg) { position: absolute; right: 14px; pointer-events: none; }
.empty { display: grid; justify-items: center; gap: 12px; text-align: center; padding: 80px 20px; border: 1px dashed var(--line-2); border-radius: var(--r-lg); }
.more { display: grid; justify-items: center; gap: 12px; margin-top: 44px; }
.pbar { width: 200px; height: 2px; background: var(--line); }
.pbar span { display: block; height: 100%; background: var(--ink); }
.side-scrim { display: none; }
@media (max-width: 1023px) {
  .layout { grid-template-columns: 1fr; padding-top: 18px; }
  .side { position: fixed; top: auto; left: 0; right: 0; bottom: 0; height: 86vh; max-height: none; z-index: 92; background: var(--bg); border-radius: 22px 22px 0 0; padding: 0; transform: translateY(100%); transition: transform .45s var(--ease); overflow: hidden; }
  .side.open { transform: none; }
  .side-scrim { display: block; z-index: 91; }
  .filt { display: inline-flex; }
  .bar { flex-wrap: wrap; }
  .act { order: 3; flex-basis: 100%; }
}
</style>

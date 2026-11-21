<script setup lang="ts">
import { searchProducts, brandName, useL, minSize, products } from '~/lib/catalog'

const props = withDefaults(defineProps<{ dark?: boolean; autofocus?: boolean }>(), { dark: false, autofocus: false })
const emit = defineEmits<{ done: [] }>()
const { t } = useI18n()
const lp = useLocalePath()
const router = useRouter()
const route = useRoute()
const { familyL, money } = useL()

const q = ref(typeof route.query.q === 'string' ? route.query.q : '')
const open = ref(false)
const active = ref(-1)
const root = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)

const results = computed(() => (q.value.trim().length >= 2 ? searchProducts(q.value, 7) : []))
const popularQ = ['Dior', 'vanil', 'Baccarat', 'ud', 'Tom Ford', 'sitrus']
const popular = computed(() => [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4))

watch(q, () => { active.value = -1; open.value = true })
watch(() => route.fullPath, () => { open.value = false })

function go(slug?: string) {
  open.value = false
  emit('done')
  if (slug) router.push(lp(`/product/${slug}`))
  else if (q.value.trim()) router.push({ path: lp('/search'), query: { q: q.value.trim() } })
  input.value?.blur()
}
function onKey(e: KeyboardEvent) {
  const n = results.value.length
  if (e.key === 'ArrowDown' && n) { e.preventDefault(); active.value = (active.value + 1) % n }
  else if (e.key === 'ArrowUp' && n) { e.preventDefault(); active.value = (active.value - 1 + n) % n }
  else if (e.key === 'Enter') { e.preventDefault(); go(active.value >= 0 ? results.value[active.value].slug : undefined) }
  else if (e.key === 'Escape') { open.value = false; input.value?.blur() }
}
function outside(e: MouseEvent) { if (root.value && !root.value.contains(e.target as Node)) open.value = false }
onMounted(() => {
  document.addEventListener('mousedown', outside)
  if (props.autofocus) nextTick(() => input.value?.focus())
})
onBeforeUnmount(() => document.removeEventListener('mousedown', outside))
</script>

<template>
  <div ref="root" class="sb" :class="{ dark, open: open && (results.length || q.length >= 2 || !q) }">
    <form class="field" role="search" @submit.prevent="go()">
      <Icon name="search" :size="18" class="ic" />
      <input
        ref="input" v-model="q" type="search" :placeholder="t('header.search')" autocomplete="off"
        :aria-label="t('nav.search')" aria-autocomplete="list" @focus="open = true" @keydown="onKey"
      >
      <button v-if="q" type="button" class="clear" :aria-label="t('common.close')" @click="q = ''; input?.focus()"><Icon name="close" :size="16" /></button>
      <button type="submit" class="go">{{ t('header.searchBtn') }}</button>
    </form>

    <Transition name="pop">
      <div v-if="open" class="drop" role="listbox">
        <template v-if="q.trim().length >= 2">
          <template v-if="results.length">
            <button
              v-for="(p, i) in results" :key="p.slug" class="row" :class="{ on: i === active }" role="option"
              :aria-selected="i === active" @mouseenter="active = i" @click="go(p.slug)"
            >
              <span class="thumb"><ProductVisual sizes="100px" :product="p" /></span>
              <span class="txt">
                <span class="fam">{{ p.families.map(familyL).join(' · ') }}</span>
                <span class="nm">{{ brandName(p.brand) }} <em>{{ p.name }}</em></span>
              </span>
              <span class="pr num"><small>{{ minSize(p).ml }} ml</small>{{ money(minSize(p).price) }}</span>
            </button>
            <button class="all" @click="go()">{{ t('header.allResults') }}</button>
          </template>
          <div v-else class="none">
            <Icon name="search" :size="22" />
            <strong>{{ t('header.nothing') }}</strong>
            <span>{{ t('header.nothingHint') }}</span>
          </div>
        </template>
        <div v-else class="idle">
          <p class="overline">{{ t('header.popular') }}</p>
          <div class="chips">
            <button v-for="w in popularQ" :key="w" class="chip soft" @click="q = w">{{ w }}</button>
          </div>
          <div class="mini">
            <button v-for="p in popular" :key="p.slug" class="mini-it" @click="go(p.slug)">
              <span class="thumb"><ProductVisual sizes="100px" :product="p" /></span>
              <span>{{ p.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.sb { position: relative; flex: 1; min-width: 0; }
.field {
  display: flex; align-items: center; height: 48px; padding: 0 5px 0 16px; border-radius: var(--pill);
  background: var(--surface); border: 1px solid var(--line); transition: box-shadow .2s, border-color .2s;
}
.field:focus-within { border-color: var(--sapphire); box-shadow: 0 0 0 4px rgba(31, 63, 120, .12); }
.dark .field { border-color: transparent; }
.ic { color: var(--muted); flex: none; }
input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; padding: 0 12px; height: 100%; font-size: 14.5px; }
input::-webkit-search-cancel-button { display: none; }
.clear { border: 0; background: transparent; color: var(--muted); display: grid; place-items: center; width: 32px; height: 32px; }
.go {
  height: 38px; padding: 0 18px; border: 0; border-radius: var(--pill); background: var(--champagne);
  font-size: 13px; font-weight: 700; transition: background .2s;
}
.go:hover { background: var(--champagne-2); }

.drop {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 60; background: var(--surface);
  border: 1px solid var(--line); border-radius: 18px; box-shadow: var(--shadow-pop); padding: 8px; max-height: 70vh; overflow: auto;
}
.row {
  display: grid; grid-template-columns: 52px 1fr auto; align-items: center; gap: 14px; width: 100%;
  padding: 8px; border: 0; background: transparent; border-radius: 12px; text-align: left;
}
.row.on { background: var(--bg); }
.thumb { width: 52px; height: 52px; border-radius: 10px; overflow: hidden; display: block; }
.txt { display: grid; gap: 2px; min-width: 0; }
.fam { font-size: 12px; color: var(--muted); }
.nm { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nm em { font-family: var(--f-display); font-style: normal; font-size: 18px; font-weight: 600; }
.pr { font-size: 14px; font-weight: 700; white-space: nowrap; display: grid; justify-items: end; line-height: 1.2; }
.pr small { font-size: 11px; font-weight: 500; color: var(--muted); }
.all {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; height: 44px; margin-top: 4px;
  border: 0; border-top: 1px solid var(--line); background: transparent; font-weight: 600; font-size: 13.5px;
}
.none { display: grid; justify-items: center; gap: 6px; padding: 28px 16px; text-align: center; color: var(--muted); }
.none strong { color: var(--ink); font-size: 15px; }
.idle { padding: 10px 10px 6px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 16px; }
.mini { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.mini-it { border: 0; background: transparent; display: grid; gap: 6px; font-size: 12.5px; font-weight: 600; text-align: left; padding: 0; }
.mini-it .thumb { width: 100%; height: auto; aspect-ratio: 1; }
@media (max-width: 767px) {
  .go { display: none; }
  .field { height: 44px; }
  .row { grid-template-columns: 44px 1fr; }
  .row .pr { grid-column: 2; font-size: 13px; }
  .thumb { width: 44px; height: 44px; }
}
</style>

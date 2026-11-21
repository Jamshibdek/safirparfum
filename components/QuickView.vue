<script setup lang="ts">
import { getProduct, brandName, useL, fillLevel } from '~/lib/catalog'
import { flyToCart } from '~/utils/fly'
import { useCart, useUi } from '~/stores/shop'
const { t } = useI18n()
const lp = useLocalePath()
const { L, noteL, familyL, money } = useL()
const ui = useUi()
const cart = useCart()
const p = computed(() => getProduct(ui.quick!)!)
const ml = ref(p.value.sizes.find(s => s.stock)?.ml ?? 30)
const size = computed(() => p.value.sizes.find(s => s.ml === ml.value)!)
const art = ref<HTMLElement | null>(null)
function add() {
  cart.add(p.value.slug, ml.value)
  flyToCart(art.value)
  ui.quick = null
  ui.notify(t('card.added'), { label: t('card.openCart'), to: '#cart' }, `${p.value.name} · ${ml.value} ml`)
}
</script>

<template>
  <div class="modal" role="dialog" aria-modal="true" :aria-label="p.name" @click.self="ui.quick = null">
    <div class="box">
      <button class="icon-btn x" :aria-label="t('common.close')" @click="ui.quick = null"><Icon name="close" /></button>
      <div ref="art" class="art"><BottleArt :product="p" :level="fillLevel(ml)" /></div>
      <div class="info">
        <p class="overline">{{ p.families.map(familyL).join(' · ') }}</p>
        <p class="br">{{ brandName(p.brand) }}</p>
        <h2 class="h2">{{ p.name }}</h2>
        <p class="muted tl">{{ L(p.tagline) }}</p>
        <div class="price num">
          <strong>{{ money(size.price) }}</strong>
          <s v-if="size.oldPrice && size.oldPrice > size.price">{{ money(size.oldPrice) }}</s>
          <span class="ml">/ {{ ml }} ml</span>
        </div>
        <div class="sizes">
          <button v-for="s in p.sizes" :key="s.ml" class="chip" :class="{ on: s.ml === ml }" :disabled="!s.stock" @click="ml = s.ml">{{ s.ml }} ml</button>
        </div>
        <p class="desc">{{ L(p.description) }}</p>
        <div class="notes">
          <div><span class="overline">{{ t('product.top') }}</span><p>{{ p.notes.top.map(noteL).join(', ') }}</p></div>
          <div><span class="overline">{{ t('product.heart') }}</span><p>{{ p.notes.heart.map(noteL).join(', ') }}</p></div>
          <div><span class="overline">{{ t('product.base') }}</span><p>{{ p.notes.base.map(noteL).join(', ') }}</p></div>
        </div>
        <div class="acts">
          <button class="btn" :disabled="!size.stock" @click="add"><Icon name="bag" :size="18" />{{ t('product.add') }} · {{ money(size.price) }}</button>
          <NuxtLink :to="lp(`/product/${p.slug}`)" class="link-arrow" @click="ui.quick = null">{{ t('product.more') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal { position: fixed; inset: 0; z-index: 95; display: grid; place-items: center; padding: 20px; }
.box { position: relative; width: min(980px, 100%); max-height: calc(100vh - 40px); overflow: auto; display: grid; grid-template-columns: 1fr 1fr; background: var(--bg); border-radius: var(--r-lg); box-shadow: var(--shadow-pop); }
.x { position: absolute; top: 12px; right: 12px; background: var(--surface); z-index: 2; }
.art { aspect-ratio: 1; }
.info { padding: 36px 36px 32px; display: flex; flex-direction: column; gap: 10px; }
.br { font-weight: 600; color: var(--ink-2); }
.tl { margin-top: -4px; }
.price { display: flex; align-items: baseline; gap: 10px; margin-top: 6px; }
.price strong { font-size: 26px; }
.price s { color: var(--muted); }
.ml { color: var(--muted); font-size: 13px; }
.sizes { display: flex; gap: 8px; }
.desc { font-size: 14px; color: var(--ink-2); }
.notes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 14px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.notes p { font-size: 13px; margin-top: 4px; text-transform: capitalize; }
.acts { display: flex; align-items: center; gap: 20px; margin-top: 8px; flex-wrap: wrap; }
@media (max-width: 767px) { .box { grid-template-columns: 1fr; } .info { padding: 22px; } .art { aspect-ratio: 4 / 3; } }
</style>

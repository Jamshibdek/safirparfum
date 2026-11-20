<script setup lang="ts">
import type { Product } from '~/lib/catalog'
import { brandName, useL } from '~/lib/catalog'
import { useCart, useWishlist, useUi } from '~/stores/shop'

const props = defineProps<{ product: Product }>()
const { t } = useI18n()
const lp = useLocalePath()
const { familyL, money } = useL()
const cart = useCart()
const wish = useWishlist()
const ui = useUi()

const firstAvail = props.product.sizes.find(s => s.stock > 0) ?? props.product.sizes[0]
const ml = ref(firstAvail.ml)
const size = computed(() => props.product.sizes.find(s => s.ml === ml.value)!)
const tag = computed(() => {
  const f = props.product.families.slice(0, 2).map(familyL)
  return [f[0], ...f.slice(1).map(x => x.toLowerCase())].join(', ') + ', ' + t(`genderOne.${props.product.gender}`).toLowerCase()
})
const liked = computed(() => wish.has(props.product.slug))

function add() {
  if (!size.value.stock) return
  cart.add(props.product.slug, ml.value)
  ui.notify(`${props.product.name} · ${ml.value} ml — ${t('card.added').toLowerCase()}`, { label: t('card.openCart'), to: '#cart' })
}
function like() {
  const on = wish.toggle(props.product.slug)
  ui.notify(on ? t('wish.added') : t('wish.removed'))
}
</script>

<template>
  <article class="pc">
    <div class="media">
      <NuxtLink :to="lp(`/product/${product.slug}`)" class="media-link" :aria-label="product.name">
        <BottleArt :product="product" />
        <span class="second"><BottleArt :product="product" scene="notes" /></span>
      </NuxtLink>
      <div class="badges">
        <span v-if="product.discount" class="b sale">−{{ product.discount }}%</span>
        <span v-else-if="product.badge === 'top'" class="b top">{{ t('badge.top') }}</span>
        <span v-else-if="product.isNew" class="b new">{{ t('badge.new') }}</span>
      </div>
      <button class="like" :class="{ on: liked }" :aria-pressed="liked" :aria-label="t('product.wish')" @click="like">
        <Icon :name="liked ? 'heart-fill' : 'heart'" :size="18" />
      </button>
      <button class="quick" @click="ui.quick = product.slug"><Icon name="eye" :size="16" />{{ t('card.quick') }}</button>
    </div>

    <div class="body">
      <p class="tag">{{ tag }}</p>
      <NuxtLink :to="lp(`/product/${product.slug}`)" class="name">
        <span class="brand">{{ brandName(product.brand) }}</span>
        <span class="title">{{ product.name }}</span>
      </NuxtLink>

      <div class="sizes" role="radiogroup" :aria-label="t('product.size')">
        <button
          v-for="s in product.sizes" :key="s.ml" role="radio" :aria-checked="s.ml === ml"
          :class="{ on: s.ml === ml, off: !s.stock }" @click="ml = s.ml"
        >{{ s.ml }}</button>
        <span class="ml">ml</span>
      </div>

      <div class="foot">
        <div class="price num">
          <strong>{{ money(size.price) }}</strong>
          <s v-if="size.oldPrice && size.oldPrice > size.price">{{ money(size.oldPrice) }}</s>
        </div>
        <button class="add" :disabled="!size.stock" :aria-label="t('card.add')" @click="add">
          <Icon name="bag" :size="18" />
          <span>{{ size.stock ? t('card.add') : t('card.outOfStock') }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Butik vitrinasi: rasm o'z plitasida, matn ochiq — "kartochka qutisi" yo'q */
.pc { display: flex; flex-direction: column; min-width: 0; }
.media { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: var(--bg-2); border-radius: 18px; }
.media-link { position: absolute; inset: 0; }
.media-link > :deep(svg) { transition: transform .8s var(--ease); }
.pc:hover .media-link > :deep(svg) { transform: scale(1.04); }
.second { position: absolute; inset: 0; opacity: 0; transition: opacity .5s; }
@media (hover: hover) { .pc:hover .second { opacity: 1; } }

.badges { position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; pointer-events: none; }
.b { font-size: 12px; font-weight: 600; padding: 5px 9px; border-radius: 6px; background: var(--ink); color: #fff; }
.b.sale { background: var(--sale); }
.b.new { background: var(--sapphire); }

.like {
  position: absolute; top: 10px; right: 10px; width: 38px; height: 38px; border-radius: 50%;
  border: 0; background: rgba(255, 253, 249, .9); display: grid; place-items: center; color: var(--ink);
  transition: transform .2s, color .2s;
}
.like:hover { transform: scale(1.08); }
.like.on { color: var(--sale); }

.quick {
  position: absolute; left: 50%; bottom: 12px; transform: translate(-50%, 12px); opacity: 0;
  display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: var(--pill);
  border: 0; background: rgba(18, 19, 24, .86); color: #fff; font-size: 12px; font-weight: 600;
  transition: all .35s var(--ease); backdrop-filter: blur(6px);
}
@media (hover: hover) { .pc:hover .quick { opacity: 1; transform: translate(-50%, 0); } }
@media (hover: none) { .quick { display: none; } }

.body { padding: 14px 2px 4px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.tag { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.name { display: grid; gap: 2px; }
.brand { font-size: 12px; font-weight: 600; color: var(--ink-2); }
.title { font-family: var(--f-display); font-size: 21px; font-weight: 600; line-height: 1.08; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.name:hover .title { color: var(--sapphire); }

.sizes { display: flex; align-items: center; gap: 4px; margin-top: 2px; }
.sizes button {
  min-width: 38px; height: 26px; padding: 0 8px; border-radius: var(--pill); border: 1px solid var(--line);
  background: transparent; font-size: 12px; font-weight: 600; color: var(--ink-2); transition: all .2s;
}
.sizes button:hover { border-color: var(--ink); }
.sizes button.on { background: var(--ink); border-color: var(--ink); color: #fff; }
.sizes button.off { text-decoration: line-through; opacity: .45; }
.sizes .ml { font-size: 11.5px; color: var(--muted); margin-left: 2px; }

.foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; min-width: 0; margin-top: auto; padding-top: 6px; }
.price { display: grid; line-height: 1.15; }
.price strong { font-size: 17px; font-weight: 700; }
.price s { font-size: 12.5px; color: var(--muted); }
.add {
  display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 14px; border-radius: var(--pill);
  border: 1px solid var(--ink); background: var(--ink); color: #fff; font-size: 13px; font-weight: 600; transition: all .2s; flex: none;
}
.add:hover { background: var(--sapphire); border-color: var(--sapphire); }
.add[disabled] { background: transparent; color: var(--muted); border-color: var(--line); cursor: default; }

@media (max-width: 767px) {
  .body { padding: 10px 10px 12px; gap: 6px; }
  .title { font-size: 17px; }
  .brand { font-size: 11px; }
  .tag { font-size: 9.5px; letter-spacing: .08em; }
  .sizes button { min-width: 0; padding: 0 7px; height: 24px; font-size: 11px; }
  .sizes .ml { display: none; }
  .foot { flex-direction: column; align-items: stretch; }
  .price strong { font-size: 15px; }
  .add { justify-content: center; height: 36px; }
  .like { width: 34px; height: 34px; }
}
</style>

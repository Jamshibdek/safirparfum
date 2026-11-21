<script setup lang="ts">
import type { Product } from '~/lib/catalog'
import { brandName, useL, fillLevel, sizeScale } from '~/lib/catalog'
import { useCart, useWishlist, useUi } from '~/stores/shop'
import { flyToCart } from '~/utils/fly'

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

// Qopqoq ochilishi: sichqonchada hover bilan; sensorli ekranda kartochka ekran o'rtasiga kelganda
const media = ref<HTMLElement | null>(null)
const open = ref(false)
const onEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') open.value = true }
const onLeave = (e: PointerEvent) => { if (e.pointerType === 'mouse') open.value = false }
let io: IntersectionObserver | null = null
onMounted(() => {
  if (!media.value || matchMedia('(hover: hover)').matches || !('IntersectionObserver' in window)) return
  io = new IntersectionObserver(([e]) => { open.value = e.isIntersecting }, { rootMargin: '-38% 0px -38% 0px' })
  io.observe(media.value)
})
onBeforeUnmount(() => io?.disconnect())

function add() {
  if (!size.value.stock) return
  cart.add(props.product.slug, ml.value)
  flyToCart(media.value)
  ui.notify(t('card.added'), { label: t('card.openCart'), to: '#cart' }, `${props.product.name} · ${ml.value} ml`)
}
function like() {
  const on = wish.toggle(props.product.slug)
  ui.notify(on ? t('wish.added') : t('wish.removed'))
}
</script>

<template>
  <article class="pc">
    <div ref="media" class="media" :class="{ open, photo: product.real, cover: product.photoFit === 'cover' }" :style="{ '--sz': product.real && product.photoFit !== 'cover' ? sizeScale(ml) : 1 }" @pointerenter="onEnter" @pointerleave="onLeave">
      <NuxtLink :to="lp(`/product/${product.slug}`)" class="media-link" :aria-label="product.name" @focus="open = true" @blur="open = false">
        <!-- haqiqiy surat: yaqinlashish + jilo, 2-rasm bo'lsa almashadi; chizilgan flakon: qopqoq ochiladi -->
        <ProductVisual :product="product" :open="open" wisps :level="fillLevel(ml)" />
        <ProductVisual v-if="product.images.length > 1" class="alt-photo" :product="product" :index="1" />
        <span v-if="product.real" class="glint" aria-hidden="true" />
      </NuxtLink>
      <span v-if="product.videos.length" class="vid-badge" aria-hidden="true"><Icon name="play" :size="11" />Video</span>
      <SizeGauge v-if="product.real" class="gauge-pos" :ml="ml" :color="product.art.liquid" small />
      <div class="badges">
        <span v-if="product.badge === 'top'" class="b top">{{ t('badge.top') }}</span>
        <span v-else-if="product.isNew" class="b new">{{ t('badge.new') }}</span>
      </div>
      <button class="like" :class="{ on: liked }" :aria-pressed="liked" :aria-label="t('product.wish')" @click="like">
        <Icon :name="liked ? 'heart-fill' : 'heart'" :size="18" />
      </button>
      <button class="quick" @click="ui.quick = product.slug"><Icon name="eye" :size="16" />{{ t('card.quick') }}</button>
    </div>

    <!-- tartib: narx → eski narx → qisqa ma'lumot → reyting → hajm → eni to'liq tugma -->
    <div class="body">
      <div class="price num">
        <strong>{{ money(size.price) }}</strong>
        <span v-if="size.oldPrice && size.oldPrice > size.price" class="pct">−{{ Math.round((1 - size.price / size.oldPrice) * 100) }}%</span>
      </div>
      <!-- eski narx qatori doim joy egallaydi — bir qatordagi kartochkalar tugmalari tekis turadi -->
      <s v-if="size.oldPrice && size.oldPrice > size.price" class="old num">{{ money(size.oldPrice) }}</s>
      <span v-else class="old" aria-hidden="true">&nbsp;</span>
      <NuxtLink :to="lp(`/product/${product.slug}`)" class="name">
        <span class="brand">{{ brandName(product.brand) }}</span>
        <!-- nom rasm/yorliq ichida bor — ko'rinmaydi, lekin SEO va ekran o'quvchilar uchun qoladi -->
        <span class="title visually-hidden">{{ product.name }}</span>
        <span class="tag">{{ tag }}</span>
      </NuxtLink>
      <p class="rate"><span class="st">★</span> {{ product.rating.toFixed(1) }} <span class="muted">({{ t('product.reviewsCount', { n: product.reviews }) }})</span></p>

      <div class="sizes" role="radiogroup" :aria-label="t('product.size')">
        <button
          v-for="s in product.sizes" :key="s.ml" role="radio" :aria-checked="s.ml === ml"
          :class="{ on: s.ml === ml, off: !s.stock }" @click="ml = s.ml"
        >{{ s.ml }} ml</button>
      </div>

      <button class="add" :disabled="!size.stock" :aria-label="t('card.add')" @click="add">
        <Icon name="bag" :size="17" />
        <span>{{ size.stock ? t('card.add') : t('card.outOfStock') }}</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
/* Butik vitrinasi: rasm o'z plitasida, matn ochiq — "kartochka qutisi" yo'q */
.pc { position: relative; display: flex; flex-direction: column; min-width: 0; } /* ko'rinmas nom karta ichida qolsin (lentada sahifani kengaytirmasin) */
.media { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: var(--bg-2); border-radius: 18px; }
.media-link { position: absolute; inset: 0; }
.media-link > :deep(svg) { transition: transform .7s var(--ease); transform-origin: 50% 85%; }
.media.open .media-link > :deep(svg) { transform: scale(1.08) translateY(-2%); }
/* haqiqiy suratlar */
.media.photo { background: #fff; }
.media-link > :deep(img) { transition: transform .8s var(--ease), opacity .5s; transform-origin: 55% 60%; transform: scale(var(--sz, 1)); }
.media.open .media-link > :deep(img) { transform: scale(calc(var(--sz, 1) * 1.06)); }
.gauge-pos { position: absolute; right: 10px; bottom: 10px; }
.media-link > :deep(.alt-photo) { position: absolute; inset: 0; opacity: 0; }
.media.open .media-link > :deep(.alt-photo) { opacity: 1; }
.glint { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, .55) 48%, transparent 60%); transform: translateX(-120%); }
.media.open .glint { transition: transform 1.1s var(--ease) .1s; transform: translateX(120%); }
.media.cover .glint { background: linear-gradient(105deg, transparent 35%, rgba(255, 240, 220, .35) 48%, transparent 60%); }
.vid-badge { position: absolute; left: 12px; bottom: 12px; display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 999px; background: rgba(11, 22, 49, .72); color: #fff; font-size: 11px; font-weight: 600; backdrop-filter: blur(4px); pointer-events: none; }

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

.body { padding: 10px 2px 2px; display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.price { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; line-height: 1.15; }
.price strong { font-size: 18px; font-weight: 700; color: var(--ink); }
.pct { font-size: 12px; font-weight: 700; color: #fff; background: var(--sale); padding: 2px 6px; border-radius: 6px; }
.old { display: block; min-height: 1.1em; font-size: 12.5px; color: var(--muted); line-height: 1.1; }
.name { display: block; min-width: 0; margin-top: 2px; font-size: 13px; line-height: 1.3; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.brand { font-weight: 600; color: var(--ink); }
.brand::after { content: " · "; font-weight: 400; color: var(--muted); }
.tag { color: var(--muted); }
.name:hover .brand { color: var(--sapphire); }
.rate { font-size: 12.5px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rate .st { color: #F3B802; }
.rate .muted { color: var(--muted); }

.sizes { display: flex; gap: 4px; margin-top: 4px; }
.sizes button {
  flex: 1 1 0; min-width: 0; height: 28px; padding: 0 4px; border-radius: 8px; border: 1px solid var(--line);
  background: transparent; font-size: 12px; font-weight: 600; color: var(--ink-2); white-space: nowrap; transition: all .2s;
}
.sizes button:hover { border-color: var(--ink); }
.sizes button.on { background: var(--ink); border-color: var(--ink); color: #fff; }
.sizes button.off { text-decoration: line-through; opacity: .45; }

.add {
  display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; height: 40px; margin-top: auto;
  border-radius: 12px; border: 1px solid var(--ink); background: var(--ink); color: #fff; font-size: 13.5px; font-weight: 600; transition: all .2s;
}
.sizes + .add { margin-top: 8px; }
.add:hover { background: var(--sapphire); border-color: var(--sapphire); }
.add[disabled] { background: transparent; color: var(--muted); border-color: var(--line); cursor: default; }

@media (max-width: 767px) {
  .media { border-radius: 14px; }
  .body { padding: 8px 0 0; gap: 3px; }
  .price strong { font-size: 16px; }
  .pct { font-size: 11px; padding: 1px 5px; }
  .old { font-size: 12px; }
  .name { font-size: 12.5px; }
  .rate { font-size: 12px; }
  .sizes button { height: 28px; font-size: 11.5px; }
  .sizes + .add { margin-top: 6px; }
  .add { height: 38px; font-size: 13px; }
  .like { width: 32px; height: 32px; top: 8px; right: 8px; }
  .badges { top: 8px; left: 8px; }
  .b { font-size: 11px; padding: 4px 7px; }
  .vid-badge { left: 8px; bottom: 8px; }
  .gauge-pos { right: 8px; bottom: 8px; }
}
</style>

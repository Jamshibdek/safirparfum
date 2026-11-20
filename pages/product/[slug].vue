<script setup lang="ts">
import { getProduct, brandName, relatedProducts, useL, testimonials } from '~/lib/catalog'
import { useCart, useWishlist, useRecent, useUi } from '~/stores/shop'

const route = useRoute()
const { t } = useI18n()
const lp = useLocalePath()
const { L, noteL, familyL, seasonL, money, locale } = useL()
const cart = useCart()
const wish = useWishlist()
const recent = useRecent()
const ui = useUi()

const p = computed(() => getProduct(String(route.params.slug)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
const prod = computed(() => p.value!)

const ml = ref(prod.value.sizes.find(s => s.stock)?.ml ?? prod.value.sizes[0].ml)
const qty = ref(1)
const size = computed(() => prod.value.sizes.find(s => s.ml === ml.value)!)
const scenes = ['studio', 'notes', 'box', 'mood'] as const
const shot = ref<(typeof scenes)[number]>('studio')
const zoom = ref(false)
const more = ref(false)
const notified = ref(false)
const liked = computed(() => wish.has(prod.value.slug))
const related = computed(() => relatedProducts(prod.value, 8))
const mounted = ref(false)
const recentList = computed(() => (mounted.value ? recent.slugs.filter(s => s !== prod.value.slug).map(getProduct).filter(Boolean).slice(0, 4) : []))
const reviews = computed(() => testimonials.filter(x => x.product === prod.value.slug))

onMounted(() => { mounted.value = true; recent.push(prod.value.slug) })
watch(() => route.params.slug, () => { shot.value = 'studio'; qty.value = 1; ml.value = prod.value.sizes.find(s => s.stock)?.ml ?? 30; recent.push(prod.value.slug) })

function add() {
  cart.add(prod.value.slug, ml.value, qty.value)
  ui.notify(`${prod.value.name} · ${ml.value} ml × ${qty.value} — ${t('card.added').toLowerCase()}`, { label: t('card.openCart'), to: '#cart' })
}
function like() { ui.notify(wish.toggle(prod.value.slug) ? t('wish.added') : t('wish.removed')) }
async function share() {
  const url = location.href
  try { if (navigator.share) await navigator.share({ title: prod.value.name, url }); else { await navigator.clipboard.writeText(url); ui.notify(t('common.copied')) } } catch { /* bekor qilindi */ }
}

const title = computed(() => `${brandName(prod.value.brand)} ${prod.value.name}`)
useSeoMeta({
  title: () => `${title.value} — ${t('product.size').toLowerCase()} 30–100 ml, ${money(prod.value.sizes[0].price)} — SafirParfum`,
  description: () => L(prod.value.description).slice(0, 158),
  ogTitle: () => title.value,
  ogType: 'product' as any
})
useHead(() => ({
  link: [{ rel: 'canonical', href: `https://sefir.uz${locale.value === 'ru' ? '/ru' : ''}/product/${prod.value.slug}` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify([
      {
        '@context': 'https://schema.org', '@type': 'Product', name: title.value, brand: { '@type': 'Brand', name: brandName(prod.value.brand) },
        description: L(prod.value.description), sku: String(prod.value.id),
        aggregateRating: { '@type': 'AggregateRating', ratingValue: prod.value.rating, reviewCount: prod.value.reviews },
        offers: prod.value.sizes.map(s => ({ '@type': 'Offer', name: `${s.ml} ml`, price: s.price, priceCurrency: 'UZS', availability: s.stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `https://sefir.uz/product/${prod.value.slug}` }))
      },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('nav.home'), item: 'https://sefir.uz/' },
          { '@type': 'ListItem', position: 2, name: t('nav.catalog'), item: 'https://sefir.uz/shop' },
          { '@type': 'ListItem', position: 3, name: title.value }
        ]
      }
    ])
  }]
}))
const meter = (n: number) => Array.from({ length: 5 }, (_, i) => i < n)
</script>

<template>
  <div class="pdp">
    <div class="wrap">
      <nav class="crumbs" aria-label="breadcrumb">
        <NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span>
        <NuxtLink :to="lp('/shop')">{{ t('nav.catalog') }}</NuxtLink><span>/</span>
        <NuxtLink :to="lp({ path: '/shop', query: { brand: prod.brand } })">{{ brandName(prod.brand) }}</NuxtLink><span>/</span>
        <span>{{ prod.name }}</span>
      </nav>

      <div class="top">
        <!-- galereya -->
        <div class="gallery">
          <div class="thumbs" role="tablist">
            <button v-for="s in scenes" :key="s" role="tab" :aria-selected="shot === s" :class="{ on: shot === s }" @click="shot = s">
              <BottleArt :product="prod" :scene="s" />
            </button>
          </div>
          <button class="main-img" :aria-label="t('product.more')" @click="zoom = true">
            <Transition name="fade" mode="out-in"><BottleArt :key="shot" :product="prod" :scene="shot" /></Transition>
            <span class="zoom-ic"><Icon name="zoom" :size="18" /></span>
            <span v-if="prod.discount" class="disc">−{{ prod.discount }}%</span>
          </button>
        </div>

        <!-- ma'lumot -->
        <div class="info">
          <p class="fam">{{ prod.families.map((x, i) => i ? familyL(x).toLowerCase() : familyL(x)).join(", ") }}, {{ t(`genderOne.${prod.gender}`).toLowerCase() }}</p>
          <NuxtLink :to="lp({ path: '/shop', query: { brand: prod.brand } })" class="brand">{{ brandName(prod.brand) }}</NuxtLink>
          <h1 class="name">{{ prod.name }}</h1>
          <p class="tl">{{ L(prod.tagline) }}</p>
          <div class="rating">
            <span class="stars" :style="{ '--v': prod.rating / 5 }" aria-hidden="true">★★★★★</span>
            <span class="num">{{ prod.rating.toFixed(1) }}</span>
            <span class="muted">· {{ t('product.reviewsCount', { n: prod.reviews }) }}</span>
          </div>

          <div class="price num">
            <strong>{{ money(size.price) }}</strong>
            <s v-if="size.oldPrice && size.oldPrice > size.price">{{ money(size.oldPrice) }}</s>
            <span class="pml">{{ ml }} ml · {{ prod.concentration }}</span>
          </div>
          <p class="per muted num">{{ t('product.per') }}: {{ money(Math.round(size.price / ml / 100) * 100) }}</p>

          <div class="sizes">
            <p class="lbl">{{ t('product.size') }}</p>
            <div class="opts">
              <button v-for="s in prod.sizes" :key="s.ml" class="sz" :class="{ on: s.ml === ml, off: !s.stock }" :aria-pressed="s.ml === ml" @click="ml = s.ml">
                <svg viewBox="0 0 24 32" aria-hidden="true" :style="{ height: 14 + s.ml / 8 + 'px' }"><rect x="9" y="1" width="6" height="5" rx="1" fill="currentColor" opacity=".6" /><rect x="3" y="7" width="18" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
                <span class="szm">{{ s.ml }} ml</span>
                <span class="szp num">{{ money(s.price) }}</span>
              </button>
            </div>
          </div>

          <div v-if="size.stock" class="buy">
            <div class="qty">
              <button aria-label="-" :disabled="qty <= 1" @click="qty--"><Icon name="minus" :size="15" /></button>
              <span class="num">{{ qty }}</span>
              <button aria-label="+" :disabled="qty >= size.stock" @click="qty++"><Icon name="plus" :size="15" /></button>
            </div>
            <button class="btn grow" @click="add"><Icon name="bag" :size="18" />{{ t('product.add') }} · {{ money(size.price * qty) }}</button>
            <button class="icon-btn sq" :class="{ liked }" :aria-pressed="liked" :aria-label="t('product.wish')" @click="like"><Icon :name="liked ? 'heart-fill' : 'heart'" /></button>
          </div>
          <div v-else class="buy">
            <button class="btn ghost grow" :disabled="notified" @click="notified = true">{{ notified ? t('product.notifyDone') : t('product.notify') }}</button>
          </div>
          <p class="stock" :class="{ out: !size.stock }">
            <Icon :name="size.stock ? 'check' : 'info'" :size="16" />
            {{ size.stock ? (size.stock <= 4 ? t('product.left', { n: size.stock }) : t('product.inStock')) : t('product.out') }}
          </p>

          <ul class="perks">
            <li><Icon name="shield" :size="18" />{{ t('product.perks[0]') }}</li>
            <li><Icon name="truck" :size="18" />{{ t('product.perks[1]') }}</li>
            <li><Icon name="drop" :size="18" />{{ t('product.perks[2]') }}</li>
          </ul>
          <button class="share" @click="share"><Icon name="share" :size="16" />{{ t('common.share') }}</button>
        </div>
      </div>

      <!-- tavsif, piramida, xususiyatlar -->
      <div class="detail">
        <section class="desc">
          <h2 class="h2">{{ prod.name }}</h2>
          <p :class="{ clamp: !more }">{{ L(prod.description) }}</p>
          <button class="lnk" @click="more = !more">{{ more ? t('product.less') : t('product.more') }}</button>
        </section>

        <section class="pyr" :aria-label="t('product.pyramid')">
          <h2 class="h3">{{ t('product.pyramid') }}</h2>
          <div class="tier t1"><span class="tn">{{ t('product.top') }}</span><span class="tv">{{ prod.notes.top.map(noteL).join(', ') }}</span></div>
          <div class="tier t2"><span class="tn">{{ t('product.heart') }}</span><span class="tv">{{ prod.notes.heart.map(noteL).join(', ') }}</span></div>
          <div class="tier t3"><span class="tn">{{ t('product.base') }}</span><span class="tv">{{ prod.notes.base.map(noteL).join(', ') }}</span></div>
        </section>

        <section class="specs">
          <h2 class="h3">{{ t('product.specs') }}</h2>
          <dl>
            <div><dt>{{ t('product.season') }}</dt><dd>{{ prod.seasons.map(seasonL).join(', ') }}</dd></div>
            <div><dt>{{ t('product.time') }}</dt><dd>{{ t(`product.times.${prod.time}`) }}</dd></div>
            <div><dt>{{ t('product.longevity') }}</dt><dd class="meter"><i v-for="(on, i) in meter(prod.longevity)" :key="i" :class="{ on }" /><span class="num">{{ prod.longevity }}/5</span></dd></div>
            <div><dt>{{ t('product.sillage') }}</dt><dd class="meter"><i v-for="(on, i) in meter(prod.sillage)" :key="i" :class="{ on }" /><span class="num">{{ prod.sillage }}/5</span></dd></div>
            <div><dt>{{ t('product.concentration') }}</dt><dd>{{ prod.concentration }}</dd></div>
          </dl>
        </section>
      </div>

      <section v-if="reviews.length" class="section revs">
        <h2 class="h2">{{ t('product.reviews') }}</h2>
        <blockquote v-for="r in reviews" :key="r.id">
          <p>“{{ L(r.text) }}”</p>
          <footer>@{{ r.user }}, {{ r.source === 'instagram' ? 'Instagram' : 'Telegram' }}</footer>
        </blockquote>
      </section>

      <section class="section">
        <div class="sec-head"><h2 class="h2">{{ t('product.related') }}</h2></div>
        <ProductRail :items="related" />
      </section>

      <section v-if="recentList.length" class="section" style="padding-top: 0">
        <div class="sec-head"><h2 class="h2">{{ t('product.recent') }}</h2></div>
        <div class="grid-products"><ProductCard v-for="r in recentList" :key="r!.slug" :product="r!" /></div>
      </section>
    </div>

    <!-- mobil xarid paneli -->
    <div v-if="size.stock" class="mbar">
      <div class="num"><strong>{{ money(size.price) }}</strong><span>{{ ml }} ml</span></div>
      <button class="btn grow" @click="add"><Icon name="bag" :size="17" />{{ t('product.add') }}</button>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="zoom" class="lightbox" role="dialog" aria-modal="true" @click="zoom = false">
          <div class="lb-img"><BottleArt :product="prod" :scene="shot" /></div>
          <button class="icon-btn lb-x" :aria-label="t('common.close')"><Icon name="close" /></button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.pdp { padding-top: 24px; }
.top { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 56px; margin-top: 22px; align-items: start; }
.gallery { display: grid; grid-template-columns: 76px 1fr; gap: 14px; position: sticky; top: calc(var(--header-h) + 16px); }
.thumbs { display: grid; gap: 10px; align-content: start; }
.thumbs button { width: 76px; height: 92px; padding: 0; border: 1px solid transparent; border-radius: 12px; overflow: hidden; opacity: .65; transition: all .2s; }
.thumbs button.on { opacity: 1; border-color: var(--ink); }
.thumbs :deep(svg) { width: 100%; height: 100%; }
.main-img { position: relative; aspect-ratio: 4 / 5; border: 0; padding: 0; border-radius: 24px; overflow: hidden; cursor: zoom-in; background: var(--bg-2); }
.main-img :deep(svg) { width: 100%; height: 100%; }
.zoom-ic { position: absolute; right: 16px; bottom: 16px; width: 40px; height: 40px; border-radius: 50%; background: rgba(250, 250, 251, .9); display: grid; place-items: center; }
.disc { position: absolute; left: 16px; top: 16px; background: var(--sale); color: #fff; font-weight: 700; font-size: 13px; padding: 6px 10px; border-radius: 8px; }

.info { display: flex; flex-direction: column; gap: 8px; padding-top: 6px; }
.fam { font-size: 13.5px; color: var(--muted); }
.brand { font-weight: 600; font-size: 15px; color: var(--sapphire); align-self: flex-start; }
.name { font-family: var(--f-display); font-weight: 400; font-size: clamp(40px, 4.6vw, 64px); line-height: 1.02; letter-spacing: -.02em; }
.tl { font-size: 16px; color: var(--ink-2); }
.rating { display: flex; align-items: center; gap: 8px; font-size: 13.5px; }
.stars { font-size: 15px; letter-spacing: 2px; background: linear-gradient(90deg, var(--gold) calc(var(--v) * 100%), var(--line-2) 0); -webkit-background-clip: text; background-clip: text; color: transparent; }
.price { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-top: 18px; padding-top: 20px; border-top: 1px solid var(--line); }
.price strong { font-size: 34px; font-weight: 600; letter-spacing: -.01em; }
.price s { font-size: 17px; color: var(--muted); }
.pml { font-size: 14px; color: var(--muted); }
.per { font-size: 13px; }
.lbl { font-size: 13px; font-weight: 600; margin: 14px 0 8px; }
.opts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.sz { display: grid; justify-items: center; align-content: end; gap: 4px; padding: 14px 8px 12px; border-radius: 16px; border: 1px solid var(--line-2); background: var(--surface); color: var(--ink-2); transition: all .2s; min-height: 108px; }
.sz svg { width: auto; color: var(--muted); }
.sz:hover { border-color: var(--ink); }
.sz.on { border-color: var(--sapphire); box-shadow: inset 0 0 0 1px var(--sapphire); color: var(--ink); }
.sz.on svg { color: var(--sapphire); }
.sz.off { opacity: .5; }
.szm { font-weight: 700; font-size: 14px; }
.szp { font-size: 12.5px; color: var(--muted); }
.buy { display: flex; gap: 10px; margin-top: 16px; }
.qty { display: flex; align-items: center; border: 1px solid var(--line-2); border-radius: var(--pill); height: 48px; }
.qty button { width: 42px; height: 100%; border: 0; background: transparent; display: grid; place-items: center; }
.qty button[disabled] { opacity: .3; }
.qty span { min-width: 26px; text-align: center; font-weight: 700; }
.grow { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.sq { width: 48px; height: 48px; border: 1px solid var(--line-2); }
.sq.liked { color: var(--sale); border-color: var(--sale); }
.stock { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ok); font-weight: 500; margin-top: 4px; }
.stock.out { color: var(--sale); }
.perks { list-style: none; margin: 16px 0 0; padding: 16px 0 0; border-top: 1px solid var(--line); display: grid; gap: 10px; font-size: 14px; }
.perks li { display: flex; gap: 12px; align-items: center; }
.perks :deep(svg) { color: var(--sapphire); flex: none; }
.share { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; border: 0; background: transparent; font-size: 13px; font-weight: 600; color: var(--ink-2); padding: 8px 0; }

.detail { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr); gap: 40px; margin-top: 80px; padding-top: 48px; border-top: 1px solid var(--line); }
.desc { display: grid; gap: 14px; align-content: start; }
.desc p { font-size: 16.5px; line-height: 1.75; color: var(--ink-2); max-width: 62ch; }
.desc p.clamp { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.lnk { justify-self: start; border: 0; background: transparent; color: var(--sapphire); font-weight: 600; padding: 0; }
.pyr { display: grid; gap: 8px; align-content: start; }
.pyr h2 { margin-bottom: 6px; }
.tier { display: grid; gap: 2px; padding: 14px 18px; border-radius: 14px; background: var(--surface); border: 1px solid var(--line); margin: 0 auto; width: 100%; text-transform: none; }
.t1 { width: 72%; }
.t2 { width: 86%; }
.tn { font-size: 12.5px; color: var(--muted); }
.tv { font-family: var(--f-display); font-size: 19px; text-transform: capitalize; }
.t3 { background: var(--night); border-color: var(--night); color: #F2F3F6; }
.t3 .tn { color: var(--champagne); }
.specs dl { margin: 14px 0 0; display: grid; }
.specs dl > div { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--line); font-size: 14px; }
.specs dt { color: var(--muted); }
.specs dd { margin: 0; font-weight: 600; text-align: right; text-transform: capitalize; }
.meter { display: flex; align-items: center; gap: 4px; }
.meter i { width: 16px; height: 6px; border-radius: 3px; background: var(--line); }
.meter i.on { background: var(--sapphire); }
.meter span { margin-left: 6px; font-size: 13px; }
.revs { display: grid; gap: 16px; }
.revs blockquote { margin: 0; padding: 22px 26px; background: var(--surface); border-radius: 18px; border: 1px solid var(--line); }
.revs blockquote p { font-family: var(--f-display); font-size: 22px; line-height: 1.35; }
.revs footer { margin-top: 10px; font-size: 13px; color: var(--muted); }
.mbar { display: none; }
.lightbox { position: fixed; inset: 0; z-index: 110; background: rgba(11, 22, 49, .86); display: grid; place-items: center; cursor: zoom-out; padding: 24px; }
.lb-img { width: min(88vh, 92vw); aspect-ratio: 1; border-radius: 24px; overflow: hidden; }
.lb-x { position: absolute; top: 20px; right: 20px; background: #fff; }

@media (max-width: 1023px) {
  .top { grid-template-columns: minmax(0, 1fr); gap: 28px; }
  .gallery { position: static; grid-template-columns: 1fr; }
  .thumbs { grid-auto-flow: column; justify-content: start; order: 2; }
  .detail { grid-template-columns: 1fr; gap: 36px; margin-top: 48px; }
}
@media (max-width: 767px) {
  .thumbs button { width: 64px; height: 76px; }
  .price strong { font-size: 28px; }
  .mbar { display: flex; align-items: center; gap: 14px; position: fixed; left: 0; right: 0; bottom: calc(64px + env(safe-area-inset-bottom)); z-index: 44; padding: 10px 16px; background: var(--surface); border-top: 1px solid var(--line); }
  .mbar > div { display: grid; line-height: 1.2; }
  .mbar span { font-size: 12px; color: var(--muted); }
  .pdp { padding-bottom: 70px; }
}
</style>

<script setup lang="ts">
import { products, collections, branches, settings, matchCollection, sortProducts, getProduct, useL } from '~/lib/catalog'
import { useUi } from '~/stores/shop'

const { t, tm, rt } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const ui = useUi()

const featured = sortProducts(products.filter(p => p.featured)).slice(0, 8)
const onSale = sortProducts(products.filter(p => p.discount > 0), 'discount')
const perks = computed(() => (tm('home.perks') as any[]).map(x => rt(x)))
const perkIcons = ['shield', 'truck', 'drop', 'gift']
const sel = ref(branches[0].id)
const collArt: Record<string, string> = {
  yangi: 'amouage-guidance', top: 'creed-aventus', sovga: 'tom-ford-lost-cherry', yozgi: 'tom-ford-neroli-portofino', kechki: 'initio-side-effect', chegirma: 'giorgio-armani-stronger-with-you-intensely'
}

useSeoMeta({
  title: () => `Sefir Parfum — ${t('home.featured')}`,
  description: () => L({ uz: "Sefir Parfum — Toshkentda original atirlardan ilhomlangan 48 xil parfum. 30, 50 va 100 ml, butikda hidlab tanlash, 1 kunda yetkazib berish.", ru: 'Sefir Parfum — 48 парфюмов в Ташкенте, вдохновлённых оригинальными ароматами. 30, 50 и 100 мл, тестеры в бутике, доставка за 1 день.' }),
  ogTitle: 'Sefir Parfum'
})
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Store', name: 'Sefir Parfum', url: 'https://sefir.uz', telephone: settings.phone1, address: { '@type': 'PostalAddress', addressLocality: 'Tashkent', streetAddress: branches[0].address.uz }, openingHours: 'Mo-Su 10:00-22:00' })
  }]
})
</script>

<template>
  <div>
    <HeroSlider />

    <!-- test tasmasi -->
    <section class="wrap">
      <div v-reveal class="quiz-strip">
        <span class="qs-ic"><Icon name="sparkle" :size="22" /></span>
        <div class="qs-txt">
          <strong class="display">{{ t('home.quizStripTitle') }}</strong>
          <span>{{ t('home.quizStripText') }}</span>
        </div>
        <button class="btn" @click="ui.quiz = true">{{ t('home.quizStripBtn') }}</button>
      </div>
    </section>

    <!-- tanlanganlar -->
    <section class="section wrap">
      <div class="sec-head">
        <div><span class="overline gold">{{ t('home.featuredOver') }}</span><h2 class="h2">{{ t('home.featured') }}</h2></div>
        <NuxtLink :to="lp('/shop')" class="link-arrow">{{ t('home.seeAll') }}</NuxtLink>
      </div>
      <div class="grid-products">
        <ProductCard v-for="p in featured" :key="p.slug" v-reveal :product="p" />
      </div>
    </section>

    <!-- afzalliklar -->
    <section class="wrap">
      <ul class="perks">
        <li v-for="(x, k) in perks" :key="k"><Icon :name="perkIcons[k]" :size="22" /><span>{{ x }}</span></li>
      </ul>
    </section>

    <!-- kategoriyalar -->
    <section class="section wrap">
      <div class="sec-head">
        <div><span class="overline gold">{{ t('home.catOver') }}</span><h2 class="h2">{{ t('home.categories') }}</h2></div>
      </div>
      <CategoryTiles />
    </section>

    <!-- brendlar -->
    <section class="tight">
      <div class="wrap sec-head brands-head">
        <div><span class="overline gold">{{ t('home.brandsOver') }}</span><h2 class="h2">{{ t('home.brands') }}</h2></div>
      </div>
      <BrandStrip />
    </section>

    <!-- chegirmalar -->
    <section class="section wrap">
      <div class="sec-head">
        <div><span class="overline" style="color: var(--sale)">{{ t('home.saleOver') }}</span><h2 class="h2">{{ t('home.sale') }}</h2></div>
        <NuxtLink :to="lp('/collections/chegirma')" class="link-arrow">{{ t('home.seeAll') }}</NuxtLink>
      </div>
      <ProductRail :items="onSale" />
    </section>

    <!-- to'plamlar -->
    <section class="dark-band">
      <div class="section wrap">
        <div class="sec-head">
          <div><span class="overline gold">{{ t('home.collOver') }}</span><h2 class="h2">{{ t('home.coll') }}</h2></div>
          <NuxtLink :to="lp('/collections')" class="link-arrow light">{{ t('home.seeAll') }}</NuxtLink>
        </div>
        <div class="colls">
          <NuxtLink v-for="c in collections" :key="c.slug" v-reveal :to="lp(`/collections/${c.slug}`)" class="coll" :style="{ '--a': c.tone[0], '--b': c.tone[1] }">
            <div class="cart"><BottleArt :product="getProduct(collArt[c.slug])!" bare /></div>
            <div class="ctxt">
              <span class="cn">{{ products.filter(p => matchCollection(p, c.rule)).length }} {{ t('collections.items') }}</span>
              <strong class="display">{{ L(c.name) }}</strong>
              <span class="cd">{{ L(c.text) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- sharhlar -->
    <section class="section wrap">
      <div class="sec-head">
        <div><span class="overline gold">{{ t('home.testiOver') }}</span><h2 class="h2">{{ t('home.testi') }}</h2></div>
      </div>
      <Testimonials />
    </section>

    <!-- FAQ -->
    <section class="section wrap faq-wrap">
      <div class="faq-l">
        <span class="overline gold">{{ t('home.faqOver') }}</span>
        <h2 class="h2">{{ t('home.faq') }}</h2>
        <p class="lead">{{ t('home.faqHint') }}</p>
        <a :href="`tel:${settings.phone1.replace(/\s/g, '')}`" class="btn ghost"><Icon name="phone" :size="17" />{{ settings.phone1 }}</a>
      </div>
      <FaqList />
    </section>

    <!-- bizni toping -->
    <section class="section wrap">
      <div class="sec-head">
        <div><span class="overline gold">{{ t('home.findOver') }}</span><h2 class="h2">{{ t('home.find') }}</h2></div>
        <NuxtLink :to="lp('/locations')" class="link-arrow">{{ t('home.allBranches') }}</NuxtLink>
      </div>
      <div class="find">
        <BranchMap :selected="sel" :height="440" />
        <div class="blist">
          <button v-for="b in branches" :key="b.id" class="bi" :class="{ on: sel === b.id }" @click="sel = b.id">
            <span class="bn display">{{ L(b.name) }}</span>
            <span class="ba"><Icon name="pin" :size="15" />{{ L(b.city) }}, {{ L(b.address) }}</span>
            <span class="ba"><Icon name="clock" :size="15" />{{ b.hours }}</span>
            <span class="ba num"><Icon name="phone" :size="15" />{{ b.phone }}</span>
          </button>
          <a :href="`https://yandex.uz/maps/?rtext=~${branches.find(b => b.id === sel)!.lat},${branches.find(b => b.id === sel)!.lng}&rtt=auto`" target="_blank" rel="noopener" class="btn block">{{ t('home.route') }}</a>
        </div>
      </div>
    </section>

    <section class="wrap" style="padding-bottom: 40px">
      <CallbackForm />
    </section>
  </div>
</template>

<style scoped>
.quiz-strip { margin-top: 18px; display: flex; align-items: center; gap: 20px; padding: 18px 18px 18px 24px; border-radius: 20px; background: var(--surface); border: 1px solid var(--line); }
.qs-ic { width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; color: var(--gold); background: radial-gradient(circle, rgba(216, 195, 160, .35), transparent 70%); flex: none; }
.qs-txt { display: grid; gap: 2px; flex: 1; }
.qs-txt strong { font-size: 26px; font-weight: 600; line-height: 1.1; }
.qs-txt span { font-size: 14px; color: var(--muted); }

.perks { list-style: none; margin: 0; padding: 26px 0; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.perks li { display: flex; align-items: center; gap: 14px; padding: 0 22px; font-size: 14px; font-weight: 600; border-left: 1px solid var(--line); }
.perks li:first-child { border-left: 0; padding-left: 0; }
.perks :deep(svg) { color: var(--sapphire); flex: none; }

.brands-head { margin-bottom: 20px; }

.dark-band { background: var(--night); color: #F3EFE7; background-image: radial-gradient(80% 120% at 100% 0%, #1b2d57, transparent 60%); }
.dark-band .overline:not(.gold) { color: rgba(243, 239, 231, .6); }
.link-arrow.light { border-color: var(--champagne); color: var(--champagne); }
.colls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.coll { position: relative; height: 260px; border-radius: 20px; overflow: hidden; padding: 24px; display: flex; align-items: flex-end; background: radial-gradient(120% 120% at 85% 20%, var(--a), var(--b)); isolation: isolate; border: 1px solid rgba(255, 255, 255, .08); }
.cart { position: absolute; width: 58%; right: -8%; top: -4%; z-index: -1; transition: transform .8s var(--ease); filter: drop-shadow(0 24px 24px rgba(0, 0, 0, .35)); }
.coll:hover .cart { transform: translateY(-6px) rotate(3deg); }
.ctxt { display: grid; gap: 4px; max-width: 70%; }
.cn { font-size: 13px; opacity: .7; }
.ctxt strong { font-size: 32px; line-height: 1.02; font-weight: 600; }
.cd { font-size: 13px; opacity: .75; }

.faq-wrap { display: grid; grid-template-columns: 1fr 1.6fr; gap: 56px; align-items: start; }
.faq-l { display: grid; gap: 14px; justify-items: start; position: sticky; top: calc(var(--header-h) + 24px); }

.find { display: grid; grid-template-columns: 1.7fr 1fr; gap: 16px; }
.blist { display: grid; gap: 10px; align-content: start; }
.bi { display: grid; gap: 4px; text-align: left; padding: 16px 18px; border-radius: 16px; border: 1px solid var(--line); background: var(--surface); transition: all .2s; }
.bi.on { border-color: var(--sapphire); box-shadow: inset 0 0 0 1px var(--sapphire); }
.bn { font-size: 22px; font-weight: 600; }
.ba { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-2); }
.ba :deep(svg) { color: var(--gold); flex: none; }

@media (max-width: 1023px) {
  .perks { grid-template-columns: 1fr 1fr; row-gap: 18px; }
  .perks li:nth-child(3) { border-left: 0; padding-left: 0; }
  .colls { grid-template-columns: 1fr 1fr; }
  .faq-wrap { grid-template-columns: 1fr; gap: 24px; }
  .faq-l { position: static; }
  .find { grid-template-columns: 1fr; }
}
@media (max-width: 767px) {
  .quiz-strip { flex-wrap: wrap; padding: 18px; }
  .qs-ic { display: none; }
  .qs-txt strong { font-size: 22px; }
  .quiz-strip .btn { width: 100%; }
  .perks li { padding: 0 12px; font-size: 12.5px; gap: 10px; }
  .perks li:nth-child(odd) { border-left: 0; padding-left: 0; }
  .colls { grid-template-columns: 1fr; }
  .coll { height: 200px; }
  .sec-head { flex-wrap: wrap; margin-bottom: 22px; }
}
</style>

<script setup lang="ts">
import { brands, families, collections, counts, products, useL } from '~/lib/catalog'
import { useUi } from '~/stores/shop'

const { t } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const ui = useUi()
const famCount = (k: string) => products.filter(p => p.families.includes(k)).length
const famKeys = Object.keys(families).filter(k => famCount(k) > 0)
const hero = products.find(p => p.slug === 'maison-francis-kurkdjian-baccarat-rouge-540') ?? products[0]
</script>

<template>
  <div class="mega" @click.self="ui.mega = false">
    <div class="wrap inner">
      <div class="col">
        <p class="overline gold">{{ t('mega.byGender') }}</p>
        <NuxtLink v-for="g in ['men', 'women', 'unisex']" :key="g" :to="lp({ path: '/shop', query: { gender: g } })" class="big">
          {{ t(`gender.${g}`) }} <span class="n">{{ (counts as any)[g] }}</span>
        </NuxtLink>
        <NuxtLink :to="lp({ path: '/shop', query: { sale: '1' } })" class="big sale">{{ t('badge.sale') }} <span class="n">{{ counts.sale }}</span></NuxtLink>
        <NuxtLink :to="lp('/shop')" class="link-arrow all">{{ t('home.seeAll') }}</NuxtLink>
      </div>
      <div class="col">
        <p class="overline gold">{{ t('mega.byFamily') }}</p>
        <NuxtLink v-for="k in famKeys" :key="k" :to="lp({ path: '/shop', query: { family: k } })" class="sm">
          {{ L(families[k]) }} <span class="n">{{ famCount(k) }}</span>
        </NuxtLink>
      </div>
      <div class="col brands">
        <p class="overline gold">{{ t('mega.brands') }}</p>
        <div class="bgrid">
          <NuxtLink v-for="b in brands" :key="b.slug" :to="lp({ path: '/shop', query: { brand: b.slug } })" class="sm">{{ b.name }}</NuxtLink>
        </div>
      </div>
      <div class="col">
        <p class="overline gold">{{ t('mega.collections') }}</p>
        <NuxtLink v-for="c in collections" :key="c.slug" :to="lp(`/collections/${c.slug}`)" class="sm">{{ L(c.name) }}</NuxtLink>
        <button class="promo" @click="ui.mega = false; ui.quiz = true">
          <span class="art"><BottleArt :product="hero" scene="mood" /></span>
          <span class="ptxt">
            <strong>{{ t('mega.quizTitle') }}</strong>
            <span>{{ t('mega.quizText') }}</span>
            <span class="link-arrow light">{{ t('mega.quizBtn') }}</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mega { position: absolute; left: 0; right: 0; top: 100%; background: var(--surface); border-bottom: 1px solid var(--line); box-shadow: 0 40px 60px -40px rgba(14, 26, 51, .45); z-index: 50; }
.inner { display: grid; grid-template-columns: 1fr 1fr 1.5fr 1.3fr; gap: 40px; padding-top: 32px; padding-bottom: 36px; }
.col { display: flex; flex-direction: column; gap: 4px; }
.col .overline { margin-bottom: 10px; }
.big { font-family: var(--f-display); font-size: 28px; font-weight: 600; line-height: 1.25; display: flex; align-items: baseline; gap: 8px; }
.big:hover, .sm:hover { color: var(--sapphire); }
.big.sale { color: var(--sale); }
.n { font-family: var(--f-ui); font-size: 11.5px; font-weight: 600; color: var(--muted); }
.all { align-self: flex-start; margin-top: 14px; }
.sm { font-size: 14.5px; padding: 5px 0; display: flex; justify-content: space-between; gap: 8px; }
.bgrid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; }
.promo { margin-top: 16px; display: grid; grid-template-columns: 96px 1fr; gap: 14px; align-items: center; text-align: left; padding: 10px; border-radius: 16px; border: 0; background: var(--night); color: #F3EFE7; }
.art { width: 96px; height: 96px; border-radius: 12px; overflow: hidden; }
.ptxt { display: grid; gap: 4px; font-size: 12.5px; color: rgba(243, 239, 231, .75); }
.ptxt strong { font-family: var(--f-display); font-size: 21px; color: #fff; font-weight: 600; }
.link-arrow.light { color: var(--champagne); border-color: var(--champagne); justify-self: start; margin-top: 4px; }
</style>

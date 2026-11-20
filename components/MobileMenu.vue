<script setup lang="ts">
import { settings, collections, useL } from '~/lib/catalog'
import { useUi } from '~/stores/shop'
import { useAccount } from '~/stores/account'
const { t } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const ui = useUi()
const acc = useAccount()
const close = () => (ui.menu = false)
function account() {
  close()
  if (acc.loggedIn) navigateTo(lp('/account'))
  else ui.login = true
}
</script>

<template>
  <div class="mm">
    <div class="drawer-head">
      <Logo compact />
      <button class="icon-btn" :aria-label="t('common.close')" @click="close"><Icon name="close" /></button>
    </div>
    <div class="drawer-body">
      <p class="overline gold">{{ t('mega.byGender') }}</p>
      <div class="gs">
        <NuxtLink v-for="g in ['men', 'women', 'unisex']" :key="g" :to="lp({ path: '/shop', query: { gender: g } })" @click="close">{{ t(`gender.${g}`) }}</NuxtLink>
      </div>
      <nav class="links">
        <NuxtLink :to="lp('/')" @click="close">{{ t('nav.home') }}</NuxtLink>
        <NuxtLink :to="lp('/shop')" @click="close">{{ t('nav.catalog') }}</NuxtLink>
        <NuxtLink :to="lp('/collections')" @click="close">{{ t('nav.collections') }}</NuxtLink>
        <NuxtLink :to="lp('/about')" @click="close">{{ t('nav.about') }}</NuxtLink>
        <NuxtLink :to="lp('/locations')" @click="close">{{ t('nav.locations') }}</NuxtLink>
        <NuxtLink :to="lp('/contact')" @click="close">{{ t('nav.contact') }}</NuxtLink>
        <button @click="account">{{ t('nav.account') }}</button>
      </nav>
      <p class="overline gold">{{ t('mega.collections') }}</p>
      <div class="chips">
        <NuxtLink v-for="c in collections" :key="c.slug" :to="lp(`/collections/${c.slug}`)" class="chip soft" @click="close">{{ L(c.name) }}</NuxtLink>
      </div>
    </div>
    <div class="drawer-foot">
      <a :href="`tel:${settings.phone1.replace(/\s/g, '')}`" class="btn ghost block"><Icon name="phone" :size="17" />{{ settings.phone1 }}</a>
      <a :href="settings.telegram" target="_blank" rel="noopener" class="btn block" style="margin-top: 10px"><Icon name="telegram" :size="17" />Telegram</a>
    </div>
  </div>
</template>

<style scoped>
.mm { position: fixed; top: 0; left: 0; bottom: 0; width: min(380px, 88vw); z-index: 90; background: var(--bg); display: flex; flex-direction: column; box-shadow: var(--shadow-pop); }
.gs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 10px 0 22px; }
.gs a { display: grid; place-items: center; height: 64px; border-radius: 14px; background: var(--night); color: #F3EFE7; font-family: var(--f-display); font-size: 20px; font-weight: 600; }
.links { display: grid; margin-bottom: 22px; }
.links a, .links button { text-align: left; border: 0; background: transparent; border-bottom: 1px solid var(--line); padding: 14px 0; font-size: 17px; font-weight: 500; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
</style>

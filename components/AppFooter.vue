<script setup lang="ts">
import { settings, branches, useL } from '~/lib/catalog'
const { t } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const year = 2026
const socials = [
  ['instagram', settings.instagram], ['telegram', settings.telegram], ['youtube', settings.youtube], ['tiktok', settings.tiktok], ['facebook', settings.facebook]
]
</script>

<template>
  <footer class="ft">
    <div class="wrap grid">
      <div class="brand">
        <Logo light />
        <p class="tl">{{ t('footer.tagline') }}</p>
        <div class="soc">
          <a v-for="[n, u] in socials" :key="n" :href="u" target="_blank" rel="noopener" :aria-label="n"><Icon :name="n" :size="18" /></a>
        </div>
      </div>
      <div>
        <p class="h">{{ t('footer.catalog') }}</p>
        <NuxtLink :to="lp('/shop')">{{ t('gender.all') }}</NuxtLink>
        <NuxtLink :to="lp({ path: '/shop', query: { gender: 'men' } })">{{ t('gender.men') }}</NuxtLink>
        <NuxtLink :to="lp({ path: '/shop', query: { gender: 'women' } })">{{ t('gender.women') }}</NuxtLink>
        <NuxtLink :to="lp({ path: '/shop', query: { gender: 'unisex' } })">{{ t('gender.unisex') }}</NuxtLink>
        <NuxtLink :to="lp('/collections/yangi')">{{ t('badge.new') }}</NuxtLink>
        <NuxtLink :to="lp('/collections/chegirma')">{{ t('badge.sale') }}</NuxtLink>
      </div>
      <div>
        <p class="h">{{ t('footer.company') }}</p>
        <NuxtLink :to="lp('/about')">{{ t('nav.about') }}</NuxtLink>
        <NuxtLink :to="lp('/locations')">{{ t('nav.locations') }}</NuxtLink>
        <NuxtLink :to="lp('/contact')">{{ t('nav.contact') }}</NuxtLink>
        <NuxtLink :to="lp('/delivery')">{{ t('footer.delivery') }}</NuxtLink>
        <NuxtLink :to="lp('/returns')">{{ t('footer.returns') }}</NuxtLink>
        <NuxtLink :to="lp('/offer')">{{ t('footer.offer') }}</NuxtLink>
      </div>
      <div class="contacts">
        <p class="h">{{ t('footer.contacts') }}</p>
        <NuxtLink :to="lp('/locations')" class="ln"><Icon name="pin" :size="16" />{{ L(branches[0].city) }}, {{ L(branches[0].address) }}</NuxtLink>
        <a :href="`tel:${settings.phone1.replace(/\s/g, '')}`" class="ln num"><Icon name="phone" :size="16" />{{ settings.phone1 }}</a>
        <a :href="`tel:${settings.phone2.replace(/\s/g, '')}`" class="ln num"><Icon name="phone" :size="16" />{{ settings.phone2 }}</a>
        <span class="ln"><Icon name="clock" :size="16" />{{ settings.hours }}</span>
      </div>
    </div>
    <div class="wrap bottom">
      <span>© {{ year }} Sefir Parfum · sefir.uz. {{ t('footer.rights') }}</span>
      <span class="demo">{{ t('footer.demo') }}</span>
    </div>
  </footer>
</template>

<style scoped>
.ft { background: var(--night); color: rgba(243, 239, 231, .72); padding-top: 64px; margin-top: 40px; position: relative; overflow: hidden; }
.ft::before { content: ''; position: absolute; right: -140px; top: -160px; width: 520px; height: 520px; border-radius: 50%; background: radial-gradient(circle, rgba(43, 86, 160, .35), transparent 65%); pointer-events: none; }
.grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.3fr; gap: 40px; position: relative; }
.tl { margin: 18px 0 20px; max-width: 30ch; font-size: 14px; }
.h { font-family: var(--f-display); font-size: 19px; color: var(--champagne); margin-bottom: 14px; }
.grid a, .grid span.ln { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; padding: 5px 0; transition: color .2s; }
.grid a:hover { color: #fff; }
.ln :deep(svg) { margin-top: 3px; flex: none; color: var(--champagne); }
.soc { display: flex; gap: 8px; }
.soc a { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(243, 239, 231, .2); display: grid !important; place-items: center; padding: 0 !important; }
.soc a:hover { border-color: var(--champagne); color: var(--champagne); }
.bottom { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-top: 22px; padding-bottom: 26px; margin-top: 44px; border-top: 1px solid rgba(243, 239, 231, .12); font-size: 12.5px; position: relative; }
.demo { color: var(--champagne); opacity: .8; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } .brand { grid-column: 1 / -1; } }
</style>

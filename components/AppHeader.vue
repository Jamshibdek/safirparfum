<script setup lang="ts">
import { settings, useL } from '~/lib/catalog'
import { useCart, useWishlist, useUi } from '~/stores/shop'

const { t } = useI18n()
const lp = useLocalePath()
const route = useRoute()
const { money } = useL()
const cart = useCart()
const wish = useWishlist()
const ui = useUi()
const mounted = ref(false)
const scrolled = ref(false)
const megaRoot = ref<HTMLElement | null>(null)

const nav = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/shop', label: t('nav.catalog') },
  { to: '/collections', label: t('nav.collections') },
  { to: '/about', label: t('nav.about') },
  { to: '/contact', label: t('nav.contact') }
])
const isActive = (to: string) => {
  const p = route.path.replace(/^\/ru(?=\/|$)/, '') || '/'
  return to === '/' ? p === '/' : p.startsWith(to)
}

function onScroll() { scrolled.value = window.scrollY > 8 }
function outside(e: MouseEvent) { if (ui.mega && megaRoot.value && !megaRoot.value.contains(e.target as Node)) ui.mega = false }
function key(e: KeyboardEvent) { if (e.key === 'Escape') ui.mega = false }
onMounted(() => {
  mounted.value = true
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('mousedown', outside)
  document.addEventListener('keydown', key)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('mousedown', outside)
  document.removeEventListener('keydown', key)
})
watch(() => route.fullPath, () => { ui.mega = false; ui.menu = false })
</script>

<template>
  <header ref="megaRoot" class="hdr" :class="{ scrolled }">
    <div class="top">
      <div class="wrap row1">
        <button class="icon-btn only-m" :aria-label="t('nav.menu')" @click="ui.menu = true"><Icon name="menu" :size="22" /></button>
        <NuxtLink :to="lp('/')" class="logo-link" aria-label="Sefir Parfum"><Logo /></NuxtLink>

        <nav class="nav only-d" aria-label="Asosiy">
          <NuxtLink v-for="n in nav" :key="n.to" :to="lp(n.to)" :class="{ on: isActive(n.to) }">{{ n.label }}</NuxtLink>
        </nav>

        <div class="tools">
          <a :href="`tel:${settings.phone1.replace(/\s/g, '')}`" class="phone only-d">
            <span class="pn num">{{ settings.phone1 }}</span>
            <span class="ph">{{ t('header.hours') }} {{ settings.hours }}</span>
          </a>
          <LangSwitch />
          <NuxtLink :to="lp('/wishlist')" class="icon-btn only-d" :aria-label="t('nav.wishlist')">
            <Icon name="heart" />
            <span v-if="mounted && wish.count" class="badge-dot">{{ wish.count }}</span>
          </NuxtLink>
          <a :href="settings.telegram" target="_blank" rel="noopener" class="btn sm tg only-d"><Icon name="telegram" :size="16" />{{ t('header.telegram') }}</a>
          <button class="icon-btn only-m" data-cart-target :aria-label="t('nav.cart')" @click="ui.cart = true">
            <Icon name="bag" :size="22" />
            <span v-if="mounted && cart.count" class="badge-dot">{{ cart.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="band">
      <div class="wrap row2">
        <button class="cat only-d" :class="{ on: ui.mega }" :aria-expanded="ui.mega" @click="ui.mega = !ui.mega">
          <Icon :name="ui.mega ? 'close' : 'grid'" :size="17" />
          {{ t('nav.catalog') }}
        </button>
        <SearchBox dark />
        <button class="cart-btn only-d" data-cart-target @click="ui.cart = true">
          <Icon name="bag" :size="19" />
          <span>{{ t('nav.cart') }}</span>
          <template v-if="mounted && cart.count">
            <span class="cnt">{{ cart.count }}</span>
            <span class="sum num">{{ money(cart.subtotal) }}</span>
          </template>
        </button>
      </div>
    </div>

    <Transition name="fade">
      <MegaMenu v-if="ui.mega" />
    </Transition>
  </header>
</template>

<style scoped>
.hdr { position: sticky; top: 0; z-index: 40; }
.top { background: var(--surface); border-bottom: 1px solid var(--line); }
.row1 { display: flex; align-items: center; gap: 28px; height: 72px; }
.logo-link { flex: none; }
.nav { display: flex; gap: 4px; }
.nav a { position: relative; padding: 8px 12px; font-size: 14px; font-weight: 500; color: var(--ink-2); border-radius: var(--pill); white-space: nowrap; }
.nav a:hover { color: var(--ink); background: rgba(18, 19, 24, .05); }
.nav a.on { color: var(--ink); font-weight: 700; }
.nav a.on::after { content: ''; position: absolute; left: 50%; bottom: 0; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: var(--sapphire); }
.tools { margin-left: auto; display: flex; align-items: center; gap: 4px; }
.phone { display: grid; text-align: right; margin-right: 10px; line-height: 1.2; white-space: nowrap; }
.pn { font-weight: 700; font-size: 15px; }
.ph { font-size: 11.5px; color: var(--muted); }
.tg { margin-left: 6px; }

.band { background: var(--night); background-image: radial-gradient(120% 140% at 10% 0%, #1b2d57 0%, transparent 55%); }
.row2 { display: flex; align-items: center; gap: 14px; height: 64px; }
.cat {
  display: inline-flex; align-items: center; gap: 10px; height: 48px; padding: 0 22px; border: 0;
  border-radius: var(--pill); background: var(--champagne); color: var(--ink); font-weight: 700; font-size: 14px; flex: none; transition: background .2s;
}
.cat:hover, .cat.on { background: #E6D3B0; }
.cart-btn {
  flex: none; display: inline-flex; align-items: center; gap: 10px; height: 48px; padding: 0 18px;
  border-radius: var(--pill); border: 1px solid rgba(243, 239, 231, .28); background: transparent; color: #F3EFE7; font-weight: 600; font-size: 14px; transition: border-color .2s, background .2s;
}
.cart-btn:hover { border-color: rgba(243, 239, 231, .7); background: rgba(255, 255, 255, .04); }
.cnt { min-width: 22px; height: 22px; border-radius: 11px; background: var(--champagne); color: var(--ink); font-size: 11.5px; font-weight: 800; display: grid; place-items: center; padding: 0 6px; }
.sum { font-size: 13px; color: rgba(243, 239, 231, .75); font-weight: 500; }
.scrolled .band { box-shadow: 0 12px 30px -18px rgba(14, 26, 51, .7); }

.only-m { display: none; }
@media (max-width: 1280px) { .nav a { padding: 8px 8px; font-size: 13.5px; } .phone .ph { display: none; } .row1 { gap: 16px; } .tg { width: 42px; padding: 0; font-size: 0; gap: 0; } }
@media (max-width: 1023px) { .phone { display: none; } .nav { display: none; } }
@media (max-width: 767px) {
  .only-d { display: none !important; }
  .only-m { display: inline-grid; }
  .row1 { height: 60px; gap: 6px; }
  .logo-link { margin-right: auto; }
  .tools { margin-left: 0; }
  .row2 { height: 56px; }
}
</style>

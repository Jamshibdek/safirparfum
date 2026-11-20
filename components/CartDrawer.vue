<script setup lang="ts">
import { brandName, useL, settings } from '~/lib/catalog'
import { useCart, useUi } from '~/stores/shop'
const { t } = useI18n()
const lp = useLocalePath()
const { money } = useL()
const cart = useCart()
const ui = useUi()
const progress = computed(() => Math.min(100, (cart.subtotal / settings.delivery.freeFrom) * 100))
function checkout() { ui.cart = false; navigateTo(lp('/checkout')) }
</script>

<template>
  <aside class="drawer" role="dialog" aria-modal="true" :aria-label="t('cart.title')">
    <div class="drawer-head">
      <h2 class="h3">{{ t('cart.title') }} <span v-if="cart.count" class="c">{{ cart.count }}</span></h2>
      <button class="icon-btn" :aria-label="t('common.close')" @click="ui.cart = false"><Icon name="close" /></button>
    </div>

    <template v-if="cart.items.length">
      <div class="free">
        <p v-if="cart.toFree > 0">{{ t('cart.toFree', { sum: money(cart.toFree) }) }}</p>
        <p v-else class="ok"><Icon name="truck" :size="16" /> {{ t('cart.free') }}</p>
        <div class="bar"><span :style="{ width: progress + '%' }" /></div>
      </div>
      <div class="drawer-body">
        <TransitionGroup name="fade" tag="ul" class="lines">
          <li v-for="it in cart.items" :key="it.slug + it.ml" class="line">
            <NuxtLink :to="lp(`/product/${it.slug}`)" class="th" @click="ui.cart = false"><BottleArt :product="it.p" /></NuxtLink>
            <div class="info">
              <span class="br">{{ brandName(it.p.brand) }}</span>
              <NuxtLink :to="lp(`/product/${it.slug}`)" class="nm" @click="ui.cart = false">{{ it.p.name }}</NuxtLink>
              <span class="ml">{{ it.ml }} ml · {{ money(it.size.price) }}</span>
              <div class="qty">
                <button :aria-label="'-'" @click="cart.setQty(it.slug, it.ml, it.qty - 1)"><Icon name="minus" :size="14" /></button>
                <span class="num">{{ it.qty }}</span>
                <button :aria-label="'+'" @click="cart.setQty(it.slug, it.ml, it.qty + 1)"><Icon name="plus" :size="14" /></button>
              </div>
            </div>
            <div class="right">
              <strong class="num">{{ money(it.total) }}</strong>
              <button class="rm" :aria-label="t('cart.remove')" @click="cart.remove(it.slug, it.ml)"><Icon name="trash" :size="17" /></button>
            </div>
          </li>
        </TransitionGroup>
      </div>
      <div class="drawer-foot">
        <div class="tot"><span>{{ t('cart.total') }}</span><strong class="num">{{ money(cart.subtotal) }}</strong></div>
        <button class="btn block" @click="checkout">{{ t('cart.checkout') }} · {{ money(cart.subtotal) }}</button>
      </div>
    </template>

    <div v-else class="empty">
      <svg viewBox="0 0 120 120" width="120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="#ECE6DA" /><path d="M38 50h44l-4 38H42l-4-38Zm10 0v-4a12 12 0 0 1 24 0v4" fill="none" stroke="#A8844F" stroke-width="2.5" stroke-linecap="round" /></svg>
      <h3 class="h3">{{ t('cart.empty') }}</h3>
      <p class="muted">{{ t('cart.emptyText') }}</p>
      <NuxtLink :to="lp('/shop')" class="btn" @click="ui.cart = false">{{ t('cart.toCatalog') }}</NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
.c { font-family: var(--f-ui); font-size: 13px; font-weight: 700; vertical-align: middle; background: var(--ink); color: #fff; border-radius: 10px; padding: 2px 8px; margin-left: 6px; }
.free { padding: 14px 24px; border-bottom: 1px solid var(--line); font-size: 13px; }
.free .ok { color: var(--ok); font-weight: 600; display: flex; gap: 6px; align-items: center; }
.bar { height: 4px; border-radius: 2px; background: var(--bg-2); margin-top: 8px; overflow: hidden; }
.bar span { display: block; height: 100%; background: linear-gradient(90deg, var(--sapphire), var(--sapphire-2)); transition: width .5s var(--ease); }
.lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.line { display: grid; grid-template-columns: 84px 1fr auto; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
.th { width: 84px; height: 84px; border-radius: 12px; overflow: hidden; }
.info { display: grid; gap: 2px; align-content: start; min-width: 0; }
.br { font-size: 11.5px; font-weight: 600; color: var(--muted); }
.nm { font-family: var(--f-display); font-size: 19px; font-weight: 600; line-height: 1.1; }
.ml { font-size: 12.5px; color: var(--muted); }
.qty { display: inline-flex; align-items: center; margin-top: 6px; border: 1px solid var(--line); border-radius: var(--pill); width: max-content; }
.qty button { width: 32px; height: 30px; border: 0; background: transparent; display: grid; place-items: center; }
.qty span { min-width: 22px; text-align: center; font-weight: 700; font-size: 13.5px; }
.right { display: grid; justify-items: end; align-content: space-between; }
.right strong { font-size: 14.5px; white-space: nowrap; }
.rm { border: 0; background: transparent; color: var(--muted); width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; }
.rm:hover { color: var(--sale); background: rgba(178, 58, 46, .08); }
.tot { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
.tot strong { font-size: 22px; }
.empty { flex: 1; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; padding: 24px; }
</style>

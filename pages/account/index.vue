<script setup lang="ts">
import { getProduct, useL } from '~/lib/catalog'
import { formatPhone } from '~/utils/text'
import { useCart, useUi, useWishlist } from '~/stores/shop'
import { useAccount } from '~/stores/account'

const { t } = useI18n()
const lp = useLocalePath()
const { money } = useL()
const acc = useAccount()
const cart = useCart()
const ui = useUi()
const wish = useWishlist()
const tab = ref<'orders' | 'addresses' | 'profile'>('orders')
const profile = reactive({ name: acc.user?.name ?? '', birthday: acc.user?.birthday ?? '' })
const addr = reactive({ label: '', city: 'Toshkent', street: '' })
const adding = ref(false)

function repeat(id: string) {
  const o = acc.orders.find(x => x.id === id)
  o?.lines.forEach(l => { if (getProduct(l.slug)) cart.add(l.slug, l.ml, l.qty) })
  ui.cart = true
}
function saveProfile() {
  if (!acc.user) return
  acc.user = { ...acc.user, name: profile.name.trim() || acc.user.name, birthday: profile.birthday }
  ui.notify(t('account.saved'))
}
function saveAddr() {
  if (addr.street.trim().length < 5) return
  acc.addAddress({ label: addr.label.trim() || 'Uy', city: addr.city, street: addr.street.trim() })
  Object.assign(addr, { label: '', street: '' }); adding.value = false
}
function logout() { acc.logout(); navigateTo(lp('/')) }
const fmt = (s: string) => new Date(s).toLocaleDateString('ru-RU')
useSeoMeta({ title: () => `${t('account.title')} — SafirParfum`, robots: 'noindex' })
</script>

<template>
  <div class="wrap acc">
    <div v-if="!acc.user" class="need card">
      <Logo compact />
      <h1 class="h2">{{ t('account.title') }}</h1>
      <p class="lead">{{ t('account.needLogin') }}</p>
      <button class="btn" @click="ui.login = true">{{ t('account.login') }}</button>
    </div>

    <template v-else>
      <header class="head">
        <div>
          <h1 class="h1">{{ t('account.hello', { name: acc.user.name }) }}</h1>
          <p class="muted num">{{ formatPhone(acc.user.phone) }}</p>
        </div>
        <button class="btn ghost sm" @click="logout">{{ t('account.logout') }}</button>
      </header>

      <div class="tabs" role="tablist">
        <button v-for="k in (['orders', 'addresses', 'profile'] as const)" :key="k" role="tab" :aria-selected="tab === k" :class="{ on: tab === k }" @click="tab = k">
          {{ t(`account.${k}`) }}<span v-if="k === 'orders' && acc.orders.length" class="n">{{ acc.orders.length }}</span>
        </button>
        <NuxtLink :to="lp('/wishlist')" class="tablink">{{ t('account.wishlist') }}<span v-if="wish.count" class="n">{{ wish.count }}</span></NuxtLink>
      </div>

      <section v-if="tab === 'orders'" class="pane">
        <div v-if="!acc.orders.length" class="empty">
          <p>{{ t('account.noOrders') }}</p>
          <NuxtLink :to="lp('/shop')" class="btn">{{ t('cart.toCatalog') }}</NuxtLink>
        </div>
        <article v-for="o in acc.orders" :key="o.id" class="ord">
          <div class="oh">
            <strong class="num">№ {{ o.id }}</strong>
            <span class="muted num">{{ fmt(o.createdAt) }}</span>
            <span class="st" :class="o.status">{{ t(`status.${o.status}`) }}</span>
            <strong class="num sum">{{ money(o.total) }}</strong>
          </div>
          <div class="ol">
            <NuxtLink v-for="l in o.lines" :key="l.slug + l.ml" :to="lp(`/product/${l.slug}`)" class="th" :title="`${l.name} · ${l.ml} ml × ${l.qty}`">
              <BottleArt v-if="getProduct(l.slug)" :product="getProduct(l.slug)!" />
            </NuxtLink>
            <span class="muted desc">{{ o.lines.map(l => `${l.name} ${l.ml} ml × ${l.qty}`).join(', ') }}</span>
          </div>
          <div class="oa">
            <NuxtLink :to="lp(`/order/${o.id}`)" class="lnk">{{ t('product.more') }}</NuxtLink>
            <button class="btn sm" @click="repeat(o.id)">{{ t('account.repeat') }}</button>
          </div>
        </article>
      </section>

      <section v-else-if="tab === 'addresses'" class="pane">
        <p v-if="!acc.addresses.length && !adding" class="muted">{{ t('account.noAddr') }}</p>
        <div v-for="a in acc.addresses" :key="a.id" class="ad">
          <div><strong>{{ a.label }}</strong> <span v-if="a.main" class="main">{{ t('account.main') }}</span><p class="muted">{{ a.city }}, {{ a.street }}</p></div>
          <div class="adb">
            <button v-if="!a.main" class="lnk" @click="acc.setMain(a.id)">{{ t('account.makeMain') }}</button>
            <button class="icon-btn" :aria-label="t('cart.remove')" @click="acc.removeAddress(a.id)"><Icon name="trash" :size="17" /></button>
          </div>
        </div>
        <form v-if="adding" class="af" @submit.prevent="saveAddr">
          <label class="field"><span>{{ t('account.label') }}</span><input v-model="addr.label" class="input"></label>
          <label class="field"><span>{{ t('checkout.city') }}</span><input v-model="addr.city" class="input"></label>
          <label class="field wide"><span>{{ t('checkout.street') }}</span><input v-model="addr.street" class="input" :placeholder="t('checkout.streetPh')"></label>
          <button class="btn" type="submit">{{ t('account.save') }}</button>
        </form>
        <button v-else class="btn ghost" @click="adding = true"><Icon name="plus" :size="16" />{{ t('account.addAddr') }}</button>
      </section>

      <section v-else class="pane">
        <form class="pf" @submit.prevent="saveProfile">
          <label class="field"><span>{{ t('form.name') }}</span><input v-model="profile.name" class="input"></label>
          <label class="field"><span>{{ t('form.phone') }}</span><input class="input num" :value="formatPhone(acc.user.phone)" disabled></label>
          <label class="field"><span>{{ t('account.birthday') }}</span><input v-model="profile.birthday" type="date" class="input"><small class="muted">{{ t('account.birthdayHint') }}</small></label>
          <button class="btn" type="submit">{{ t('account.save') }}</button>
        </form>
      </section>
    </template>
  </div>
</template>

<style scoped>
.acc { padding-top: 40px; padding-bottom: 40px; min-height: 60vh; }
.need { max-width: 520px; margin: 0 auto; padding: 40px; display: grid; gap: 14px; justify-items: start; border-radius: 24px; }
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
.tabs { display: flex; gap: 4px; margin: 28px 0 24px; border-bottom: 1px solid var(--line); overflow-x: auto; }
.tabs button, .tablink { border: 0; background: transparent; padding: 12px 16px; font-size: 14.5px; font-weight: 500; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; display: inline-flex; gap: 8px; align-items: center; }
.tabs .on { color: var(--ink); border-color: var(--ink); font-weight: 600; }
.n { font-size: 11px; background: var(--bg-2); border-radius: 8px; padding: 1px 7px; color: var(--ink); }
.pane { display: grid; gap: 12px; max-width: 900px; }
.empty { display: grid; justify-items: start; gap: 14px; padding: 20px 0; }
.ord { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: 18px 20px; display: grid; gap: 14px; }
.oh { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.sum { margin-left: auto; }
.st { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 8px; background: rgba(30, 63, 138, .1); color: var(--sapphire); }
.st.delivered { background: rgba(46, 107, 82, .12); color: var(--ok); }
.st.cancelled { background: rgba(179, 38, 30, .1); color: var(--sale); }
.ol { display: flex; align-items: center; gap: 8px; }
.th { width: 48px; height: 48px; border-radius: 10px; overflow: hidden; flex: none; }
.desc { font-size: 13px; margin-left: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oa { display: flex; justify-content: flex-end; align-items: center; gap: 16px; }
.lnk { border: 0; background: transparent; color: var(--sapphire); font-weight: 600; font-size: 13.5px; padding: 0; }
.ad { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 20px; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; }
.main { font-size: 11.5px; background: var(--ink); color: #fff; border-radius: 6px; padding: 2px 8px; margin-left: 6px; }
.adb { display: flex; align-items: center; gap: 8px; }
.af, .pf { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: end; max-width: 640px; }
.af .wide { grid-column: 1 / -1; }
.af .btn, .pf .btn { justify-self: start; }
@media (max-width: 640px) { .af, .pf { grid-template-columns: 1fr; } .head { flex-direction: column; align-items: flex-start; } }
</style>

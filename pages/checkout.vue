<script setup lang="ts">
// Buyurtma rasmiylashtirish (mock). Buyurtma brauzerda saqlanadi; backend kelganda POST /orders ga yuboriladi.
import { branches, settings, brandName, useL } from '~/lib/catalog'
import { isValidPhone } from '~/utils/text'
import { useCart } from '~/stores/shop'
import { useAccount } from '~/stores/account'

const { t } = useI18n()
const lp = useLocalePath()
const { L, money } = useL()
const cart = useCart()
const acc = useAccount()

const REGIONS = ['Toshkent', 'Toshkent viloyati', 'Samarqand', 'Buxoro', 'Andijon', 'Farg\'ona', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', 'Qoraqalpog\'iston']

const form = reactive({
  name: acc.user?.name ?? '', phone: acc.user?.phone ?? '', phone2: '',
  method: 'delivery' as 'delivery' | 'pickup', city: 'Toshkent', street: acc.addresses.find(a => a.main)?.street ?? '', note: '',
  branch: branches[0].slug, payment: 'cash' as 'cash' | 'card'
})
const promoInput = ref(cart.promo)
const promoMsg = ref<{ ok: boolean; text: string } | null>(null)
const touched = reactive<Record<string, boolean>>({})
const sending = ref(false)

const errors = computed(() => {
  const e: Record<string, string> = {}
  if (form.name.trim().length < 2 || !/^[\p{L}\s'’ʻ-]+$/u.test(form.name.trim())) e.name = t('form.badName')
  if (!isValidPhone(form.phone)) e.phone = t('form.badPhone')
  if (form.phone2 && !isValidPhone(form.phone2)) e.phone2 = t('form.badPhone')
  if (form.method === 'delivery' && form.street.trim().length < 5) e.street = t('form.short')
  return e
})
const valid = computed(() => !Object.keys(errors.value).length && cart.items.length > 0)
const show = (k: string) => (touched[k] || touched.submit) && errors.value[k]

const shipping = computed(() => {
  if (form.method === 'pickup') return 0
  if (cart.subtotal - cart.discount >= settings.delivery.freeFrom) return 0
  return form.city === 'Toshkent' ? settings.delivery.tashkent : settings.delivery.regions
})
const total = computed(() => Math.max(0, cart.subtotal - cart.discount + shipping.value))

function applyPromo() {
  cart.promo = promoInput.value.trim()
  const p = cart.promoInfo
  if (!p) { promoMsg.value = { ok: false, text: t('checkout.promoBad') }; cart.promo = ''; return }
  if (cart.subtotal < p.min) { promoMsg.value = { ok: false, text: t('checkout.promoMin', { sum: money(p.min) }) }; return }
  promoMsg.value = { ok: true, text: `${t('checkout.promoOk')}: −${money(cart.discount)}` }
}

async function submit() {
  touched.submit = true
  if (!valid.value) {
    nextTick(() => document.querySelector('.input.err')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    return
  }
  sending.value = true
  await new Promise(r => setTimeout(r, 700))
  const order = acc.placeOrder({
    lines: cart.items.map(i => ({ slug: i.slug, ml: i.ml, qty: i.qty, name: i.p.name, brand: brandName(i.p.brand), price: i.size.price })),
    subtotal: cart.subtotal, delivery: shipping.value, discount: cart.discount, total: total.value,
    method: form.method, payment: form.payment,
    customer: { name: form.name.trim(), phone: form.phone, phone2: form.phone2 || undefined },
    address: form.method === 'delivery' ? { city: form.city, street: form.street.trim(), note: form.note.trim() || undefined } : undefined,
    branch: form.method === 'pickup' ? form.branch : undefined
  })
  if (!acc.user) acc.login(form.phone, form.name.trim())
  cart.clear()
  navigateTo(lp(`/order/${order.id}`))
}
useSeoMeta({ title: () => `${t('checkout.title')} — SafirParfum`, robots: 'noindex' })
</script>

<template>
  <div class="wrap co">
    <nav class="crumbs"><NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span><span>{{ t('checkout.title') }}</span></nav>
    <h1 class="h1">{{ t('checkout.title') }}</h1>

    <div v-if="!cart.items.length" class="empty">
      <p class="lead">{{ t('checkout.emptyCart') }}</p>
      <NuxtLink :to="lp('/shop')" class="btn">{{ t('cart.toCatalog') }}</NuxtLink>
    </div>

    <form v-else class="grid" novalidate @submit.prevent="submit">
      <div class="left">
        <fieldset class="blk">
          <legend class="h3">{{ t('checkout.contact') }}</legend>
          <div class="two">
            <label class="field"><span>{{ t('checkout.fio') }} *</span>
              <input v-model="form.name" class="input" :class="{ err: show('name') }" autocomplete="name" @blur="touched.name = true">
              <small v-if="show('name')" class="field-err">{{ errors.name }}</small>
            </label>
            <label class="field"><span>{{ t('form.phone') }} *</span>
              <PhoneInput v-model="form.phone" :err="!!show('phone')" @blur="touched.phone = true" />
              <small v-if="show('phone')" class="field-err">{{ errors.phone }}</small>
            </label>
            <label class="field"><span>{{ t('form.phone2') }}</span>
              <PhoneInput v-model="form.phone2" :err="!!show('phone2')" @blur="touched.phone2 = true" />
              <small v-if="show('phone2')" class="field-err">{{ errors.phone2 }}</small>
            </label>
          </div>
        </fieldset>

        <fieldset class="blk">
          <legend class="h3">{{ t('checkout.method') }}</legend>
          <div class="cards2">
            <label class="opt" :class="{ on: form.method === 'delivery' }">
              <input v-model="form.method" type="radio" value="delivery">
              <Icon name="truck" :size="22" />
              <span><strong>{{ t('checkout.delivery') }}</strong><small>{{ t('checkout.deliveryHint') }}</small></span>
            </label>
            <label class="opt" :class="{ on: form.method === 'pickup' }">
              <input v-model="form.method" type="radio" value="pickup">
              <Icon name="pin" :size="22" />
              <span><strong>{{ t('checkout.pickup') }}</strong><small>{{ t('checkout.pickupHint') }}</small></span>
            </label>
          </div>

          <div v-if="form.method === 'delivery'" class="addr">
            <label class="field"><span>{{ t('checkout.city') }} *</span>
              <select v-model="form.city" class="input"><option v-for="r in REGIONS" :key="r">{{ r }}</option></select>
            </label>
            <label class="field wide"><span>{{ t('checkout.street') }} *</span>
              <input v-model="form.street" class="input" :class="{ err: show('street') }" :placeholder="t('checkout.streetPh')" autocomplete="street-address" @blur="touched.street = true">
              <small v-if="show('street')" class="field-err">{{ errors.street }}</small>
            </label>
            <label class="field wide"><span>{{ t('checkout.note') }}</span>
              <textarea v-model="form.note" class="input" maxlength="500" rows="3" />
            </label>
          </div>
          <div v-else class="branches">
            <p class="sub">{{ t('checkout.branch') }}</p>
            <label v-for="b in branches" :key="b.slug" class="br" :class="{ on: form.branch === b.slug }">
              <input v-model="form.branch" type="radio" :value="b.slug">
              <span class="dot" />
              <span class="bt"><strong>{{ L(b.name) }}</strong><small>{{ L(b.city) }}, {{ L(b.address) }} · {{ b.hours }}</small></span>
            </label>
          </div>
        </fieldset>

        <fieldset class="blk">
          <legend class="h3">{{ t('checkout.payment') }}</legend>
          <div class="cards2">
            <label class="opt" :class="{ on: form.payment === 'cash' }">
              <input v-model="form.payment" type="radio" value="cash">
              <span><strong>{{ form.method === 'pickup' ? t('checkout.cashPickup') : t('checkout.cashDelivery') }}</strong></span>
            </label>
            <label class="opt" :class="{ on: form.payment === 'card' }">
              <input v-model="form.payment" type="radio" value="card">
              <span><strong>{{ t('checkout.card') }}</strong><small>{{ t('checkout.cardHint') }}</small></span>
            </label>
          </div>
          <p class="soon"><Icon name="info" :size="16" />{{ t('checkout.onlineSoon') }}</p>
        </fieldset>
      </div>

      <aside class="sum">
        <h2 class="h3">{{ t('checkout.summary') }}</h2>
        <ul class="items">
          <li v-for="i in cart.items" :key="i.slug + i.ml">
            <span class="th"><BottleArt :product="i.p" /><b>{{ i.qty }}</b></span>
            <span class="it"><strong>{{ i.p.name }}</strong><small>{{ brandName(i.p.brand) }} · {{ i.ml }} ml</small></span>
            <span class="num">{{ money(i.total) }}</span>
          </li>
        </ul>
        <div class="promo">
          <input v-model="promoInput" class="input" :placeholder="t('checkout.promoPh')" @keydown.enter.prevent="applyPromo">
          <button type="button" class="btn ghost" @click="applyPromo">{{ t('checkout.apply') }}</button>
        </div>
        <p v-if="promoMsg" class="pm" :class="{ ok: promoMsg.ok }">{{ promoMsg.text }}</p>
        <dl class="rows num">
          <div><dt>{{ t('checkout.subtotal') }}</dt><dd>{{ money(cart.subtotal) }}</dd></div>
          <div v-if="cart.discount"><dt>{{ t('checkout.discount') }} ({{ cart.promo.toUpperCase() }})</dt><dd class="disc">−{{ money(cart.discount) }}</dd></div>
          <div><dt>{{ t('checkout.shipping') }}</dt><dd>{{ shipping ? money(shipping) : t('checkout.free') }}</dd></div>
          <div class="tot"><dt>{{ t('checkout.total') }}</dt><dd>{{ money(total) }}</dd></div>
        </dl>
        <button class="btn block big" type="submit" :disabled="sending">{{ sending ? t('common.loading') : `${t('checkout.confirm')} · ${money(total)}` }}</button>
        <p class="fine">{{ t('checkout.agree') }}</p>
        <p class="demo">{{ t('checkout.demo') }}</p>
      </aside>
    </form>
  </div>
</template>

<style scoped>
.co { padding-top: 28px; padding-bottom: 40px; }
.co .h1 { margin: 14px 0 28px; }
.empty { display: grid; justify-items: start; gap: 16px; padding: 40px 0; }
.grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 32px; align-items: start; }
.left { display: grid; gap: 16px; }
.blk { margin: 0; border: 1px solid var(--line); background: var(--surface); border-radius: 22px; padding: 26px; display: grid; gap: 16px; min-width: 0; }
.blk legend { float: left; width: 100%; margin-bottom: 4px; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cards2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.opt { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 16px; border: 1px solid var(--line-2); cursor: pointer; transition: all .2s; }
.opt input { position: absolute; opacity: 0; }
.opt :deep(svg) { color: var(--sapphire); flex: none; }
.opt span { display: grid; }
.opt small { color: var(--muted); font-size: 12.5px; }
.opt.on { border-color: var(--sapphire); box-shadow: inset 0 0 0 1px var(--sapphire); background: rgba(30, 63, 138, .04); }
.opt:focus-within { outline: 2px solid var(--sapphire-2); outline-offset: 2px; }
.addr { display: grid; grid-template-columns: 1fr 2fr; gap: 14px; }
.addr .wide:last-child { grid-column: 1 / -1; }
.branches { display: grid; gap: 8px; }
.sub { font-size: 13px; font-weight: 600; }
.br { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; border: 1px solid var(--line); cursor: pointer; }
.br input { position: absolute; opacity: 0; }
.br .dot { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--line-2); flex: none; }
.br.on { border-color: var(--sapphire); }
.br.on .dot { border: 5px solid var(--sapphire); }
.bt { display: grid; }
.bt small { color: var(--muted); }
.soon { display: flex; gap: 8px; align-items: center; font-size: 13px; color: var(--muted); }
.sum { position: sticky; top: calc(var(--header-h) + 16px); background: var(--surface); border: 1px solid var(--line); border-radius: 22px; padding: 26px; display: grid; gap: 16px; }
.items { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; max-height: 300px; overflow: auto; }
.items li { display: grid; grid-template-columns: 56px 1fr auto; gap: 12px; align-items: center; font-size: 14px; }
.th { position: relative; width: 56px; height: 56px; border-radius: 12px; overflow: visible; }
.th :deep(svg) { border-radius: 12px; }
.th b { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 11px; display: grid; place-items: center; }
.it { display: grid; min-width: 0; }
.it strong { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.it small { color: var(--muted); }
.promo { display: flex; gap: 8px; }
.promo .input { height: 46px; flex: 1; min-width: 0; width: auto; }
.sum > * { min-width: 0; }
.promo .btn { height: 46px; }
.pm { font-size: 13px; color: var(--sale); margin-top: -8px; }
.pm.ok { color: var(--ok); }
.rows { margin: 0; display: grid; gap: 8px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 14.5px; }
.rows > div { display: flex; justify-content: space-between; }
.rows dt { color: var(--ink-2); }
.rows dd { margin: 0; font-weight: 600; }
.disc { color: var(--ok); }
.tot { padding-top: 10px; margin-top: 4px; border-top: 1px solid var(--line); font-size: 19px; }
.tot dt { color: var(--ink); font-weight: 600; }
.big { height: 54px; font-size: 15px; }
.fine { font-size: 12px; color: var(--muted); text-align: center; }
.demo { font-size: 12px; text-align: center; color: var(--sapphire); background: rgba(30, 63, 138, .07); border-radius: 10px; padding: 8px; }
@media (max-width: 1023px) { .grid { grid-template-columns: 1fr; } .sum { position: static; } }
@media (max-width: 640px) { .two, .cards2, .addr { grid-template-columns: 1fr; } .blk, .sum { padding: 20px; } }
</style>

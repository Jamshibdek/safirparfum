<script setup lang="ts">
import { branches, getProduct, useL, settings } from '~/lib/catalog'
import { formatPhone } from '~/utils/text'
import { useOrders } from '~/stores/orders'
const route = useRoute()
const { t } = useI18n()
const lp = useLocalePath()
const { L, money } = useL()
const store = useOrders()
const order = computed(() => store.orders.find(o => o.id === String(route.params.id)))
const branch = computed(() => branches.find(b => b.slug === order.value?.branch))
useSeoMeta({ title: () => `${t('order.thanks')} — Sefir Parfum`, robots: 'noindex' })
</script>

<template>
  <div class="wrap od">
    <div v-if="order" class="card box">
      <div class="seal"><Icon name="check" :size="30" :stroke="2" /></div>
      <h1 class="h1">{{ t('order.thanks') }}</h1>
      <p class="no">{{ t('order.number') }} <strong class="num">№ {{ order.id }}</strong></p>
      <p class="lead">{{ t('order.call', { phone: formatPhone(order.customer.phone) }) }}</p>

      <div class="meta">
        <div><span>{{ t('checkout.method') }}</span><strong>{{ order.method === 'pickup' ? `${t('checkout.pickup')}: ${L(branch?.name)}` : `${order.address?.city}, ${order.address?.street}` }}</strong></div>
        <div><span>{{ t('checkout.payment') }}</span><strong>{{ order.payment === 'cash' ? t('checkout.cash') : t('checkout.card') }}</strong></div>
        <div><span>{{ t('status.new') }}</span><strong>{{ new Date(order.createdAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) }}</strong></div>
      </div>

      <h2 class="h3">{{ t('order.items') }}</h2>
      <ul class="items">
        <li v-for="l in order.lines" :key="l.slug + l.ml">
          <span class="th"><ProductVisual sizes="100px" v-if="getProduct(l.slug)" :product="getProduct(l.slug)!" /></span>
          <span class="it"><strong>{{ l.brand }} {{ l.name }}</strong><small>{{ l.ml }} ml × {{ l.qty }}</small></span>
          <span class="num">{{ money(l.price * l.qty) }}</span>
        </li>
      </ul>
      <dl class="rows num">
        <div><dt>{{ t('checkout.subtotal') }}</dt><dd>{{ money(order.subtotal) }}</dd></div>
        <div v-if="order.discount"><dt>{{ t('checkout.discount') }}</dt><dd>−{{ money(order.discount) }}</dd></div>
        <div><dt>{{ t('checkout.shipping') }}</dt><dd>{{ order.delivery ? money(order.delivery) : t('checkout.free') }}</dd></div>
        <div class="tot"><dt>{{ t('checkout.total') }}</dt><dd>{{ money(order.total) }}</dd></div>
      </dl>
      <div class="acts">
        <a :href="settings.telegram" target="_blank" rel="noopener" class="btn"><Icon name="telegram" :size="17" />{{ t('order.track') }}</a>
        <NuxtLink :to="lp('/shop')" class="btn ghost">{{ t('order.toShop') }}</NuxtLink>
      </div>
    </div>
    <div v-else class="box">
      <h1 class="h2">{{ t('order.notFound') }}</h1>
      <NuxtLink :to="lp('/shop')" class="btn">{{ t('order.toShop') }}</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.od { padding-top: 40px; padding-bottom: 40px; }
.box { max-width: 760px; margin: 0 auto; padding: clamp(26px, 5vw, 52px); display: grid; gap: 16px; border-radius: 26px; }
.seal { width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center; color: #fff; background: var(--sapphire); box-shadow: 0 0 0 10px rgba(30, 63, 138, .12); }
.no { font-size: 15px; }
.no strong { font-size: 18px; color: var(--sapphire); }
.meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.meta div { display: grid; gap: 2px; font-size: 14px; }
.meta span { color: var(--muted); font-size: 12.5px; }
.items { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.items li { display: grid; grid-template-columns: 52px 1fr auto; gap: 12px; align-items: center; font-size: 14px; }
.th { width: 52px; height: 52px; border-radius: 10px; overflow: hidden; }
.it { display: grid; }
.it small { color: var(--muted); }
.rows { margin: 0; display: grid; gap: 6px; font-size: 14.5px; }
.rows div { display: flex; justify-content: space-between; }
.rows dd { margin: 0; font-weight: 600; }
.tot { font-size: 19px; padding-top: 8px; border-top: 1px solid var(--line); }
.acts { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
@media (max-width: 640px) { .meta { grid-template-columns: 1fr; } }
</style>

<script setup lang="ts">
// Aloqa formasi (mock): yuborilganda faqat tasdiq ko'rsatiladi. Backend kelganda POST /leads.
import { branches, settings, useL } from '~/lib/catalog'
import { isValidPhone } from '~/utils/text'
const { t } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const f = reactive({ name: '', phone: '', email: '', message: '' })
const tried = ref(false)
const done = ref(false)
const err = computed(() => ({
  name: f.name.trim().length < 2 ? t('form.badName') : '',
  phone: !isValidPhone(f.phone) ? t('form.badPhone') : '',
  email: f.email && !/^\S+@\S+\.\S+$/.test(f.email) ? t('form.badEmail') : '',
  message: f.message.trim().length < 5 ? t('form.short') : ''
}))
function send() {
  tried.value = true
  if (Object.values(err.value).some(Boolean)) return
  done.value = true
}
useSeoMeta({ title: () => `${t('nav.contact')} — SafirParfum`, description: () => t('contact.text') })
</script>

<template>
  <div>
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs"><NuxtLink :to="lp('/')">{{ t('nav.home') }}</NuxtLink><span>/</span><span>{{ t('nav.contact') }}</span></nav>
        <h1 class="h1">{{ t('contact.title') }}</h1>
        <p class="lead" style="margin-top: 10px">{{ t('contact.text') }}</p>
      </div>
    </header>

    <section class="wrap section lay">
      <div class="info">
        <a :href="`tel:${settings.phone1.replace(/\s/g, '')}`" class="big num">{{ settings.phone1 }}</a>
        <a :href="`tel:${settings.phone2.replace(/\s/g, '')}`" class="big num">{{ settings.phone2 }}</a>
        <p class="muted">{{ t('header.hours') }} {{ settings.hours }}</p>
        <div class="acts">
          <a :href="settings.telegram" target="_blank" rel="noopener" class="btn"><Icon name="telegram" :size="17" />{{ t('contact.write') }}</a>
          <a :href="settings.instagram" target="_blank" rel="noopener" class="btn ghost"><Icon name="instagram" :size="17" />Instagram</a>
        </div>
        <div class="brs">
          <NuxtLink v-for="b in branches" :key="b.id" :to="lp('/locations')" class="br">
            <strong>{{ L(b.name) }}</strong>
            <span class="muted">{{ L(b.city) }}, {{ L(b.address) }}</span>
          </NuxtLink>
        </div>
      </div>

      <div class="card formbox">
        <h2 class="h3">{{ t('contact.formTitle') }}</h2>
        <div v-if="done" class="ok"><Icon name="check" :size="26" /><p>{{ t('contact.done') }}</p></div>
        <form v-else class="f" novalidate @submit.prevent="send">
          <label class="field"><span>{{ t('form.name') }} *</span><input v-model="f.name" class="input" :class="{ err: tried && err.name }" autocomplete="name"><small v-if="tried && err.name" class="field-err">{{ err.name }}</small></label>
          <label class="field"><span>{{ t('form.phone') }} *</span><PhoneInput v-model="f.phone" :err="!!(tried && err.phone)" /><small v-if="tried && err.phone" class="field-err">{{ err.phone }}</small></label>
          <label class="field"><span>{{ t('form.email') }}</span><input v-model="f.email" class="input" type="email" :class="{ err: tried && err.email }" autocomplete="email"><small v-if="tried && err.email" class="field-err">{{ err.email }}</small></label>
          <label class="field"><span>{{ t('form.message') }} *</span><textarea v-model="f.message" class="input" rows="4" :class="{ err: tried && err.message }" /><small v-if="tried && err.message" class="field-err">{{ err.message }}</small></label>
          <button class="btn block" type="submit">{{ t('form.send') }}</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lay { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
.info { display: grid; gap: 10px; justify-items: start; }
.big { font-family: var(--f-display); font-size: clamp(30px, 3.4vw, 46px); line-height: 1.1; }
.big:hover { color: var(--sapphire); }
.acts { display: flex; gap: 10px; flex-wrap: wrap; margin: 14px 0 18px; }
.brs { display: grid; gap: 8px; width: 100%; border-top: 1px solid var(--line); padding-top: 18px; }
.br { display: grid; padding: 10px 0; border-bottom: 1px solid var(--line); }
.formbox { padding: 30px; border-radius: 24px; display: grid; gap: 16px; }
.f { display: grid; gap: 14px; }
.ok { display: grid; justify-items: center; gap: 10px; color: var(--ok); text-align: center; padding: 30px 0; font-weight: 600; }
@media (max-width: 900px) { .lay { grid-template-columns: 1fr; } }
</style>

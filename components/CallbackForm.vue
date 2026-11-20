<script setup lang="ts">
// Qo'ng'iroq buyurtmasi. Backend kelguncha faqat ekranda tasdiq ko'rsatiladi (POST /leads ga ulanadi).
import { isValidPhone } from '~/utils/text'
const { t } = useI18n()
const name = ref('')
const phone = ref('')
const err = ref('')
const done = ref(false)
function submit() {
  if (!isValidPhone(phone.value)) { err.value = t('form.badPhone'); return }
  err.value = ''
  done.value = true
}
</script>

<template>
  <div class="cb">
    <div class="l">
      <span class="ring"><Icon name="phone" :size="26" /></span>
      <div>
        <p class="overline gold">✦ {{ t('home.callOver') }}</p>
        <h2 class="h2">{{ t('home.call') }}</h2>
        <p class="lead">{{ t('home.callText') }}</p>
      </div>
    </div>
    <Transition name="fade" mode="out-in">
      <form v-if="!done" class="f" novalidate @submit.prevent="submit">
        <input v-model="name" class="input" :placeholder="t('form.nameOpt')" autocomplete="given-name" :aria-label="t('form.nameOpt')">
        <PhoneInput v-model="phone" :err="!!err" :aria-label="t('form.phone')" />
        <p v-if="err" class="field-err">{{ err }}</p>
        <button class="btn block" type="submit"><Icon name="phone" :size="17" />{{ t('home.callBtn') }}</button>
      </form>
      <div v-else class="ok"><Icon name="check" :size="28" /><p>{{ t('home.callDone') }}</p></div>
    </Transition>
  </div>
</template>

<style scoped>
.cb { display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: center; padding: clamp(28px, 4vw, 52px); background: var(--surface); border: 1px solid var(--line); border-radius: 26px; }
.l { display: flex; gap: 28px; align-items: center; }
.ring { width: 96px; height: 96px; border-radius: 50%; flex: none; display: grid; place-items: center; color: var(--gold); border: 1px solid var(--champagne); box-shadow: 0 0 0 10px rgba(216, 195, 160, .18); }
.l .overline { margin-bottom: 10px; display: block; }
.l .lead { margin-top: 10px; }
.f { display: grid; gap: 10px; }
.ok { display: grid; justify-items: center; gap: 10px; color: var(--ok); text-align: center; font-weight: 600; }
@media (max-width: 900px) { .cb { grid-template-columns: 1fr; gap: 24px; } .ring { display: none; } }
</style>

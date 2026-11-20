<script setup lang="ts">
// Mock kirish: telefon -> SMS kod (demo kod sozlamalarda) -> ism. Backend kelganda /auth/otp va /auth/verify ga ulanadi.
import { settings } from '~/lib/catalog'
import { isValidPhone, formatPhone } from '~/utils/text'
import { useUi } from '~/stores/shop'
import { useAccount } from '~/stores/account'

const { t } = useI18n()
const lp = useLocalePath()
const ui = useUi()
const acc = useAccount()
const step = ref<'phone' | 'code' | 'name'>('phone')
const phone = ref('')
const code = ref('')
const name = ref('')
const err = ref('')
const timer = ref(0)
let iv: ReturnType<typeof setInterval> | undefined

function startTimer() {
  timer.value = 60
  clearInterval(iv)
  iv = setInterval(() => { timer.value -= 1; if (timer.value <= 0) clearInterval(iv) }, 1000)
}
onBeforeUnmount(() => clearInterval(iv))

function sendCode() {
  if (!isValidPhone(phone.value)) { err.value = t('form.badPhone'); return }
  err.value = ''; step.value = 'code'; startTimer()
}
function verify() {
  if (code.value !== settings.demoOtp) { err.value = t('login.badCode'); return }
  err.value = ''
  if (acc.user?.phone === phone.value) return finish()
  step.value = 'name'
}
function finish() {
  if (step.value === 'name' && name.value.trim().length < 2) { err.value = t('form.badName'); return }
  acc.login(phone.value, name.value.trim() || acc.user?.name || '')
  ui.login = false
  navigateTo(lp('/account'))
}
</script>

<template>
  <div class="modal" role="dialog" aria-modal="true" :aria-label="t('login.title')" @click.self="ui.login = false">
    <div class="box">
      <button class="icon-btn x" :aria-label="t('common.close')" @click="ui.login = false"><Icon name="close" /></button>
      <Logo compact />
      <template v-if="step === 'phone'">
        <h2 class="h2">{{ t('login.title') }}</h2>
        <p class="muted">{{ t('login.text') }}</p>
        <form class="f" @submit.prevent="sendCode">
          <label class="field"><span>{{ t('form.phone') }}</span><PhoneInput v-model="phone" :err="!!err" autofocus /></label>
          <p v-if="err" class="field-err">{{ err }}</p>
          <button class="btn block" type="submit">{{ t('login.getCode') }}</button>
        </form>
        <button class="btn ghost block"><Icon name="telegram" :size="17" />{{ t('login.telegram') }}</button>
      </template>

      <template v-else-if="step === 'code'">
        <h2 class="h2">{{ t('login.code') }}</h2>
        <p class="muted">{{ t('login.codeSent', { phone: formatPhone(phone) }) }}</p>
        <form class="f" @submit.prevent="verify">
          <input v-model="code" class="input otp num" inputmode="numeric" maxlength="4" autocomplete="one-time-code" placeholder="• • • •" autofocus>
          <p v-if="err" class="field-err">{{ err }}</p>
          <p class="demo">{{ t('login.demo', { code: settings.demoOtp }) }}</p>
          <button class="btn block" type="submit" :disabled="code.length < 4">{{ t('login.verify') }}</button>
        </form>
        <div class="row">
          <button class="lnk" @click="step = 'phone'; code = ''">{{ t('login.change') }}</button>
          <button class="lnk" :disabled="timer > 0" @click="startTimer">{{ timer > 0 ? t('login.resendIn', { s: timer }) : t('login.resend') }}</button>
        </div>
      </template>

      <template v-else>
        <h2 class="h2">{{ t('login.nameTitle') }}</h2>
        <form class="f" @submit.prevent="finish">
          <label class="field"><span>{{ t('form.name') }}</span><input v-model="name" class="input" autocomplete="given-name" autofocus></label>
          <p v-if="err" class="field-err">{{ err }}</p>
          <button class="btn block" type="submit">{{ t('login.done') }}</button>
        </form>
      </template>
    </div>
  </div>
</template>

<style scoped>
.modal { position: fixed; inset: 0; z-index: 95; display: grid; place-items: center; padding: 20px; }
.box { position: relative; width: min(440px, 100%); background: var(--bg); border-radius: var(--r-lg); padding: 32px; display: grid; gap: 14px; box-shadow: var(--shadow-pop); }
.x { position: absolute; top: 12px; right: 12px; }
.f { display: grid; gap: 12px; margin-top: 6px; }
.otp { text-align: center; font-size: 26px; letter-spacing: .5em; height: 60px; }
.demo { font-size: 12.5px; color: var(--sapphire); background: rgba(31, 63, 120, .08); border-radius: 10px; padding: 8px 12px; }
.row { display: flex; justify-content: space-between; }
.lnk { border: 0; background: transparent; font-size: 13px; font-weight: 600; color: var(--sapphire); padding: 0; }
.lnk[disabled] { color: var(--muted); cursor: default; }
</style>

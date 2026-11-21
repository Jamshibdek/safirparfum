<script setup lang="ts">
import { useUi } from '~/stores/shop'
const ui = useUi()
function act() {
  const a = ui.toast?.action
  if (!a) return
  if (a.to === '#cart') ui.cart = true
  else navigateTo(a.to)
  ui.toast = null
}
</script>

<template>
  <Transition name="pop">
    <div v-if="ui.toast" :key="ui.toast.id" class="toast" role="status" aria-live="polite">
      <span class="ic"><Icon name="check" :size="16" :stroke="2.2" /></span>
      <span class="txt">
        <strong>{{ ui.toast.text }}</strong>
        <small v-if="ui.toast.sub">{{ ui.toast.sub }}</small>
      </span>
      <button v-if="ui.toast.action" @click="act">{{ ui.toast.action.label }}</button>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  /* markazlash transform'siz — chiqish animatsiyasi transform'ni ishlatadi */
  position: fixed; left: 0; right: 0; margin: 0 auto; bottom: 28px; z-index: 120;
  width: min(440px, calc(100vw - 24px));
  display: flex; align-items: center; gap: 12px;
  padding: 10px 10px 10px 12px; border-radius: 16px; background: var(--night); color: #F2F3F6;
  box-shadow: var(--shadow-pop);
}
.ic { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; flex: none; background: rgba(203, 179, 137, .18); color: var(--champagne); }
.txt { flex: 1; min-width: 0; display: grid; line-height: 1.3; }
.txt strong { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.txt small { font-size: 12.5px; color: rgba(242, 243, 246, .7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
button { flex: none; border: 0; border-radius: 12px; background: var(--champagne); color: var(--ink); font-weight: 600; font-size: 13px; height: 38px; padding: 0 14px; white-space: nowrap; }
@media (max-width: 767px) { .toast { bottom: calc(74px + env(safe-area-inset-bottom)); } }
</style>

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
      <Icon name="check" :size="18" class="ic" />
      <span>{{ ui.toast.text }}</span>
      <button v-if="ui.toast.action" @click="act">{{ ui.toast.action.label }}</button>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%); z-index: 120;
  display: flex; align-items: center; gap: 12px; max-width: calc(100vw - 32px);
  padding: 12px 12px 12px 18px; border-radius: 16px; background: var(--night); color: #F3EFE7;
  box-shadow: var(--shadow-pop); font-size: 14px;
}
.ic { color: var(--champagne); flex: none; }
button { border: 0; border-radius: 10px; background: rgba(216, 195, 160, .16); color: var(--champagne); font-weight: 700; font-size: 13px; height: 34px; padding: 0 12px; white-space: nowrap; }
@media (max-width: 767px) { .toast { bottom: calc(76px + env(safe-area-inset-bottom)); } }
</style>

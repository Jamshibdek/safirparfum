<script setup lang="ts">
import { phoneDigits, formatPhone } from '~/utils/text'
// v-model = 9 ta raqam (998 siz). Ko'rinishi: +998 90 123 45 67
const model = defineModel<string>({ default: '' })
defineProps<{ err?: boolean; id?: string; autofocus?: boolean }>()
const shown = computed(() => formatPhone(model.value))
function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  model.value = phoneDigits(el.value)
  el.value = formatPhone(model.value)
}
</script>

<template>
  <input
    :id="id" class="input num" :class="{ err }" type="tel" inputmode="tel" autocomplete="tel"
    placeholder="+998 __ ___ __ __" :value="shown" :autofocus="autofocus" @input="onInput"
  >
</template>

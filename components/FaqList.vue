<script setup lang="ts">
import { faq, useL } from '~/lib/catalog'
const { L } = useL()
const open = ref<number | null>(faq[0].id)
</script>

<template>
  <div class="faq">
    <div v-for="f in faq" :key="f.id" class="it" :class="{ on: open === f.id }">
      <button class="q" :aria-expanded="open === f.id" @click="open = open === f.id ? null : f.id">
        <span>{{ L(f.q) }}</span>
        <span class="pm"><Icon :name="open === f.id ? 'minus' : 'plus'" :size="16" /></span>
      </button>
      <div class="a" :style="{ gridTemplateRows: open === f.id ? '1fr' : '0fr' }">
        <div><p>{{ L(f.a) }}</p></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq { border-top: 1px solid var(--line); }
.it { border-bottom: 1px solid var(--line); }
.q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; border: 0; background: transparent; text-align: left; font-family: var(--f-display); font-size: 23px; font-weight: 600; line-height: 1.2; }
.pm { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--line-2); display: grid; place-items: center; flex: none; transition: all .25s; }
.on .pm { background: var(--ink); color: #fff; border-color: var(--ink); }
.a { display: grid; transition: grid-template-rows .4s var(--ease); }
.a > div { overflow: hidden; }
.a p { padding: 0 60px 22px 0; color: var(--ink-2); max-width: 70ch; }
@media (max-width: 767px) { .q { font-size: 19px; padding: 18px 0; } .a p { padding-right: 0; } }
</style>

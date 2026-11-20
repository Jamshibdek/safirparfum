<script setup lang="ts">
import type { NuxtError } from '#app'
import { products } from '~/lib/catalog'
const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const lp = useLocalePath()
const is404 = computed(() => props.error?.statusCode === 404)
const popular = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4)
useHead({ title: `${is404.value ? '404' : 'Xato'} — SafirParfum`, meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <NuxtLayout>
    <section class="wrap err">
      <p class="code display">{{ error?.statusCode || 500 }}</p>
      <h1 class="h1">{{ is404 ? t('errors.notFound') : t('errors.server') }}</h1>
      <p class="lead">{{ t('errors.notFoundText') }}</p>
      <div class="sbx"><SearchBox /></div>
      <NuxtLink :to="lp('/')" class="btn" @click="clearError()">{{ t('errors.home') }}</NuxtLink>
      <div class="grid-products pop">
        <ProductCard v-for="p in popular" :key="p.slug" :product="p" />
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.err { padding-top: 64px; padding-bottom: 40px; display: grid; justify-items: center; text-align: center; gap: 16px; }
.code { font-size: clamp(96px, 16vw, 180px); line-height: .9; color: transparent; -webkit-text-stroke: 1.5px var(--gold); }
.sbx { width: min(560px, 100%); text-align: left; margin: 8px 0; }
.pop { width: 100%; margin-top: 48px; text-align: left; }
</style>

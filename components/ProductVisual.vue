<script setup lang="ts">
// Mahsulot tasviri: mijozning haqiqiy surati bo'lsa — <img> (WebP, 2 o'lcham), bo'lmasa chizilgan flakon (BottleArt).
// BottleArt'ning qo'shimcha props'lari (open, level, scene, wisps) faqat chizilgan flakonga uzatiladi.
import type { Product } from '~/lib/catalog'
import { brandName } from '~/lib/catalog'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ product: Product; index?: number; sizes?: string; eager?: boolean; fit?: 'contain' | 'cover' | null }>(), {
  index: 0, sizes: '(max-width: 767px) 50vw, 300px', eager: false, fit: null
})
const base = computed(() => props.product.images?.[props.index] ?? null)
const fitMode = computed(() => props.fit ?? props.product.photoFit ?? 'contain')
const alt = computed(() => `${brandName(props.product.brand)} ${props.product.name}`)
</script>

<template>
  <img
    v-if="base" class="pv" :class="fitMode" :src="`${base}-sm.webp`" :srcset="`${base}-sm.webp 440w, ${base}.webp 900w`"
    :sizes="sizes" :alt="alt" :loading="eager ? 'eager' : 'lazy'" decoding="async" width="900" height="900"
  >
  <BottleArt v-else v-bind="$attrs" :product="product" />
</template>

<style scoped>
.pv { display: block; width: 100%; height: 100%; background: #fff; }
.pv.contain { object-fit: contain; }
.pv.cover { object-fit: cover; }
</style>

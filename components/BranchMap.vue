<script setup lang="ts">
import { branches, useL } from '~/lib/catalog'
const props = withDefaults(defineProps<{ height?: number; selected?: number }>(), { height: 420, selected: 1 })
const { L } = useL()
const b = computed(() => branches.find(x => x.id === props.selected) ?? branches[0])
const src = computed(() => `https://yandex.uz/map-widget/v1/?ll=${b.value.lng}%2C${b.value.lat}&z=15&pt=${b.value.lng}%2C${b.value.lat}%2Cpm2blm&l=map`)
</script>

<template>
  <div class="map" :style="{ height: height + 'px' }">
    <iframe :key="src" :src="src" :title="L(b.name)" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
  </div>
</template>

<style scoped>
.map { position: relative; border-radius: var(--r-lg); overflow: hidden; background: var(--bg-2); border: 1px solid var(--line); }
iframe { width: 100%; height: 100%; border: 0; filter: grayscale(.35) sepia(.12); }
</style>

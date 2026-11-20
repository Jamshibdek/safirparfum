<script setup lang="ts">
import { collections, products, matchCollection, useL } from '~/lib/catalog'
const route = useRoute()
const { t } = useI18n()
const { L } = useL()
const c = computed(() => collections.find(x => x.slug === route.params.slug))
if (!c.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
const base = computed(() => products.filter(p => matchCollection(p, c.value!.rule)))
useSeoMeta({ title: () => `${L(c.value!.name)} — SafirParfum`, description: () => L(c.value!.text) })
</script>

<template>
  <CatalogView
    :key="c!.slug" :base="base" :title="L(c!.name)" :intro="L(c!.text)" :show-gender="false"
    :crumbs="[{ to: '/collections', label: t('collections.title') }, { label: L(c!.name) }]"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: () => `${t('shop.title')} — Sefir Parfum`,
  description: () => t('shop.title') + ': Dior, Chanel, Tom Ford, Creed, Kilian va boshqalar. 30, 50, 100 ml.'
})
</script>

<template>
  <CatalogView :title="t('shop.title')" :crumbs="[{ label: t('nav.catalog') }]" />
</template>

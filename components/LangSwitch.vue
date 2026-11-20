<script setup lang="ts">
const { locale, locales } = useI18n()
const switchPath = useSwitchLocalePath()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const list = computed(() => (locales.value as Array<{ code: string; name: string }>))

function outside(e: MouseEvent) { if (root.value && !root.value.contains(e.target as Node)) open.value = false }
function key(e: KeyboardEvent) { if (e.key === 'Escape') open.value = false }
onMounted(() => { document.addEventListener('mousedown', outside); document.addEventListener('keydown', key) })
onBeforeUnmount(() => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', key) })
</script>

<template>
  <div ref="root" class="ls">
    <button class="btn-l" :aria-expanded="open" aria-haspopup="listbox" @click="open = !open">
      <Icon name="globe" :size="16" />
      <span>{{ locale.toUpperCase() }}</span>
      <Icon name="down" :size="14" />
    </button>
    <Transition name="pop">
      <ul v-if="open" class="menu" role="listbox">
        <li v-for="l in list" :key="l.code">
          <NuxtLink :to="switchPath(l.code as any)" :class="{ on: l.code === locale }" role="option" :aria-selected="l.code === locale" @click="open = false">
            {{ l.name }} <Icon v-if="l.code === locale" name="check" :size="16" />
          </NuxtLink>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.ls { position: relative; }
.btn-l { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 10px; border: 0; background: transparent; border-radius: var(--pill); font-size: 12.5px; font-weight: 700; letter-spacing: .06em; }
.btn-l:hover { background: rgba(18, 19, 24, .06); }
.menu { position: absolute; right: 0; top: calc(100% + 6px); min-width: 170px; list-style: none; margin: 0; padding: 6px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--shadow-pop); z-index: 70; }
.menu a { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: 10px; font-size: 14px; }
.menu a:hover { background: var(--bg); }
.menu a.on { color: var(--sapphire); font-weight: 600; }
</style>

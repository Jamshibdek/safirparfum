<script setup lang="ts">
import { testimonials, getProduct, brandName, useL } from '~/lib/catalog'
const { t } = useI18n()
const lp = useLocalePath()
const { L } = useL()
const shown = ref(3)
const open = ref<number | null>(null)
const list = computed(() => testimonials.slice(0, shown.value))
const fmt = (d: string) => d.split('-').reverse().join('.')
const cur = computed(() => testimonials.find(x => x.id === open.value))
</script>

<template>
  <div>
    <div class="grid">
      <article v-for="x in list" :key="x.id" v-reveal class="tc">
        <div class="top">
          <span class="av">{{ x.user[0].toUpperCase() }}</span>
          <div class="who">
            <strong>@{{ x.user }}</strong>
            <span>{{ x.source === 'instagram' ? 'Instagram' : 'Telegram' }} · {{ fmt(x.date) }}</span>
          </div>
          <Icon :name="x.source" :size="18" class="src" />
        </div>
        <p class="q">“{{ L(x.text) }}”</p>
        <div class="bot">
          <NuxtLink v-if="getProduct(x.product)" :to="lp(`/product/${x.product}`)" class="prod">
            <span class="th"><ProductVisual sizes="100px" :product="getProduct(x.product)!" /></span>
            {{ brandName(getProduct(x.product)!.brand) }} {{ getProduct(x.product)!.name }}
          </NuxtLink>
          <button class="shot" @click="open = x.id">{{ t('home.screenshot') }}</button>
        </div>
      </article>
    </div>
    <div v-if="shown < testimonials.length" class="more">
      <button class="btn ghost" @click="shown = testimonials.length">{{ t('home.more') }} · {{ testimonials.length - shown }}</button>
    </div>

    <Teleport to="body">
      <Transition name="pop">
        <div v-if="cur" class="shot-modal" role="dialog" aria-modal="true" @click.self="open = null">
          <div class="phone">
            <button class="icon-btn x" :aria-label="t('common.close')" @click="open = null"><Icon name="close" /></button>
            <div class="bar"><span class="av">{{ cur.user[0].toUpperCase() }}</span><strong>{{ cur.user }}</strong></div>
            <div class="chat">
              <p class="msg in">{{ L(cur.text) }}</p>
              <p class="msg out">Rahmat! Yana kutib qolamiz ✦ — SafirParfum</p>
            </div>
            <p class="cap">{{ cur.source === 'instagram' ? 'Instagram' : 'Telegram' }} · {{ fmt(cur.date) }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.tc { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.top { display: flex; align-items: center; gap: 12px; }
.av { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: var(--night); color: var(--champagne); font-weight: 700; flex: none; }
.who { display: grid; line-height: 1.3; }
.who span { font-size: 12px; color: var(--muted); }
.src { margin-left: auto; color: var(--muted); }
.q { font-family: var(--f-display); font-size: 21px; line-height: 1.3; font-weight: 500; flex: 1; }
.bot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 12px; border-top: 1px solid var(--line); }
.prod { display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 600; min-width: 0; }
.prod .th { width: 36px; height: 36px; border-radius: 8px; overflow: hidden; flex: none; }
.shot { border: 0; background: transparent; font-size: 12px; font-weight: 700; color: var(--sapphire); white-space: nowrap; }
.more { display: flex; justify-content: center; margin-top: 24px; }
.shot-modal { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background: rgba(14, 26, 51, .5); padding: 20px; }
.phone { position: relative; width: min(360px, 100%); background: #E7EBF0; border-radius: 30px; padding: 16px; border: 8px solid #101218; }
.x { position: absolute; right: -14px; top: -14px; background: #fff; }
.bar { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid rgba(0, 0, 0, .08); }
.chat { display: grid; gap: 10px; padding: 16px 0; min-height: 260px; align-content: end; }
.msg { padding: 10px 14px; border-radius: 16px; font-size: 14px; max-width: 85%; }
.msg.in { background: #fff; border-bottom-left-radius: 4px; }
.msg.out { background: var(--sapphire); color: #fff; justify-self: end; border-bottom-right-radius: 4px; }
.cap { text-align: center; font-size: 11.5px; color: var(--muted); }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>

// Savat, sevimlilar, ko'rilganlar va akkauntni brauzerda saqlash (backend kelguncha).
import { useCart, useWishlist, useRecent } from '~/stores/shop'
import { useAccount } from '~/stores/account'

export default defineNuxtPlugin(() => {
  const stores = [
    ['sp-cart', useCart()],
    ['sp-wish', useWishlist()],
    ['sp-recent', useRecent()],
    ['sp-account', useAccount()]
  ] as const

  for (const [key, store] of stores) {
    try {
      const raw = localStorage.getItem(key)
      if (raw) store.$patch(JSON.parse(raw))
    } catch { /* xotira yopiq bo'lsa — jim o'tamiz */ }
    store.$subscribe((_m, state) => {
      try { localStorage.setItem(key, JSON.stringify(state)) } catch { /* noop */ }
    })
  }
})

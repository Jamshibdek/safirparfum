// Savat, sevimlilar, ko'rilganlar va oxirgi buyurtmalarni brauzerda saqlash (backend kelguncha).
import { useCart, useWishlist, useRecent } from '~/stores/shop'
import { useOrders } from '~/stores/orders'

export default defineNuxtPlugin(() => {
  try { localStorage.removeItem('sp-account') } catch { /* eski kabinet ma'lumotini tozalash */ }
  const stores = [
    ['sp-cart', useCart()],
    ['sp-wish', useWishlist()],
    ['sp-recent', useRecent()],
    ['sp-orders', useOrders()]
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

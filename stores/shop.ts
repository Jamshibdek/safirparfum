import { defineStore } from 'pinia'
import { getProduct, settings } from '~/lib/catalog'

export type CartLine = { slug: string; ml: number; qty: number }

export const useCart = defineStore('cart', {
  state: () => ({ lines: [] as CartLine[], promo: '' as string }),
  getters: {
    items: s => s.lines
      .map(l => {
        const p = getProduct(l.slug)
        const size = p?.sizes.find(x => x.ml === l.ml)
        return p && size ? { ...l, p, size, total: size.price * l.qty } : null
      })
      .filter(Boolean) as Array<CartLine & { p: NonNullable<ReturnType<typeof getProduct>>; size: { ml: number; price: number; oldPrice: number | null; stock: number }; total: number }>,
    count(): number { return this.items.reduce((a, i) => a + i.qty, 0) },
    subtotal(): number { return this.items.reduce((a, i) => a + i.total, 0) },
    promoInfo(): { code: string; type: string; value: number; min: number } | null {
      return settings.promo.find(p => p.code === this.promo.toUpperCase()) ?? null
    },
    discount(): number {
      const p = this.promoInfo
      if (!p || this.subtotal < p.min) return 0
      return p.type === 'percent' ? Math.round((this.subtotal * p.value) / 100 / 1000) * 1000 : p.value
    },
    toFree(): number { return Math.max(0, settings.delivery.freeFrom - this.subtotal) }
  },
  actions: {
    add(slug: string, ml: number, qty = 1) {
      const l = this.lines.find(x => x.slug === slug && x.ml === ml)
      if (l) l.qty = Math.min(20, l.qty + qty)
      else this.lines.unshift({ slug, ml, qty })
    },
    setQty(slug: string, ml: number, qty: number) {
      const l = this.lines.find(x => x.slug === slug && x.ml === ml)
      if (!l) return
      if (qty <= 0) this.remove(slug, ml)
      else l.qty = Math.min(20, qty)
    },
    remove(slug: string, ml: number) {
      this.lines = this.lines.filter(x => !(x.slug === slug && x.ml === ml))
    },
    clear() { this.lines = []; this.promo = '' }
  }
})

export const useWishlist = defineStore('wishlist', {
  state: () => ({ slugs: [] as string[] }),
  getters: { count: s => s.slugs.length, has: s => (slug: string) => s.slugs.includes(slug) },
  actions: {
    toggle(slug: string) {
      this.slugs = this.slugs.includes(slug) ? this.slugs.filter(s => s !== slug) : [slug, ...this.slugs]
      return this.slugs.includes(slug)
    }
  }
})

export const useRecent = defineStore('recent', {
  state: () => ({ slugs: [] as string[] }),
  actions: {
    push(slug: string) { this.slugs = [slug, ...this.slugs.filter(s => s !== slug)].slice(0, 12) }
  }
})

export const useUi = defineStore('ui', {
  state: () => ({
    cart: false, quiz: false, menu: false, mega: false,
    quick: null as string | null,
    toast: null as null | { text: string; sub?: string; id: number; action?: { label: string; to: string } }
  }),
  actions: {
    closeAll() { this.cart = this.quiz = this.menu = this.mega = false; this.quick = null },
    /** text — qisqa sarlavha ("Savatga qo'shildi"), sub — tafsilot ("Delina · 30 ml") */
    notify(text: string, action?: { label: string; to: string }, sub?: string) {
      const id = Date.now()
      this.toast = { text, sub, id, action }
      setTimeout(() => { if (this.toast?.id === id) this.toast = null }, 3200)
    }
  }
})

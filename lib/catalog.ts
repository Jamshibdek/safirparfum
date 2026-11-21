// Katalog ma'lumotlari (hozircha mock JSON). Backend kelganda shu fayl API chaqiruvlariga o'tkaziladi —
// komponentlar o'zgarmaydi.
import productsJson from '~/data/products.json'
import brandsJson from '~/data/brands.json'
import notesJson from '~/data/notes.json'
import familiesJson from '~/data/families.json'
import seasonsJson from '~/data/seasons.json'
import collectionsJson from '~/data/collections.json'
import bannersJson from '~/data/banners.json'
import testimonialsJson from '~/data/testimonials.json'
import faqJson from '~/data/faq.json'
import branchesJson from '~/data/branches.json'
import settingsJson from '~/data/settings.json'
import { normalize, fuzzyWordHit, formatSum } from '~/utils/text'
import { useI18n } from '#imports'

export type Loc = { uz: string; ru: string }
export type Size = { ml: number; price: number; oldPrice: number | null; stock: number }
export type Product = {
  id: number; slug: string; name: string; brand: string; gender: 'men' | 'women' | 'unisex'
  families: string[]; notes: { top: string[]; heart: string[]; base: string[] }
  seasons: string[]; time: 'day' | 'evening' | 'any'; longevity: number; sillage: number; concentration: string
  sizes: Size[]; discount: number; tagline: Loc; description: Loc
  art: { shape: string; liquid: string; cap: string }
  badge: 'top' | 'new' | 'sale' | null; featured: boolean; isNew: boolean
  /** mijozning haqiqiy rasmlari (`/media/p/<nom>` — .webp va -sm.webp) va videolari (`/media/v/<nom>` — .mp4 va poster .webp) */
  real?: boolean; images: string[]; videos: string[]; photoFit?: 'contain' | 'cover' | null
  rating: number; reviews: number; popularity: number; createdAt: string
}
export type Brand = { slug: string; name: string; country: string; sort: number }

export const products = productsJson as Product[]
export const brands = brandsJson as Brand[]
export const notes = notesJson as Record<string, Loc>
export const families = familiesJson as Record<string, Loc>
export const seasons = seasonsJson as Record<string, Loc>
export const collections = collectionsJson as Array<{ slug: string; rule: string; name: Loc; text: Loc; tone: string[] }>
export const banners = bannersJson as Array<{ id: number; title: Loc; text: Loc; cta: Loc; to: string; photo: string; theme: 'dark' | 'light'; panel: string[]; focal: number[]; nozzle: number[] | null; mist: string }>
export const testimonials = testimonialsJson as Array<{ id: number; user: string; source: string; date: string; text: Loc; product: string }>
export const faq = faqJson as Array<{ id: number; q: Loc; a: Loc }>
export const branches = branchesJson as Array<{ id: number; slug: string; name: Loc; city: Loc; address: Loc; landmark: Loc; hours: string; phone: string; lat: number; lng: number }>
export const settings = settingsJson

const brandMap = Object.fromEntries(brands.map(b => [b.slug, b]))
const bySlug = Object.fromEntries(products.map(p => [p.slug, p]))

export const brandName = (slug: string) => brandMap[slug]?.name ?? slug
export const getProduct = (slug: string) => bySlug[slug]
export const minSize = (p: Product) => p.sizes[0]
export const maxSize = (p: Product) => p.sizes[p.sizes.length - 1]
export const inStock = (p: Product) => p.sizes.some(s => s.stock > 0)

export const PRICE_MIN = Math.min(...products.map(p => minSize(p).price))
export const PRICE_MAX = Math.max(...products.map(p => maxSize(p).price))

/** Lokalizatsiya qilingan matnni olish. */
export function useL() {
  const { locale } = useI18n()
  const L = (o?: Loc | null) => (o ? (o as any)[locale.value] ?? o.uz : '')
  const noteL = (k: string) => L(notes[k]) || k
  const familyL = (k: string) => L(families[k]) || k
  const seasonL = (k: string) => L(seasons[k]) || k
  const money = (n: number | null | undefined) => formatSum(n, locale.value)
  return { L, noteL, familyL, seasonL, money, locale }
}

// ---------- filtrlash ----------
export type Filters = {
  gender?: string; brand?: string[]; family?: string[]; note?: string[]; size?: number[]; season?: string[]
  min?: number; max?: number; sale?: boolean; sort?: string; q?: string
}

export function matchCollection(p: Product, rule: string) {
  switch (rule) {
    case 'new': return p.isNew
    case 'top': return p.badge === 'top'
    case 'sale': return p.discount > 0
    case 'summer': return p.seasons.includes('summer')
    case 'evening': return p.time === 'evening'
    case 'gift': return p.rating >= 4.7 || p.badge === 'top'
    default: return true
  }
}

export function sortProducts(list: Product[], sort = 'popular') {
  const arr = [...list]
  switch (sort) {
    case 'price_asc': return arr.sort((a, b) => minSize(a).price - minSize(b).price)
    case 'price_desc': return arr.sort((a, b) => minSize(b).price - minSize(a).price)
    case 'new': return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'discount': return arr.sort((a, b) => b.discount - a.discount)
    case 'az': return arr.sort((a, b) => (brandName(a.brand) + a.name).localeCompare(brandName(b.brand) + b.name))
    // haqiqiy (mijoz suratli) atirlar birinchi, keyin Top, keyin mashhurlik
    default: return arr.sort((a, b) => Number(!!b.real) - Number(!!a.real) || Number(b.badge === 'top') - Number(a.badge === 'top') || b.popularity - a.popularity)
  }
}

export function filterProducts(f: Filters, base: Product[] = products) {
  const list = base.filter(p => {
    if (f.gender && f.gender !== 'all' && p.gender !== f.gender) return false
    if (f.brand?.length && !f.brand.includes(p.brand)) return false
    if (f.family?.length && !p.families.some(x => f.family!.includes(x))) return false
    if (f.note?.length) {
      const all = [...p.notes.top, ...p.notes.heart, ...p.notes.base]
      if (!f.note.some(n => all.includes(n))) return false
    }
    if (f.season?.length && !p.seasons.some(s => f.season!.includes(s))) return false
    if (f.sale && !p.discount) return false
    if (f.size?.length && !p.sizes.some(s => f.size!.includes(s.ml))) return false
    const lo = minSize(p).price, hi = maxSize(p).price
    if (f.min != null && hi < f.min) return false
    if (f.max != null && lo > f.max) return false
    return true
  })
  return sortProducts(list, f.sort)
}

// ---------- qidiruv ----------
type Indexed = { p: Product; name: string[]; brand: string[]; extra: string[] }
let index: Indexed[] | null = null
function getIndex() {
  if (index) return index
  index = products.map(p => {
    const noteWords = [...p.notes.top, ...p.notes.heart, ...p.notes.base].flatMap(k => [notes[k]?.uz, notes[k]?.ru, k])
    const famWords = p.families.flatMap(k => [families[k]?.uz, families[k]?.ru])
    return {
      p,
      name: normalize(p.name).split(' '),
      brand: normalize(brandName(p.brand)).split(' '),
      extra: normalize([...noteWords, ...famWords].filter(Boolean).join(' ')).split(' ')
    }
  })
  return index
}

/** Lotin/kirill, kichik xatolarga chidamli qidiruv. */
export function searchProducts(q: string, limit = 50) {
  const terms = normalize(q).split(' ').filter(t => t.length >= 2)
  if (!terms.length) return []
  const scored: Array<[number, Product]> = []
  for (const it of getIndex()) {
    let score = 0
    let all = true
    for (const t of terms) {
      const s = fuzzyWordHit(t, it.name) * 3 + fuzzyWordHit(t, it.brand) * 2 + fuzzyWordHit(t, it.extra)
      if (!s) { all = false; break }
      score += s
    }
    if (all) scored.push([score + it.p.popularity / 2000, it.p])
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(x => x[1])
}

export function relatedProducts(p: Product, n = 8) {
  return products
    .filter(x => x.slug !== p.slug)
    .map(x => ({ x, s: x.families.filter(f => p.families.includes(f)).length * 3 + Number(x.gender === p.gender || x.gender === 'unisex') * 2 + Number(x.brand === p.brand) }))
    .sort((a, b) => b.s - a.s || b.x.popularity - a.x.popularity)
    .slice(0, n)
    .map(a => a.x)
}

export const counts = {
  men: products.filter(p => p.gender === 'men').length,
  women: products.filter(p => p.gender === 'women').length,
  unisex: products.filter(p => p.gender === 'unisex').length,
  sale: products.filter(p => p.discount > 0).length,
  all: products.length
}

/** Filtr panelidagi notalar ro'yxati — eng ko'p uchraydiganlari. */
export const popularNotes = (() => {
  const c: Record<string, number> = {}
  products.forEach(p => [...p.notes.top, ...p.notes.heart, ...p.notes.base].forEach(n => (c[n] = (c[n] || 0) + 1)))
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 18).map(([k]) => k)
})()

/** Flakondagi suyuqlik sathi tanlangan hajmga qarab (animatsiya uchun). */
export const fillLevel = (ml: number) => (ml <= 30 ? 0.6 : ml <= 50 ? 0.75 : 0.9)

/** Oq fonli suratda flakon tanlangan hajmga qarab biroz kichrayadi/kattalashadi. */
export const sizeScale = (ml: number) => (ml <= 30 ? 0.86 : ml <= 50 ? 0.94 : 1)

// Atir maslahatchisi uchun mock tavsiya mantig'i.
// Backend tayyor bo'lgach POST /recommend (LLM) bilan almashtiriladi; javob formati shu bo'lib qoladi.
import { products, type Product } from '~/lib/catalog'

export type QuizAnswers = {
  age: number
  gender: 'men' | 'women' | 'unisex' | ''
  job: string
  seasons: string[]
  places: string[]
  purpose: string
  priority: string
  compliment: string
}

export type Reason = { key: 'season' | 'family' | 'long' | 'evening' | 'day' | 'unique'; season?: string; family?: string; n?: number }
export type Pick = { p: Product; match: number; reasons: Reason[] }

const NICHE = ['creed', 'mfk', 'xerjoff', 'kilian', 'initio', 'pdm', 'byredo', 'le-labo', 'amouage', 'montale']
const has = (p: Product, ...f: string[]) => p.families.some(x => f.includes(x))

export function recommend(a: QuizAnswers, n = 4): Pick[] {
  const scored = products.filter(p => p.sizes.some(s => s.stock > 0)).map(p => {
    let s = 0
    const why: Array<[number, Reason]> = []

    if (a.gender === 'men') s += p.gender === 'men' ? 4 : p.gender === 'unisex' ? 2 : -20
    else if (a.gender === 'women') s += p.gender === 'women' ? 4 : p.gender === 'unisex' ? 2 : -20
    else s += p.gender === 'unisex' ? 2 : 0

    if (a.age < 25 && has(p, 'fruity', 'citrus', 'gourmand', 'aquatic')) s += 1.5
    if (a.age >= 35 && has(p, 'woody', 'oriental', 'leather')) s += 1.5

    const seasonHit = p.seasons.filter(x => a.seasons.includes(x))
    if (seasonHit.length) { s += seasonHit.length * 2; why.push([seasonHit.length * 2, { key: 'season', season: seasonHit[0] }]) }

    if (a.places.some(x => ['office', 'uni', 'car'].includes(x)) && p.sillage <= 3) s += 2
    if (a.places.includes('meetings') && has(p, 'woody', 'fougere')) s += 2
    if (a.places.includes('cafe') && has(p, 'gourmand', 'oriental')) s += 1.5
    if (a.places.includes('outdoor') && has(p, 'citrus', 'aquatic')) s += 2

    if ((a.purpose === 'daily' || a.purpose === 'work') && p.time !== 'evening') { s += 3; why.push([3, { key: 'day' }]) }
    if (a.purpose === 'date' && has(p, 'oriental', 'gourmand', 'floral')) s += 2
    if ((a.purpose === 'event' || a.purpose === 'date') && p.time === 'evening') { s += 3; why.push([3, { key: 'evening' }]) }
    if (a.purpose === 'event' && p.sillage >= 4) s += 2
    if (a.purpose === 'all' && p.time === 'any') s += 3

    if (a.priority === 'long') { s += p.longevity * 1.4; if (p.longevity >= 4) why.push([p.longevity, { key: 'long', n: p.longevity }]) }
    if (a.priority === 'unique' && NICHE.includes(p.brand)) { s += 3; why.push([3.5, { key: 'unique' }]) }

    const fam: Record<string, string[]> = {
      clean: ['citrus', 'aquatic', 'fougere'], rich: ['oriental', 'woody', 'leather'], which: ['oriental', 'gourmand', 'woody'],
      nice: ['floral', 'gourmand', 'fruity'], memory: ['woody', 'spicy', 'oriental']
    }
    const wanted = fam[a.compliment] ?? []
    const famHit = p.families.find(f => wanted.includes(f))
    if (famHit) { s += 3; why.push([3.2, { key: 'family', family: famHit }]) }
    if ((a.compliment === 'rich' || a.compliment === 'which') && NICHE.includes(p.brand)) s += 2

    const job = a.job.toLowerCase()
    if (/shifokor|vrach|врач|doctor|o'qituvchi|учитель|teacher/.test(job) && p.sillage <= 3) s += 2
    if (/talaba|student|студент/.test(job) && p.sizes[0].price < 900000) s += 2
    if (/biznes|tadbirkor|менеджер|manager|director|direktor|rahbar/.test(job) && has(p, 'woody', 'leather')) s += 2

    s += p.rating - 4.5
    const reasons = why.sort((x, y) => y[0] - x[0]).map(x => x[1]).filter((r, i, arr) => arr.findIndex(z => z.key === r.key) === i).slice(0, 2)
    return { p, s, reasons }
  })

  const top = scored.sort((x, y) => y.s - x.s).slice(0, n)
  const best = top[0]?.s || 1
  return top.map((x, i) => ({ p: x.p, reasons: x.reasons, match: Math.max(72, Math.min(98, Math.round(97 - i * 3 - (best - x.s) * 1.5))) }))
}

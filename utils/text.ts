// Matn yordamchilari: narx formati, qidiruv uchun normalizatsiya va xatoga chidamli moslash.

export function formatSum(n: number | null | undefined, locale = 'uz'): string {
  if (n == null) return ''
  const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${s} ${locale === 'ru' ? 'сум' : "so'm"}`
}

const CYR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 's', ч: 'ch', ш: 'sh', щ: 'sh',
  ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h'
}

/** Kichik harf, kirill → lotin, belgilar va diakritikalarsiz. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[а-яёўқғҳ]/g, ch => CYR[ch] ?? ch)
    .replace(/['’ʻʼ`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Oddiy Levenshtein masofasi (qisqa so'zlar uchun yetarli). */
export function distance(a: string, b: string): number {
  if (a === b) return 0
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[n]
}

/** So'rov so'zi matndagi biror so'zga yaqinmi (prefiks yoki 1–2 harf xato). */
export function fuzzyWordHit(q: string, words: string[]): number {
  let best = 0
  for (const w of words) {
    if (w.startsWith(q)) best = Math.max(best, q.length >= 3 ? 3 : 2)
    else if (w.includes(q) && q.length >= 3) best = Math.max(best, 2)
    else if (q.length >= 4) {
      const cut = w.slice(0, q.length + 1)
      const d = Math.min(distance(q, w), distance(q, cut))
      if (d <= (q.length >= 7 ? 2 : 1)) best = Math.max(best, 1)
    }
  }
  return best
}

export function phoneDigits(v: string): string {
  return v.replace(/\D/g, '').replace(/^998/, '').slice(0, 9)
}

export function formatPhone(digits: string): string {
  const d = digits.padEnd(0)
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean)
  return '+998 ' + parts.join(' ')
}

const OPERATORS = ['20', '33', '50', '55', '77', '88', '90', '91', '93', '94', '95', '97', '98', '99']
export function isValidPhone(digits: string): boolean {
  return digits.length === 9 && OPERATORS.includes(digits.slice(0, 2))
}

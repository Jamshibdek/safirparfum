// v-parallax: yengil parallaks. Faqat CSS o'zgaruvchi (--py, px) yoziladi; element uni
// `translate` (transform) orqali ishlatadi. prefers-reduced-motion'da o'chadi.
// Qiymat: { k: tezlik koeffitsienti, max: chegara px, top?: true — sahifa tepasidagi element (scrollY bo'yicha) }
type Opt = { k?: number; max?: number; top?: boolean }
type Item = { el: HTMLElement; o: Required<Opt>; on: boolean }

export default defineNuxtPlugin(nuxtApp => {
  const items = new Set<Item>()
  const byEl = new WeakMap<HTMLElement, Item>()
  let raf = 0
  let io: IntersectionObserver | null = null
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')

  function frame() {
    raf = 0
    const vh = innerHeight
    for (const it of items) {
      if (!it.on) continue
      let y: number
      if (it.o.top) y = scrollY * it.o.k
      else { const r = it.el.getBoundingClientRect(); y = (vh / 2 - (r.top + r.height / 2)) * it.o.k }
      y = Math.max(-it.o.max, Math.min(it.o.max, y))
      it.el.style.setProperty('--py', y.toFixed(1) + 'px')
      if (it.o.top) it.el.style.setProperty('--pf', Math.min(1, scrollY / Math.max(1, it.el.offsetHeight)).toFixed(3))
    }
  }
  const tick = () => { if (!raf) raf = requestAnimationFrame(frame) }
  function ensure() {
    if (io) return
    io = new IntersectionObserver(es => { for (const e of es) { const it = byEl.get(e.target as HTMLElement); if (it) it.on = e.isIntersecting } tick() }, { rootMargin: '100px 0px' })
    addEventListener('scroll', tick, { passive: true })
    addEventListener('resize', tick, { passive: true })
  }

  nuxtApp.vueApp.directive<HTMLElement, Opt | undefined>('parallax', {
    mounted(el, b) {
      if (reduce.matches) return
      ensure()
      const it: Item = { el, o: { k: 0.08, max: 24, top: false, ...(b.value || {}) }, on: false }
      items.add(it); byEl.set(el, it); io!.observe(el); tick()
    },
    beforeUnmount(el) {
      const it = byEl.get(el)
      if (!it) return
      items.delete(it); io?.unobserve(el); byEl.delete(el)
    }
  })
})

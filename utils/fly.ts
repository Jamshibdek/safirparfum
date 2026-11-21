// "Savatga uchish": manba elementdagi flakon nusxasi yoy bo'ylab ko'rinib turgan savat belgisiga uchadi,
// keyin savatdagi son bir sakraydi. 0,4 soniyadan qisqa; "harakatni kamaytirish" yoqilgan bo'lsa faqat sakrash.

function visibleTarget(): HTMLElement | null {
  const list = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-target]'))
  return list.find(el => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
  }) ?? null
}

export function bumpCart() {
  document.querySelectorAll<HTMLElement>('[data-cart-target]').forEach(el => {
    el.classList.remove('cart-bump')
    void el.offsetWidth
    el.classList.add('cart-bump')
  })
}

export function flyToCart(source?: Element | null) {
  if (typeof window === 'undefined') return
  const target = visibleTarget()
  const svg = (source?.querySelector('img.pv, svg') as HTMLElement | SVGElement | null) ?? (source instanceof SVGElement ? source : null)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!target || !svg || reduce || document.hidden || !Element.prototype.animate) return bumpCart()

  const from = svg.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const size = Math.min(96, Math.max(48, from.width * 0.45))
  const ghost = document.createElement('div')
  ghost.setAttribute('aria-hidden', 'true')
  ghost.style.cssText = `position:fixed;z-index:200;pointer-events:none;width:${size}px;height:${size}px;left:${from.left + from.width / 2 - size / 2}px;top:${from.top + from.height / 2 - size / 2}px;border-radius:50%;overflow:hidden;box-shadow:0 12px 30px -10px rgba(11,22,49,.5)`
  const clone = svg.cloneNode(true) as HTMLElement
  clone.style.width = '100%'
  clone.style.height = '100%'
  if (clone.tagName === 'IMG') clone.style.objectFit = 'cover'
  ghost.appendChild(clone)
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const lift = Math.min(140, Math.abs(dx) * 0.25 + 60)
  const anim = ghost.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - lift}px) scale(.7)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: 0.3 }
  ], { duration: 420, easing: 'cubic-bezier(.3,.6,.4,1)' })
  // Himoya: animatsiya tugash hodisasi kelmasa ham nusxa ekranda qolib ketmaydi
  let done = false
  const finish = () => { if (done) return; done = true; ghost.remove(); bumpCart() }
  anim.onfinish = finish
  setTimeout(finish, 900)
}

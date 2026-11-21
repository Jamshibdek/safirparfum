// Raqamni yumshoq "aylantirish" (narx o'zgarganda). SSR'da va "harakatni kamaytirish"da darhol yangi qiymat.
export function useTween(source: () => number, duration = 550) {
  const shown = ref(source())
  let raf = 0
  let guard: ReturnType<typeof setTimeout> | undefined
  watch(source, to => {
    cancelAnimationFrame(raf)
    // Fon tabida kadrlar chizilmaydi — narx eski holda qolib ketmasligi uchun darhol yangilaymiz
    if (import.meta.server || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) { shown.value = to; return }
    const from = shown.value, t0 = performance.now()
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / duration)
      shown.value = Math.round((from + (to - from) * (1 - Math.pow(1 - k, 3))) / 1000) * 1000
      if (k < 1) raf = requestAnimationFrame(step)
      else shown.value = to
    }
    raf = requestAnimationFrame(step)
    // Himoya: kadrlar kechiksa ham belgilangan vaqtdan keyin aniq narx turadi
    clearTimeout(guard)
    guard = setTimeout(() => { if (shown.value !== source()) { cancelAnimationFrame(raf); shown.value = source() } }, duration + 200)
  })
  // Tab yashiringanda boshlangan animatsiya to'xtab qolsa, qaytganda aniq qiymatni ko'rsatamiz
  const onVis = () => { if (document.hidden) { cancelAnimationFrame(raf); shown.value = source() } }
  if (import.meta.client) document.addEventListener('visibilitychange', onVis)
  onBeforeUnmount(() => { cancelAnimationFrame(raf); clearTimeout(guard); if (import.meta.client) document.removeEventListener('visibilitychange', onVis) })
  return shown
}

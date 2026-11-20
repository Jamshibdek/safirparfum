// Avtomatik sitemap: barcha sahifalar, mahsulotlar va to'plamlar, ikki tilda (hreflang bilan).
import products from '~/data/products.json'
import collections from '~/data/collections.json'

const BASE = 'https://sefir.uz'
const STATIC = ['/', '/shop', '/collections', '/about', '/locations', '/contact', '/delivery', '/returns', '/offer']

export default defineEventHandler(event => {
  const paths = [
    ...STATIC,
    ...collections.map(c => `/collections/${c.slug}`),
    ...products.map(p => `/product/${p.slug}`)
  ]
  const url = (p: string) => {
    const uz = BASE + p
    const ru = BASE + '/ru' + (p === '/' ? '' : p)
    const alt = `<xhtml:link rel="alternate" hreflang="uz" href="${uz}"/><xhtml:link rel="alternate" hreflang="ru" href="${ru}"/>`
    return `<url><loc>${uz}</loc>${alt}</url><url><loc>${ru}</loc>${alt}</url>`
  }
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${paths.map(url).join('')}</urlset>`
})

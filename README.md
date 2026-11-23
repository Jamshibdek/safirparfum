# Sefir Parfum — frontend (sefir.uz)

Parfyumeriya internet-do'konining frontendi. Backend hali yo'q: barcha ma'lumotlar `data/*.json` dagi mock fayllardan olinadi, savat, sevimlilar va oxirgi buyurtmalar brauzerda (localStorage) saqlanadi.

**Stek:** Nuxt 3 (SSR), Vue 3, Pinia, @nuxtjs/i18n (o'zbekcha — asosiy, ruscha — `/ru/...`).

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:3000
npm run data       # mock ma'lumotlarni qayta yaratish (scripts/build-data.mjs)
npm run build      # production build
```

## Vercel'ga joylash

1. Loyihani GitHub'ga yuklang va Vercel'da **Import Project** qiling — Nuxt avtomatik aniqlanadi, sozlash shart emas.
2. Yoki terminaldan: `npx vercel` (birinchi marta akkauntga kirish so'raladi).
3. Domen: Vercel → Project → Settings → Domains → `sefir.uz`. Hozirgi NS (ahost.uz) da Vercel ko'rsatgan A / CNAME yozuvlarini qo'shing.

## Demo ma'lumotlar

| Nima | Qiymat |
| --- | --- |
| Promokodlar | `SEFIR10` (−10%), `YANGI50` (−50 000 so'm, 500 000 dan) |
| Telefon, manzil, filiallar | Namunaviy — `scripts/build-data.mjs` dagi `settings` va `branches` da almashtiring |

## Backend ulanganda nima o'zgaradi

- `lib/catalog.ts` — JSON importlari o'rniga API chaqiruvlari (`GET /products`, `/collections`, ...). Komponentlar o'zgarmaydi.
- `lib/recommend.ts` — test natijasi `POST /recommend` (LLM) dan keladi; javob formati saqlanadi.
- `pages/checkout.vue` → `POST /orders`; `components/CallbackForm.vue`, `pages/contact.vue` → `POST /leads`.
- Click / Payme checkout'ga keyin qo'shiladi (hozir "tez orada" yozuvi bor).

## Tuzilma

```
components/   UI bloklar (header, kartochka, savat, test, filtr...)
pages/        sahifalar (bosh, katalog, mahsulot, checkout, ma'lumot)
lib/          ma'lumot qatlami, qidiruv, tavsiya, huquqiy matnlar
stores/       Pinia: savat, sevimlilar, buyurtmalar
data/         mock JSON (generator: scripts/build-data.mjs)
i18n/locales/ uz.json, ru.json
```

Mahsulot rasmlari hozircha `components/BottleArt.vue` da SVG bilan chiziladi; haqiqiy fotosuratlar kelganda shu komponent `<img>` ga almashtiriladi.

## Hozircha yo'q

- Foydalanuvchi kabineti va SMS orqali kirish — keyin backend bilan qo'shiladi (TZ, 9-bo'lim).
- Admin panel — backend bilan birga.

## Mijoz rasmlari va videolari

- Manba: `../rasmvidio` (mijoz papkasi). Saytga siqilgan nusxalari `public/media/` da: `p/` — mahsulot suratlari (WebP, 900 va 440 px), `hero/` — banner suratlari, `v/` — videolar (H.264 MP4, 9:16, ovozsiz, ≤15 s) va posterlari.
- 11 ta haqiqiy atir `scripts/build-data.mjs` dagi `REAL` ro'yxatida; rasm va video nomlari shu yerda bog'langan. Notalar va narxlar namunaviy.
- Bosh sahifadagi atir sepilishini qayta ko'rish: havolaga `?spray` qo'shing (masalan `https://safirparfum.vercel.app/?spray`).

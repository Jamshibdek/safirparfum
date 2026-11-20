# SafirParfum — frontend (sefir.uz)

Parfyumeriya internet-do'konining frontendi. Backend hali yo'q: barcha ma'lumotlar `data/*.json` dagi mock fayllardan olinadi, savat / sevimlilar / kabinet / buyurtmalar brauzerda (localStorage) saqlanadi.

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
| SMS kod (kirish) | `1234` |
| Promokodlar | `SAFIR10` (−10%), `YANGI50` (−50 000 so'm, 500 000 dan) |
| Telefon, manzil, filiallar | Namunaviy — `scripts/build-data.mjs` dagi `settings` va `branches` da almashtiring |

## Backend ulanganda nima o'zgaradi

- `lib/catalog.ts` — JSON importlari o'rniga API chaqiruvlari (`GET /products`, `/collections`, ...). Komponentlar o'zgarmaydi.
- `lib/recommend.ts` — test natijasi `POST /recommend` (LLM) dan keladi; javob formati saqlanadi.
- `pages/checkout.vue` → `POST /orders`; `components/CallbackForm.vue`, `pages/contact.vue` → `POST /leads`; `components/LoginModal.vue` → `POST /auth/otp`, `/auth/verify`.
- Click / Payme checkout'ga keyin qo'shiladi (hozir "tez orada" yozuvi bor).

## Tuzilma

```
components/   UI bloklar (header, kartochka, savat, test, filtr...)
pages/        sahifalar (bosh, katalog, mahsulot, checkout, kabinet, ma'lumot)
lib/          ma'lumot qatlami, qidiruv, tavsiya, huquqiy matnlar
stores/       Pinia: savat, sevimlilar, kabinet
data/         mock JSON (generator: scripts/build-data.mjs)
i18n/locales/ uz.json, ru.json
```

Mahsulot rasmlari hozircha `components/BottleArt.vue` da SVG bilan chiziladi; haqiqiy fotosuratlar kelganda shu komponent `<img>` ga almashtiriladi.

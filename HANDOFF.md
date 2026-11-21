# SafirParfum — loyihani topshirish fayli (yangi Claude uchun)

> **Yangi Claude'ga:** bu fayl avvalgi uzun sessiyaning to'liq xulosasi. Uni oxirigacha o'qib chiqing, keyin loyiha papkasidagi kodni ko'rib, "Keyingi qadamlar" bo'limidan davom eting. Foydalanuvchi o'zbek tilida (lotin) yozadi, qisqa va og'zaki uslubda; javoblarni ham o'zbekcha bering.
>
> Holat sanasi: **2026-11-21**. Oxirgi commit: `6c569bb` (main).

---

## 1. Loyiha nima

- **SafirParfum** — Toshkentdagi parfyumeriya internet-do'koni. Domen **sefir.uz** (hali ulanmagan).
- Hozir faqat **frontend** bor. Backend, to'lov (Click/Payme) va admin panel keyinroq qilinadi.
- Ma'lumotlar `data/*.json` dagi **mock JSON**'dan olinadi. Savat, sevimlilar va buyurtmalar brauzerning `localStorage`'ida saqlanadi.
- Tillar: o'zbekcha (asosiy, `/`) va ruscha (`/ru/...`).
- Dizayn namunasi **yorqinparfumes.uz** (uslub va tuzilma uchun). Undan rasm yoki matn ko'chirilmagan.
- Mijoz uchun jonli demo: **https://safirparfum.vercel.app**
- GitHub: **https://github.com/Jamshibdek/safirparfum** (`main` branch). Vercel `main`'ga har push'da avtomatik deploy qiladi (taxminan 1 daqiqa).

## 2. Mahalliy papkalar

```
/Users/jamshidbek/CoderJAmbo/
├── safirparfum/   ← loyiha (Nuxt 3), git repo
└── rasmvidio/     ← mijozning asl rasm/video/logo fayllari (IMG_*.PNG, *.MOV, *.MP4, SEFIR/)
```

Saytdagi siqilgan nusxalar `safirparfum/public/media/` papkasida turadi (4-bo'limga qarang).

## 3. Texnik stek va buyruqlar

- Nuxt **3.17** (SSR, Vercel preset), Vue 3.5, **Pinia 3.0.4** + @pinia/nuxt 0.11.3, @nuxtjs/i18n v9 (`prefix_except_default`, lazy, `i18n/locales/uz.json`, `ru.json`).
- Shriftlar (Google Fonts): **Prata** (sarlavhalar, faqat 400, `font-synthesis: none`) va **Onest** (matn).

```bash
npm install
npm run dev     # http://localhost:3000
npm run data    # scripts/build-data.mjs → data/*.json ni qayta yaratadi
npm run build
```

**Shu kompyuterga xos narsalar:**
- `node` PATH'da yo'q. U `~/.local/node/bin/node` (v22.11) da turadi. Buyruqlardan oldin `export PATH=$HOME/.local/node/bin:$PATH` qiling.
- `git` binari: `/Library/Developer/CommandLineTools/usr/bin/git`. Commit muallifi: `-c user.name=Jamshibdek -c user.email=162863313+Jamshibdek@users.noreply.github.com`.
- `python3` chaqirilsa, Xcode CLT o'rnatish oynasi chiqib qoladi. Skriptlar uchun node ishlating.
- Oddiy `git push` avval parol kutib osilib qolgan. Shuning uchun push isomorphic-git skripti orqali, `gh auth token` bilan qilingan (skript vaqtinchalik papkada edi, endi yo'q bo'lishi mumkin). Yangi joyda eng osoni: `gh auth login`, keyin `gh auth setup-git`, keyin `git push origin main`.
- `gh` CLI: `~/.local/bin/gh`.
- Dev server `/Users/jamshidbek/CoderJAmbo/.claude/launch.json` orqali "safirparfum" nomi bilan 3000-portda ishga tushirilgan.

## 4. Tuzilma (muhim fayllar)

| Fayl | Vazifasi |
| --- | --- |
| `scripts/build-data.mjs` | **Barcha mock ma'lumotlar generatori.** NOTES, FAMILIES, BRANDS (birinchisi `safir`). `REAL` — mijozning 11 ta haqiqiy atiri (rasm/video bilan), undan keyin namunaviy mahsulotlar. Bannerlar, sharhlar (slug bo'yicha bog'langan), filiallar, sozlamalar ham shu yerda |
| `lib/catalog.ts` | Ma'lumot qatlami: `Product` tipi, `searchProducts` (kirill→lotin, Levenshtein), `filterProducts`, saralash (haqiqiy mahsulotlar birinchi), `relatedProducts`, `useL()` (tarjima/pul formati), `fillLevel(ml)` (30→0.6, 50→0.75, 100→0.9), `sizeScale(ml)` (0.86/0.94/1) |
| `lib/recommend.ts` | 8 savollik test natijasi (hozir lokal; keyin `POST /recommend` LLM) |
| `components/ProductCard.vue` | Katalog kartochkasi (Uzum uslubi, 6-bo'limga qarang) |
| `components/ProductVisual.vue` | Haqiqiy surat bo'lsa `<img class="pv">` + srcset (`-sm.webp` 440w / `.webp` 900w), bo'lmasa `BottleArt` SVG |
| `components/BottleArt.vue` | Chizilgan flakon SVG: qopqoq ochiladi, suyuqlik sathi, bug' chiziqlari |
| `components/SizeGauge.vue` | Kichik flakon: tanlangan ml bo'yicha to'lish darajasi |
| `components/PhoneReel.vue` | Telefon ramkasidagi reels video: ovozsiz, ko'ringanda yuklanadi, ketma-ket videolar, kattalashtirish |
| `components/HeroSlider.vue` | Bosh banner: 3 foto slayd. Birinchi kirishda canvas'da **atir sepilishi** animatsiyasi (`?spray` bilan majburan ko'rsatiladi; sessionStorage `sp-sprayed`) |
| `components/ProductRail.vue` | Gorizontal lenta (mobilda karta eni 46%) |
| `components/QuickView.vue`, `CartDrawer.vue`, `QuizPanel.vue`, `MegaMenu.vue`, `MobileNav.vue`, `ToastBar.vue`, `Logo.vue` | Modal/panellar, logo (sariq S belgisi + "SAFIR PARFUM" yozuvi) |
| `pages/product/[slug].vue` | Mahsulot sahifasi (6-bo'limga qarang) |
| `pages/shop.vue` (+ `CatalogView.vue`, `FilterPanel.vue`) | Katalog: filtrlar va saralash URL'da saqlanadi |
| `pages/checkout.vue`, `order/[id].vue`, `wishlist.vue` | Faqat klient tomonda (`ssr:false`). Demo promokodlar: `SAFIR10`, `YANGI50` |
| `stores/shop.ts` | Savat, sevimlilar, ui (`notify(text, action?, sub?)`) |
| `stores/orders.ts` | Buyurtmalar (`placeOrder`) |
| `plugins/persist.client.ts` | localStorage: `sp-cart`, `sp-wish`, `sp-recent`, `sp-orders` |
| `utils/fly.ts` | "Savatga uchish" animatsiyasi (`[data-cart-target]` tomon) |
| `composables/useTween.ts` | Narxni sanab o'zgartiruvchi tween (yashirin tabda osilmaydi) |
| `assets/css/main.css` | Dizayn tokenlari, `.grid-products`, global stillar |
| `server/routes/sitemap.xml.ts` | Sitemap |
| `error.vue` | 404/500 sahifa |

**Media:**
- `public/media/p/<kalit>-1.webp` va `-sm.webp` — mahsulot suratlari.
- `public/media/hero/` — banner suratlari.
- `public/media/v/<kalit>-N.mp4` va `.webp` poster — H.264, 9:16, ovozsiz, ≤15 s.
- Ular `rasmvidio/` dan sharp va ffmpeg-static bilan qayta ishlangan. Yangi rasm kelsa, xuddi shunday siqib, `REAL` ro'yxatida `media: {img:[...], vid:[...], fit?:'cover'}` ga qo'shing.

## 5. Dizayn yo'nalishi

- "Tungi sapfir + shampan" uslubi. Generik "AI dizayn" ishlatilmaydi (foydalanuvchi buni alohida so'ragan; `frontend-design` skill ishlatilgan).
- Tokenlar:
  - `--bg #EEEFF1`
  - `--ink #14213D`
  - `--sapphire #1E3F8A`
  - `--champagne #CBB389`
  - `--night #0B1631`
  - `--sale` qizil
- Logo: faqat mijozning **sariq S belgisi** (#F3B802) va "SAFIR / PARFUM" yozuvi. Favicon: navy fonda S belgisi.
- Animatsiyalar (1-bosqich, qilingan):
  - bannerda atir sepilishi;
  - kartochka ko'ringanda yoki hover'da qopqoq ochilib yaqinlashishi (foto bo'lsa jilo va 2-rasm);
  - ml tanlanganda flakon to'lishi;
  - savatga uchish animatsiyasi;
  - narx sanalib o'zgarishi.
  - Hammasi `prefers-reduced-motion`'ni hurmat qiladi.
- Asosiy sinov telefoni: **iPhone 11 (414 px)**. 360 px ham tekshiriladi. Mezon: `document.documentElement.scrollWidth === innerWidth` (gorizontal toshib chiqish bo'lmasin).

## 6. Oxirgi holat: Uzum uslubidagi tartib

Foydalanuvchi Uzum Market skrinshotlarini yuborib, **joylashuvni shunga moslashni** so'radi (nusxa emas, bizning elementlar bilan):

**Mahsulot sahifasi (mobil, ≤767 px):**
- Tepada ekran eniga swipe galereya (`.mg`): orqaga, sevimli va ulashish tugmalari, nuqtalar, pastki o'ngda kichik reels video (64 px) va SizeGauge.
- Ostida oq kartalar shu tartibda: **narx** (`.b-price`, chegirma %), **nom va reyting** (`.b-title`), **"Hajm: 30 ml" tugmalari** (`.b-size`).
- Pastda doim turadigan eni to'liq tugma (`.mbar .madd`): "Savatga qo'shish" + "30 ml · narx".
- Desktop'da eski ikki ustunli tartib qolgan: chapda miniatyuralar, asosiy rasm va reel.

**Katalog kartochkasi (`ProductCard.vue`):**
- Rasm 3:4.
- Tartib yuqoridan pastga:
  - narx (yonida −% belgisi);
  - eski narx qatori (chegirma bo'lmasa bo'sh joy qoladi, shunda bir qatordagi tugmalar tekis turadi);
  - "Brend · oila, jins" bir qatorda;
  - ★ reyting (N ta sharh);
  - 30/50/100 ml tugmalari;
  - eni to'liq "Savatga" tugmasi.
- Atir nomi rasmda yozilgani uchun nom (`.title`) **visually-hidden**: SEO uchun qoladi, ko'rinmaydi.
- Mobil setka: 2 ustun, oraliq `22px 12px`.

Hammasi 414, 360 va 1280 px'da tekshirilgan, push qilingan va jonli saytda ishlayapti. **Haqiqiy iPhone'da foydalanuvchi hali ko'rmagan.**

## 7. Qabul qilingan qarorlar (o'zgartirmang, foydalanuvchi so'ramasa)

1. Sayt nomi: **SafirParfum**.
2. Katalog: 11 ta haqiqiy mahsulot va namunaviy mahsulotlar aralash. Haqiqiylari doim birinchi turadi.
3. Hajmlar: **30 / 50 / 100 ml**. Ml tanlanganda flakon to'lishi ko'rinib o'zgarishi shart (30 kam, 100 ko'p).
4. Videolar **faqat mahsulot sahifasida**, kichik reels ko'rinishida. Kartochkada faqat "Video" belgisi bor.
5. **Foydalanuvchi kabineti va login yo'q** (olib tashlangan). Backend bilan keyin qo'shiladi.
6. **Admin panel** keyin, backend bilan birga.
7. Click/Payme hozircha yo'q, checkout'da "tez orada" yozuvi bor.
8. sefir.uz domeni **keyinroq** ulanadi (foydalanuvchi "Keyinroq" degan). Hozircha Vercel manzili ishlatiladi.
9. Narxlar va notalar namunaviy. Haqiqiylari mijozdan kelishi kerak.

## 8. Ma'lum muammolar va saboqlar

- **Bosh sahifa prerender bo'lmaydi.** Build'da `[unstorage] Invalid key: "/"` xatosi chiqadi: unstorage 1.17.6 `/` kalitini qabul qilmaydi. Sayt ishlaydi, `/` Vercel'da SSR bilan beriladi. Keyinroq Nuxt/nitro'ni yangilab yoki unstorage versiyasini qotirib tuzatish mumkin.
- Mahalliy `node .output/server` (node-server preset) prerender sahifalarni noto'g'ri yo'ldan (`chunks/public`) qidiradi va 500 beradi. Bu faqat mahalliy muammo, Vercel'da yo'q.
- **404 → 500 xatosi tuzatildi.** Pinia 2.3.1'ning `shouldHydrate` funksiyasi null-prototype obyektda yiqilardi. Pinia 3.0.4'ga o'tilgan.
- `position:absolute` visually-hidden element overflow scroller ichida layout'ni kengaytirib yuboradi. Shuning uchun `.pc` va `.track` da `position: relative` turibdi.
- Scoped CSS'dagi `:global(...)` butun selektorni global qiladi. Intro uchun qoida `main.css` da: `html.sp-intro .hero .slide[data-k="0"] .copy > *`.
- Global `.skip-link` va banner'dagi `.intro-skip` nomlari ataylab har xil (to'qnashuv bo'lgan).
- Yashirin tabda `requestAnimationFrame` to'xtaydi. Shuning uchun `useTween` va `fly.ts` da zaxira timeout'lar bor.
- Sharhlar mahsulotlarga **slug** bo'yicha bog'langan (indeks bo'yicha emas).
- Grid'larda `minmax(0,1fr)` va `min-width:0` ishlatiladi, aks holda mobilda toshib chiqadi.

## 9. Keyingi qadamlar (taklif qilingan tartibda)

1. Foydalanuvchi va mijoz yangi tartibni **iPhone'da ko'rib** fikr bildiradi. Tuzatishlar shu fikrga qarab qilinadi.
2. Mijozdan **haqiqiy narxlar, notalar va tavsiflarni** olib, `REAL` ro'yxatiga kiritish, keyin `npm run data`.
3. (Ixtiyoriy) Animatsiyalarning 2-bosqichi: research sahifasidagi g'oyalar (pastga qarang).
4. Bosh sahifa prerender xatosini tuzatish (8-bo'lim).
5. sefir.uz domenini Vercel'ga ulash. Domen NS'i ahost.uz'da; Vercel ko'rsatgan A/CNAME yozuvlari qo'shiladi.
6. **Backend** (TZ 13-bo'lim):
   - REST API, PostgreSQL;
   - `lib/catalog.ts` dagi JSON importlari API chaqiruvlariga almashtiriladi, komponentlar o'zgarmaydi;
   - `POST /orders`, `/leads`, `/recommend`;
   - Telegram bot xabarlari;
   - keyin admin panel, SMS login va kabinet, Click/Payme/Uzum.

## 10. TZ (texnik topshiriq) qisqacha

To'liq TZ claude.ai'dagi hujjatda: "Parfyumeriya internet-do'koni — TZ", https://claude.ai/artifact/4jmaYXUFGLScikNwoWp5Xm. U eski akkauntda turadi, yangi akkaunt uni ocholmasligi mumkin. Eng muhimi:

- **Rollar:** mehmon, mijoz, operator, admin. Tillar UZ (asosiy) va RU, valyuta so'm.
- **Header:** 2 qator, sticky:
  - logo va menyu (Bosh sahifa, Katalog, Biz haqimizda, Aloqa);
  - telefon, til, sevimlilar, Telegram tugmasi;
  - "Katalog" tugmasi mega-menyuni ochadi;
  - jonli qidiruv (2 harfdan keyin, lotin/kirill, xatoga chidamli), `/search?q=`;
  - savat.
  - Mobilda gamburger va pastki panel (Bosh sahifa, Katalog, Test, Sevimlilar, Savat).
- **Bosh sahifa:**
  - banner-slayder;
  - AI test tasmasi;
  - tanlangan atirlar;
  - kategoriya plitkalari;
  - mijozlar sharhlari (Instagram/Telegram skrinshotlari);
  - FAQ akkordeon;
  - xarita va filiallar;
  - qo'ng'iroq buyurtma formasi;
  - qo'shimcha: brendlar lentasi, chegirmalar, afzalliklar.
- **Katalog `/shop`:**
  - jins chiplari;
  - filtrlar: brend, hid oilasi, notalar, narx, hajm, fasl, faqat chegirma;
  - saralash: tavsiya, arzon→qimmat, qimmat→arzon, yangi, chegirma, A→Z;
  - filtr va saralash URL'da saqlanadi;
  - setka 4/3/2 ustun.
- **AI maslahatchi:** 8 savol (yosh, jins, kasb, fasl, joy, maqsad, uzoq turish/xoslik, kompliment). Natijada katalogdan 3–5 atir, har biriga izoh, narx va "Savatga" tugmasi.
- **Mahsulot sahifasi:**
  - galereya va video;
  - hid oilasi, nom, brend, shior;
  - tanlangan hajm narxi va eski narx;
  - tavsif;
  - 30/50/100 ml tanlash;
  - miqdor va "Savatga";
  - holat va afzalliklar;
  - notalar (yuqori, yurak, asos);
  - xususiyatlar (fasl, vaqt, turg'unlik, tarqalish, konsentratsiya);
  - o'xshash atirlar, yaqinda ko'rilganlar, sharhlar;
  - SEO: SSR va schema.org Product/Offer/Breadcrumb.
- **Savat va checkout:**
  - savat paneli: bepul yetkazishgacha progress, jami summa;
  - checkout `/checkout`:
    - F.I.O., telefon (+998 niqobi);
    - yetkazish yoki filialdan olib ketish;
    - shahar va manzil;
    - to'lov usuli (naqd, karta, Click, Payme, Uzum);
    - promokod;
  - muvaffaqiyat sahifasi `/order/<raqam>`.
- **Ma'lumot sahifalari:** `/about`, `/locations`, `/contact`, `/collections`, `/delivery`, `/returns`, `/offer`, 404 (haqiqiy 404 status bilan).
- **Admin panel (keyin):**
  - dashboard;
  - mahsulotlar (hajm bo'yicha narx va qoldiq, rasmlar, SEO, Excel import/eksport);
  - brendlar, kolleksiyalar;
  - buyurtmalar va holatlar;
  - so'rovlar (lead), mijozlar, promokodlar;
  - kontent (bannerlar, sharhlar, FAQ, filiallar);
  - AI test sozlamalari;
  - sozlamalar (telefon, yetkazish narxlari, Telegram bot, Pixel/GA4);
  - rollar: Admin, Kontent-menejer, Operator;
  - yangi buyurtma 5 soniyada Telegram guruhga tushadi.
- **Tezlik maqsadi (mobil Lighthouse):** Performance ≥85, LCP ≤2.5 s, CLS ≤0.1, INP ≤200 ms, JS ≤200 KB.
- **Namuna saytdagi kamchiliklar (bizda bo'lmasligi kerak):**
  - bitta atirga turli joyda turli narx;
  - eski narx yangisidan kichik bo'lishi;
  - butun katalogni bitta so'rovda yuklash;
  - SSR yo'qligi;
  - bo'sh filiallar sahifasi;
  - qidiruvda natijalar sahifasi yo'qligi;
  - 404'ning 200 qaytarishi;
  - sitemap'da URL'larning kamligi;
  - `http://` rasmlar va noto'g'ri slug'lar.
- **Bosqichlar:** dizayn → frontend → backend → integratsiyalar → ishga tushirish, keyin 3 oy kafolat.

## 11. Animatsiya research xulosasi (2-bosqich g'oyalari)

Research claude.ai artifakt sifatida qilingan ("SafirParfum animatsiyalari"). Foydalanuvchi uchta narsani xohlagan:

1. Saytga kirganda atir sepilishi.
2. Kartochkalardagi atir ko'ringanda qopqog'i ochilib, yaqinlashishi.
3. ml bo'yicha flakon to'lishi.

Uchalasi qilingan. Keyingi g'oyalar:
- "hid notalari" vizualizatsiyasi (yuqori, yurak, asos qatlamlari animatsiyasi);
- test paneli o'tishlari;
- yengil parallaks.

Qoidalar:
- animatsiya faqat `transform` va `opacity` bilan;
- `prefers-reduced-motion` hurmat qilinadi;
- Core Web Vitals buzilmasin.

## 12. Foydalanuvchi bilan ishlash uslubi

- Foydalanuvchi ko'pincha iPhone skrinshotlari bilan muammo ko'rsatadi ("sig'may qolyapti", "hunuk chiqyapti").
- Tuzatishni 414 px emulyatsiyada JS o'lchovlari bilan tekshiring, keyin push qilib jonli saytni tasdiqlang.
- O'zgarish tayyor bo'lsa, odatda darhol GitHub'ga push qilinadi (Vercel avtomatik yangilanadi). Foydalanuvchi buni mijozga ko'rsatadi.
- Katta mahsulot qarorlarida (nom, katalog, video, hajmlar) variantlar bilan savol berilgan. Kichik dizayn ishlarida o'zingiz hal qilib, natijani ko'rsating.

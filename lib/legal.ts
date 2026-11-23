// Yetkazib berish, qaytarish va oferta matnlari (namunaviy). Admin panel kelganda u yerdan tahrirlanadi.
import type { Loc } from '~/lib/catalog'

export type LegalPage = { title: Loc; updated: string; blocks: Array<{ h: Loc; p: Loc[] }> }

export const legal: Record<'delivery' | 'returns' | 'offer', LegalPage> = {
  delivery: {
    title: { uz: 'Yetkazib berish va to\'lov', ru: 'Доставка и оплата' },
    updated: '2026-11-01',
    blocks: [
      { h: { uz: 'Toshkent bo\'ylab', ru: 'По Ташкенту' }, p: [
        { uz: 'Kuryer buyurtmani tasdiqlangan kuni yoki ertasi kuni olib boradi. 14:00 gacha berilgan buyurtma shu kuni yetkaziladi.', ru: 'Курьер доставит в день подтверждения или на следующий день. Заказы до 14:00 доставляем в тот же день.' },
        { uz: 'Narxi — 30 000 so\'m. 500 000 so\'mdan yuqori buyurtmada bepul.', ru: 'Стоимость — 30 000 сум. Бесплатно для заказов от 500 000 сум.' }
      ] },
      { h: { uz: 'Viloyatlarga', ru: 'В регионы' }, p: [
        { uz: 'Pochta yoki BTS orqali 1–3 ish kunida. Narxi — 45 000 so\'m, 500 000 so\'mdan yuqori buyurtmada bepul.', ru: 'Почтой или BTS за 1–3 рабочих дня. Стоимость — 45 000 сум, бесплатно от 500 000 сум.' }
      ] },
      { h: { uz: 'Filialdan olib ketish', ru: 'Самовывоз' }, p: [
        { uz: 'Bepul. Buyurtma tayyor bo\'lgach SMS yuboramiz — odatda 1 soat ichida.', ru: 'Бесплатно. Пришлём SMS, когда заказ будет готов — обычно в течение часа.' }
      ] },
      { h: { uz: 'To\'lov', ru: 'Оплата' }, p: [
        { uz: 'Naqd pul yoki Uzcard / Humo kartasi orqali — kuryerga yoki filialda. Click va Payme orqali online to\'lov tez orada qo\'shiladi.', ru: 'Наличными или картой Uzcard / Humo — курьеру или в бутике. Онлайн-оплата через Click и Payme скоро появится.' }
      ] }
    ]
  },
  returns: {
    title: { uz: 'Qaytarish va almashtirish', ru: 'Возврат и обмен' },
    updated: '2026-11-01',
    blocks: [
      { h: { uz: 'Qachon qaytarish mumkin', ru: 'Когда можно вернуть' }, p: [
        { uz: 'Ochilmagan, plyonkasi va qutisi butun atirni qaytarishingiz yoki boshqasiga almashtirishingiz mumkin.', ru: 'Невскрытый аромат в целой плёнке и коробке можно вернуть или обменять.' }
      ] },
      { h: { uz: 'Qanday qaytariladi', ru: 'Как вернуть' }, p: [
        { uz: 'Telegram yoki telefon orqali buyurtma raqamini yozing. Atirni filialga olib keling yoki kuryer olib ketadi.', ru: 'Напишите номер заказа в Telegram или позвоните. Принесите аромат в бутик или курьер заберёт его.' },
        { uz: 'Pul 3 ish kunida to\'lov qilingan usulda qaytariladi.', ru: 'Деньги вернём в течение 3 рабочих дней тем же способом оплаты.' }
      ] },
      { h: { uz: 'Nuqson bo\'lsa', ru: 'Если есть дефект' }, p: [
        { uz: 'Flakon yoki purkagich nosoz bo\'lsa, ochilgan bo\'lsa ham bepul almashtiramiz.', ru: 'Если флакон или распылитель неисправен, заменим бесплатно, даже если он вскрыт.' }
      ] }
    ]
  },
  offer: {
    title: { uz: 'Ommaviy oferta', ru: 'Публичная оферта' },
    updated: '2026-11-01',
    blocks: [
      { h: { uz: '1. Umumiy qoidalar', ru: '1. Общие положения' }, p: [
        { uz: 'Ushbu hujjat Sefir Parfum (sefir.uz) va xaridor o\'rtasidagi masofaviy savdo shartlarini belgilaydi. Buyurtmani tasdiqlash ushbu shartlarga rozilik hisoblanadi.', ru: 'Документ определяет условия дистанционной продажи между Sefir Parfum (sefir.uz) и покупателем. Подтверждение заказа означает согласие с условиями.' }
      ] },
      { h: { uz: '2. Narx va to\'lov', ru: '2. Цена и оплата' }, p: [
        { uz: 'Narxlar so\'mda ko\'rsatiladi va buyurtma tasdiqlangan paytdagi narx amal qiladi.', ru: 'Цены указаны в сумах; действует цена на момент подтверждения заказа.' }
      ] },
      { h: { uz: '3. Shaxsiy ma\'lumotlar', ru: '3. Персональные данные' }, p: [
        { uz: 'Ism, telefon va manzil faqat buyurtmani yetkazish va bog\'lanish uchun ishlatiladi va uchinchi shaxslarga berilmaydi.', ru: 'Имя, телефон и адрес используются только для доставки и связи и не передаются третьим лицам.' }
      ] },
      { h: { uz: '4. Eslatma', ru: '4. Примечание' }, p: [
        { uz: 'Bu namunaviy matn. Saytni ishga tushirishdan oldin yurist tomonidan tasdiqlangan matn bilan almashtiring.', ru: 'Это примерный текст. Перед запуском замените его текстом, согласованным с юристом.' }
      ] }
    ]
  }
}

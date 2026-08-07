# Sound Wave

Production-ready одностраничный сайт студии звукозаписи Sound Wave: Next.js-совместимый vinext, TypeScript, Tailwind CSS, Motion и Lenis.

## Запуск

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
```

## Настройка

Скопируйте `.env.example` в `.env.local` и заполните:

- `NEXT_PUBLIC_SITE_URL` — публичный URL сайта без завершающего слэша;
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` — числовой ID счётчика Яндекс Метрики.

Основные редактируемые данные:

- цены, ссылки, адрес и оборудование — `app/site-config.ts`;
- фотографии — `public/studio/`;
- тексты и порядок секций — `app/SoundWaveLanding.tsx`;
- визуальная система и адаптив — `app/globals.css`;
- SEO и social preview — `app/layout.tsx` и `public/og.png`.

## Цели Яндекс Метрики

Создайте JavaScript-цели с идентификаторами:

- `telegram_click`
- `avito_click`
- `hero_cta_click`
- `pricing_cta_click`
- `final_cta_click`
- `pricing_category_change`

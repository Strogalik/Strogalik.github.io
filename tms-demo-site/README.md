# TMS demo landing

Статический лендинг под desktop + mobile с упором на конверсию в заявку на demo.

## Что внутри
- `index.html` — основная страница
- `styles.css` — стили
- `script.js` — мобильное меню, валидация форм, UTM-поля, отправка в endpoint
- `assets/` — логотипы, favicon, партнерские логотипы, PDF политики конфиденциальности

## Как подключить отправку заявок в CRM
Открой `script.js` и укажи endpoint:

```js
const CONFIG = {
  endpoint: 'https://YOUR-WEBHOOK-OR-API',
  method: 'POST'
};
```

Форма отправляет JSON со следующими полями:
- `name`
- `phone`
- `email`
- `company`
- `role`
- `task`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `landing_version`
- `page`
- `submitted_at`
- `form_type` (`hero` или `main`)

## Что можно быстро заменить
### 1. Реальные скрины CRM
Сейчас ключевые экраны собраны как HTML-макеты под ваши approved-screen сценарии:
- KPI
- лиды
- сделки
- AI-помощник

Если захочешь вставить реальные PNG-скрины позже, проще всего заменить содержимое блоков:
- hero: `.product-shell`
- лиды: `.screen-card--light`
- сделки: `.screen-card--dark`
- AI: `.screen-card--assistant-large`

### 2. Тексты CTA
Главные CTA сейчас:
- `Запросить демо`
- `Получить демо`
- `Отправить заявку на демо`

### 3. Партнеры и доверие
Логотипы уже подключены из текущего сайта. Их можно расширить в блоке `.partner-logos`.

## Рекомендация по деплою
Подойдет любой статический хостинг:
- GitHub Pages
- Netlify
- Vercel

## Примечание
Лендинг построен так, чтобы:
- первый экран давал мгновенное понимание продукта;
- форма собирала данные в CRM;
- mobile-версия имела sticky CTA-кнопку внизу экрана.

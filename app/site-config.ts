export const TELEGRAM_URL = "https://t.me/soundwavemsk";

export const AVITO_URL =
  "https://www.avito.ru/moskva/predlozheniya_uslug/studiya_zvukozapisi_soyuz_017_tube_7661288551?context=H4sIAAAAAAAA_wE_AMD_YToyOntzOjEzOiJsb2NhbFByaW9yaXR5IjtiOjA7czoxOiJ4IjtzOjE2OiJUU3pVRXFzbTdwNnFCbldSIjt9HzC2hz8AAAA";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

export const STUDIO = {
  name: "Sound Wave",
  legalName: "ООО «Саунд Вэйв»",
  taxId: "7743459164",
  address: "Москва, ул. Красина, 14с2",
  metro: "7 минут от м. Маяковская",
  telegram: "@soundwavemsk",
} as const;

export type PriceCategory = "intro" | "recording" | "packages" | "production";

export const PRICE_CATEGORIES: Array<{ id: PriceCategory; label: string }> = [
  { id: "intro", label: "Первый визит" },
  { id: "recording", label: "Запись" },
  { id: "packages", label: "Пакеты" },
  { id: "production", label: "Продакшн" },
];

export const PRICE_GROUPS: Record<
  PriceCategory,
  Array<{ name: string; price: string; note?: string }>
> = {
  intro: [
    { name: "Первый час", price: "490 ₽", note: "Знакомство со студией" },
    { name: "Первая ночь", price: "3 990 ₽", note: "Специальная цена первого визита" },
  ],
  recording: [
    { name: "Аренда студии", price: "890 ₽/час", note: "От 3 часов — ещё 1 час бесплатно" },
    { name: "Запись со звукорежиссёром", price: "1 390 ₽/час" },
    { name: "Счастливые часы", price: "790 ₽/час", note: "Ежедневно с 14:00 до 17:00" },
  ],
  packages: [
    { name: "Ночной пакет", price: "4 990 ₽", note: "00:00–09:00" },
    { name: "Дневной пакет", price: "8 990 ₽", note: "10:00–20:00" },
  ],
  production: [
    { name: "Бит и аранжировка", price: "от 4 000 ₽" },
    { name: "Сведение", price: "от 2 990 ₽" },
    { name: "Трек под ключ", price: "от 10 000 ₽" },
  ],
};

export const STUDIO_IMAGES = {
  hero: "/studio/studio-hero.webp",
  cloudWall: "/studio/studio-cloud-wall.webp",
  workstation: "/studio/studio-workstation.webp",
  controller: "/studio/studio-controller.webp",
  microphone: "/studio/studio-microphone.webp",
} as const;

export const EQUIPMENT = [
  ["01", "Союз 017 TUBE", "Ламповый микрофон"],
  ["02", "Apollo Twin X", "Аудиоинтерфейс"],
  ["03", "ADAM Audio A7V", "Студийные мониторы"],
  ["04", "Beyerdynamic DT 900 Pro X", "Наушники"],
  ["05", "Arturia KeyLab 88", "MIDI-клавиатура"],
  ["06", "Компьютер + монитор 37″", "Рабочая станция"],
] as const;

export const ADVANTAGES = [
  "Помощь звукорежиссёра",
  "Акустически подготовленное пространство",
  "Комфортная атмосфера без посторонних",
  "Для начинающих и опытных артистов",
  "7 минут от метро Маяковская",
  "Бесплатная парковка",
] as const;

export const PROCESS_STEPS = [
  {
    title: "Расскажите о задаче",
    text: "Напишите, что хотите записать и когда вам удобно.",
  },
  {
    title: "Подготовим сессию",
    text: "Создадим проект и настроим микрофон под ваш голос.",
  },
  {
    title: "Запишем материал",
    text: "Вокал, бэк-вокал, помощь с дублями и базовая обработка.",
  },
  {
    title: "Передадим дорожки",
    text: "Экспортируем записанный материал после сессии.",
  },
] as const;

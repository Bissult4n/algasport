// Official export IJF versions. Evidence and regional limitations: docs/zone-comparison-sources.md.
export const zoneModels = [
  {
    id: "zone-migaku",
    name: "Migaku",
    label: "Техника и ежедневная практика",
    summary:
      "Практичная модель для отработки техники: мягкая ткань и свобода движений.",
    purpose: "Тренировки и развитие техники",
    level: "Акцент на практичности",
    origin: "Пакистан",
    material: "70% хлопок · 30% полиэстер",
    features: "Широкий шаг строчки; гладкая, мягкая фактура ткани.",
    advice:
      "Если основная задача — тренироваться и отрабатывать технику, начните выбор с Migaku.",
    source: "https://zone.mitsuboshi-global.com/products/migaku-ijf-uniform",
  },
  {
    id: "zone-idomu",
    name: "Idomu",
    label: "Интенсивные тренировки и старты",
    summary:
      "Модель с акцентом на прочность для интенсивной работы и соревнований.",
    purpose: "Интенсивные тренировки и соревнования",
    level: "Акцент на прочности",
    origin: "Пакистан",
    material: "70% хлопок · 30% полиэстер",
    features:
      "Плотная строчка; акцент производителя на прочности при интенсивной работе.",
    advice:
      "Для интенсивных занятий и регулярных стартов присмотритесь к Idomu.",
    source: "https://zone.mitsuboshi-global.com/products/idomu-ijf-uniform",
  },
  {
    id: "zone-kiwami",
    name: "Kiwami",
    label: "Флагман, сделанный в Японии",
    summary:
      "Верхняя модель Zone с особым переплетением ткани и конструкцией воротника.",
    purpose: "Соревнования и требовательная практика",
    level: "Флагман линейки",
    origin: "Япония",
    material: "77% хлопок · 23% полиэстер",
    features:
      "Хлопковая основа и полиэстер в утке. Стоячий воротник и специальная технология пошива плечевой зоны.",
    advice:
      "Если важны японское производство и особенности ткани и воротника, рассмотрите Kiwami.",
    source: "https://zone.mitsuboshi-global.com/products/kiwami-ijf-uniform",
  },
] as const;

export const comparisonRows = [
  { label: "Для чего", key: "purpose" },
  { label: "В линейке", key: "level" },
  { label: "Производство", key: "origin" },
  { label: "Ткань куртки", key: "material" },
  { label: "Особенности", key: "features" },
] as const;

export const zoneManufacturerSizes =
  "00000, 0000, 000, 00, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6";

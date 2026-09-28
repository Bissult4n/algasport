import type { Category, Product, ProductSpec } from "../catalog";
import type { Locale } from ".";

type ProductCopy = {
  name?: string;
  description: string;
  detail?: string;
  availability?: string;
  badge?: string;
};

const kk: Record<string, ProductCopy> = {
  "zone-migaku": { description: "Техника пысықтауға және тұрақты жаттығуға арналған. Mitsuboshi жапон брендінің моделі.", badge: "Жаттығуға" },
  "zone-idomu": { description: "Zone жарыс моделі. Мақта мен полиэстер үйлесімі және ойластырылған пішім." },
  "zone-kiwami": { description: "Жапонияда жасалған Zone флагмандық моделі. Матаға, жағаға және қонымға ерекше көңіл бөлінген.", badge: "Жапонияда жасалған" },
  "adidas-champion-iii-green": { description: "Жасыл IJF белгісі бар Champion III. Green мата түсін емес, жапсырма түрін білдіреді." },
  "adidas-champion-iii-gold": { description: "Алтын жолақтары бар Champion III. Фотосуретте White / Gold ақ нұсқасы көрсетілген." },
  "adidas-champion-iii-red": { description: "Қызыл IJF белгісі бар Champion III. Red кимоно түсін емес, жапсырма түрін білдіреді." },
  "adidas-champion-ii": { description: "Күшейтілген тігістері бар классикалық Champion II. Дзюдоға арналған күрте мен шалбар." },
  "mizuno-white": { name: "Mizuno — ақ кимоно", description: "Дзюдоға арналған ақ Mizuno кимоносы. Yusho Japan моделіне тиесілігі мен IJF мәртебесі растауды қажет етеді.", detail: "Нақты модель атауы, IJF мәртебесі, өлшем торы және бар-жоғы нақтылануы керек. Бойыңыз бен салмағыңызды жазыңыз — мәліметтер расталғаннан кейін өлшем таңдауға көмектесеміз.", availability: "Бар-жоғы тапсырыс кезінде нақтыланады." },
  "mizuno-blue": { name: "Mizuno — көк кимоно", description: "Дзюдоға арналған көк Mizuno кимоносы. Yusho немесе Yusho Best моделіне тиесілігі мен IJF мәртебесі растауды қажет етеді.", detail: "Нақты модель атауы, IJF мәртебесі, өлшем торы және бар-жоғы нақтылануы керек. Бойыңыз бен салмағыңызды жазыңыз — мәліметтер расталғаннан кейін өлшем таңдауға көмектесеміз.", availability: "Бар-жоғы тапсырыс кезінде нақтыланады." },
  "fitline-activize": { description: "Энергия алмасуы мен зейінді қолдауға арналған B және C дәрумендері мен кофеині бар сусын.", detail: "Құрамы мен қолданылуы FitLine Kazakhstan ресми ақпаратына негізделген." },
  "fitline-restorate": { description: "Бұлшықет пен жүйке жүйесіне арналған магний, сүйек пен тіске арналған кальций бар минералды сусын.", detail: "Құрамы мен қолданылуы FitLine Kazakhstan ресми ақпаратына негізделген." },
  "fitline-basics": { description: "Жасушаларды қорғауға және иммундық жүйені қолдауға арналған тағамдық талшықтар, C және E дәрумендері мен селен.", detail: "Құрамы мен қолданылуы FitLine Kazakhstan ресми ақпаратына негізделген." },
  "fitline-powercocktail": { description: "Энергия алмасуын қолдауға арналған дәрумендер, талшықтар мен кофеині бар таңғы сусын.", detail: "Құрамы мен қолданылуы FitLine Kazakhstan ресми ақпаратына негізделген." },
  "korean-band": { name: "Кореялық жаттығу жгуты", description: "Техниканы пысықтауға арналған ұзындығы 200 см жаттығу жгуты. Екі ен нұсқасы бар.", detail: "Ұзындығы бірдей — 200 см, ені 5 см немесе 3 см. Жаттығу мақсатыңыз бен қалауыңызға сай нұсқаны таңдаңыз.", badge: "Жабдық" },
  "mizuno-black-belt": { description: "Дзюдоға арналған Mizuno қара белбеуі. Өлшемі жеке таңдалады.", detail: "Нақты модель, ені және IJF мәртебесі расталмаған. Өлшемді тапсырыс кезінде нақтылаймыз." },
  "sakura-black-belt": { description: "Дзюдоға арналған қара белбеу. Соңғы бағасы таңдалған өлшемге немесе нұсқаға байланысты.", detail: "Модельдің нақты ресми атауы, ені және IJF мәртебесі расталмаған. Өлшемі мен соңғы бағасын тапсырыс кезінде нақтылаймыз." },
};

const en: Record<string, ProductCopy> = {
  "zone-migaku": { description: "For technique work and regular training. A model from the Japanese brand Mitsuboshi.", badge: "Training" },
  "zone-idomu": { description: "A competition-focused Zone model combining cotton and polyester with a considered cut." },
  "zone-kiwami": { description: "Zone's flagship model, made in Japan with particular attention to fabric, collar and fit.", badge: "Made in Japan" },
  "adidas-champion-iii-green": { description: "Champion III with a green IJF label. Green refers to the label, not the fabric color." },
  "adidas-champion-iii-gold": { description: "Champion III with gold stripes. The photo shows the white White / Gold version." },
  "adidas-champion-iii-red": { description: "Champion III with a red IJF label. Red refers to the label, not the judogi color." },
  "adidas-champion-ii": { description: "Classic Champion II with reinforced seams. Judo jacket and trousers." },
  "mizuno-white": { name: "Mizuno — white judogi", description: "White Mizuno judogi for judo. Its identification as Yusho Japan and its IJF status require confirmation.", detail: "The exact model name, IJF status, size chart and availability require confirmation. Share your height and weight and we will help select a size once the details are verified.", availability: "Availability is confirmed when ordering." },
  "mizuno-blue": { name: "Mizuno — blue judogi", description: "Blue Mizuno judogi for judo. Its identification as Yusho or Yusho Best and its IJF status require confirmation.", detail: "The exact model name, IJF status, size chart and availability require confirmation. Share your height and weight and we will help select a size once the details are verified.", availability: "Availability is confirmed when ordering." },
  "fitline-activize": { description: "A drink with vitamins B and C plus caffeine to support energy metabolism and concentration.", detail: "Ingredients and directions follow official FitLine Kazakhstan information." },
  "fitline-restorate": { description: "A mineral drink with magnesium for muscles and the nervous system, and calcium for bones and teeth.", detail: "Ingredients and directions follow official FitLine Kazakhstan information." },
  "fitline-basics": { description: "Dietary fiber, vitamins C and E, and selenium for cell protection and normal immune function.", detail: "Ingredients and directions follow official FitLine Kazakhstan information." },
  "fitline-powercocktail": { description: "A morning drink with vitamins, fiber and caffeine to support energy metabolism.", detail: "Ingredients and directions follow official FitLine Kazakhstan information." },
  "korean-band": { name: "Korean resistance band", description: "A 200 cm training band for technique drills, available in two widths.", detail: "Both options are 200 cm long and come in 5 cm or 3 cm widths. Choose the option that suits your training needs and preferences.", badge: "Equipment" },
  "mizuno-black-belt": { description: "Mizuno black belt for judo. Size is selected individually.", detail: "The exact model, width and IJF status are not confirmed. Size will be confirmed when ordering." },
  "sakura-black-belt": { description: "Black belt for judo. The final price depends on the selected size or option.", detail: "The exact official model name, width and IJF status are not confirmed. Size and final price will be confirmed when ordering." },
};

const kkSpecs: Record<string, ProductSpec[]> = {
  "zone-migaku": [
    { key: "composition", value: "70% мақта / 30% полиэстер" },
    { key: "origin", value: "Пәкістан" },
    { key: "certification", value: "IJF сертификаты бар" },
    { key: "purpose", value: "Жаттығу және жарыс" },
    { key: "feature", value: "Бағасы мен сапасы үйлескен модель" },
  ],
  "zone-idomu": [
    { key: "composition", value: "70% мақта / 30% полиэстер" },
    { key: "origin", value: "Пәкістан" },
    { key: "certification", value: "IJF сертификаты бар" },
    { key: "purpose", value: "Қарқынды жаттығу және жарыс" },
    { key: "feature", value: "Тығыз әрі ұзақ қолдануға арналған" },
  ],
  "zone-kiwami": [
    { key: "composition", value: "77% мақта / 23% полиэстер" },
    { key: "origin", value: "Жапония" },
    { key: "certification", value: "IJF сертификаты бар" },
    { key: "purpose", value: "Жарыс / тәжірибелі дзюдошылар" },
    { key: "feature", value: "Жеңілдетілген құрылым, standing collar" },
  ],
  "adidas-champion-iii-green": [
    { key: "model", value: "Champion III Green" },
    { key: "certification", value: "IJF Green Label белгісі" },
    { key: "purpose", value: "Дзюдо" },
    { key: "feature", value: "Green мата түсін емес, белгі түрін білдіреді" },
  ],
  "adidas-champion-iii-gold": [
    { key: "model", value: "Champion III Gold" },
    { key: "purpose", value: "Дзюдо" },
    { key: "feature", value: "Алтын жолақтары бар ақ нұсқа" },
  ],
  "adidas-champion-iii-red": [
    { key: "model", value: "Champion III Red" },
    { key: "certification", value: "IJF Red Label белгісі" },
    { key: "purpose", value: "Дзюдо" },
    { key: "feature", value: "Red кимоно түсін емес, белгі түрін білдіреді" },
  ],
  "adidas-champion-ii": [
    { key: "model", value: "Champion II" },
    { key: "purpose", value: "Дзюдо" },
    { key: "feature", value: "Күрте мен шалбар, күшейтілген тігістер" },
  ],
  "mizuno-white": [
    { key: "model", value: "Модель нақтыланады" },
    { key: "certification", value: "IJF мәртебесі нақтыланады" },
    { key: "purpose", value: "Дзюдо" },
  ],
  "mizuno-blue": [
    { key: "model", value: "Модель нақтыланады" },
    { key: "certification", value: "IJF мәртебесі нақтыланады" },
    { key: "purpose", value: "Дзюдо" },
  ],
};

const enSpecs: Record<string, ProductSpec[]> = {
  "zone-migaku": [
    { key: "composition", value: "70% cotton / 30% polyester" },
    { key: "origin", value: "Pakistan" },
    { key: "certification", value: "IJF certified" },
    { key: "purpose", value: "Training and competition" },
    { key: "feature", value: "Balanced price and quality" },
  ],
  "zone-idomu": [
    { key: "composition", value: "70% cotton / 30% polyester" },
    { key: "origin", value: "Pakistan" },
    { key: "certification", value: "IJF certified" },
    { key: "purpose", value: "Intensive training and competition" },
    { key: "feature", value: "Dense, durability-focused construction" },
  ],
  "zone-kiwami": [
    { key: "composition", value: "77% cotton / 23% polyester" },
    { key: "origin", value: "Japan" },
    { key: "certification", value: "IJF certified" },
    { key: "purpose", value: "Competition / advanced judoka" },
    { key: "feature", value: "Lightweight build, standing collar" },
  ],
  "adidas-champion-iii-green": [
    { key: "model", value: "Champion III Green" },
    { key: "certification", value: "IJF Green Label marking" },
    { key: "purpose", value: "Judo" },
    { key: "feature", value: "Green refers to the label, not the fabric color" },
  ],
  "adidas-champion-iii-gold": [
    { key: "model", value: "Champion III Gold" },
    { key: "purpose", value: "Judo" },
    { key: "feature", value: "White version with gold stripes" },
  ],
  "adidas-champion-iii-red": [
    { key: "model", value: "Champion III Red" },
    { key: "certification", value: "IJF Red Label marking" },
    { key: "purpose", value: "Judo" },
    { key: "feature", value: "Red refers to the label, not the judogi color" },
  ],
  "adidas-champion-ii": [
    { key: "model", value: "Champion II" },
    { key: "purpose", value: "Judo" },
    { key: "feature", value: "Jacket and trousers with reinforced seams" },
  ],
  "mizuno-white": [
    { key: "model", value: "Model to be confirmed" },
    { key: "certification", value: "IJF status to be confirmed" },
    { key: "purpose", value: "Judo" },
  ],
  "mizuno-blue": [
    { key: "model", value: "Model to be confirmed" },
    { key: "certification", value: "IJF status to be confirmed" },
    { key: "purpose", value: "Judo" },
  ],
};

const variantLabels: Record<Locale, Record<string, string>> = {
  ru: {},
  kk: {
    "Цвет уточнить": "Түсі нақтыланады", "Белый": "Ақ", "Синий": "Көк",
    "Цвет по фото / уточнить": "Түсі фотодағыдай / нақтыланады",
    "Белый / золотые детали": "Ақ / алтын түсті бөлшектер",
    "Черная смородина": "Қара қарақат", "Citrus / апельсин-лимон": "Citrus / апельсин-лимон",
    "Апельсин": "Апельсин", "Апельсин-черная смородина": "Апельсин-қара қарақат",
    "Ширина": "Ені", "Цвет": "Түсі", "Черный": "Қара",
  },
  en: {
    "Цвет уточнить": "Color to be confirmed", "Белый": "White", "Синий": "Blue",
    "Цвет по фото / уточнить": "Color as pictured / to be confirmed",
    "Белый / золотые детали": "White / gold details",
    "Черная смородина": "Blackcurrant", "Citrus / апельсин-лимон": "Citrus / orange-lemon",
    "Апельсин": "Orange", "Апельсин-черная смородина": "Orange-blackcurrant",
    "Ширина": "Width", "Цвет": "Color", "Черный": "Black",
  },
};

const categoryCopy: Record<Locale, Record<Category, { name: string; caption: string }>> = {
  ru: {
    kimono: { name: "Кимоно", caption: "Для вашего пути в дзюдо" },
    vitamins: { name: "Витамины", caption: "Линия FitLine" },
    equipment: { name: "Снаряжение", caption: "Для работы на татами" },
  },
  kk: {
    kimono: { name: "Кимоно", caption: "Дзюдодағы жолыңызға" },
    vitamins: { name: "Қоспалар", caption: "FitLine желісі" },
    equipment: { name: "Жабдық", caption: "Татамидегі жаттығуға" },
  },
  en: {
    kimono: { name: "Judogi", caption: "For your judo journey" },
    vitamins: { name: "Supplements", caption: "FitLine range" },
    equipment: { name: "Equipment", caption: "For work on the tatami" },
  },
};

export function localizedProduct(product: Product, locale: Locale): Product {
  if (locale === "ru") return product;
  const copy = (locale === "kk" ? kk : en)[product.id];
  const specs = (locale === "kk" ? kkSpecs : enSpecs)[product.id];
  return copy || specs ? { ...product, ...copy, ...(specs ? { specs } : {}) } : product;
}

export const localizedVariant = (value: string, locale: Locale) =>
  variantLabels[locale][value] || value;

export const localizedVariantLabel = (value: string | undefined, locale: Locale) =>
  value ? variantLabels[locale][value] || value : undefined;

export const localizedCategory = (category: Category, locale: Locale) =>
  categoryCopy[locale][category];

export type Category = "kimono" | "vitamins" | "equipment";
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  detail: string;
  price: number | null;
  images: string[];
  variants: string[];
  availability?: string;
  badge?: string;
  featured?: boolean;
  source?: string;
};
export const categories: { id: Category; name: string; caption: string }[] = [
  { id: "kimono", name: "Кимоно", caption: "Для вашего пути в дзюдо" },
  { id: "vitamins", name: "Витамины", caption: "Линия FitLine" },
  { id: "equipment", name: "Снаряжение", caption: "Для работы на татами" },
];
const kimono = {
  category: "kimono" as const,
  price: null,
  variants: ["Уточнить цвет", "Белый", "Синий"],
  detail:
    "Размер, посадку и наличие уточним в переписке. Укажите ваш размер или рост в сантиметрах. Финальный макет персонализации согласуем перед изготовлением.",
};
const zone = (
  id: string,
  name: string,
  description: string,
  count: number,
): Product => ({
  ...kimono,
  id: "zone-" + id,
  name: "Zone " + name,
  brand: "ZONE / MITSUBOSHI",
  description,
  images: Array.from(
    { length: count },
    (_, i) => "/images/kimono/zone-" + id + "-" + i + ".webp",
  ),
  source: "https://zone.mitsuboshi-global.com/products/" + id + "-ijf-uniform",
});
export const products: Product[] = [
  {
    ...zone(
      "migaku",
      "Migaku",
      "Для отработки техники и регулярных тренировок. Модель японского бренда Mitsuboshi.",
      3,
    ),
    badge: "Для тренировок",
    featured: true,
  },
  zone(
    "idomu",
    "Idomu",
    "Соревновательная модель Zone. Сочетание хлопка и полиэстера, продуманный крой.",
    3,
  ),
  {
    ...zone(
      "kiwami",
      "Kiwami",
      "Флагман Zone, произведенный в Японии. Особое внимание ткани, вороту и посадке.",
      4,
    ),
    badge: "Made in Japan",
    featured: true,
  },
  {
    ...kimono,
    id: "adidas-champion-iii-green",
    name: "Adidas Champion III Green",
    brand: "ADIDAS",
    badge: "Green Label",
    featured: true,
    description:
      "Champion III с зеленой маркировкой IJF. Green обозначает этикетку, а не цвет ткани.",
    images: [
      "/images/kimono/adidas-green-0.webp",
      "/images/kimono/adidas-green-1.webp",
    ],
    source:
      "https://imssport.pl/pl/p/Judoga-Adidas-Champion-III-2-IJF-GREEN-LABEL/986",
  },
  {
    ...kimono,
    id: "adidas-champion-iii-gold",
    name: "Adidas Champion III Gold",
    brand: "ADIDAS",
    badge: "Gold details",
    description:
      "Модель Champion III с золотыми полосами. На фото белый вариант White / Gold.",
    images: [0, 1, 2].map((i) => "/images/kimono/adidas-gold-" + i + ".webp"),
    source:
      "https://www.roninwear.com/en/adidas-champion-iii-ijf-judogi-white-gold-p-22047.html",
  },
  {
    ...kimono,
    id: "adidas-champion-iii-red",
    name: "Adidas Champion III Red",
    brand: "ADIDAS",
    badge: "Red Label",
    description:
      "Champion III с красной маркировкой IJF. Red обозначает этикетку, а не цвет кимоно.",
    images: ["/images/kimono/adidas-red-0.webp"],
    source:
      "https://gi-obi.com/urun/adidas-champion-iii-red-ijf-onayli-judo-gi/",
  },
  {
    ...kimono,
    id: "adidas-champion-ii",
    name: "Adidas Champion II",
    brand: "ADIDAS",
    description:
      "Классическая модель Champion II с усиленными швами. Куртка и брюки для дзюдо.",
    images: [
      "/images/kimono/adidas-ii-0.webp",
      "/images/kimono/adidas-ii-back.webp",
      "/images/kimono/adidas-ii-detail.webp",
    ],
    source:
      "https://imssport.pl/pl/p/Judoga-Adidas-Champion-II-IJF-APPROVED/343",
  },
  ...[
    [
      "activize",
      "Activize",
      "Витамины B и C с кофеином для поддержки энергетического обмена и концентрации.",
      "Черная смородина",
      "0708054",
    ],
    [
      "restorate",
      "Restorate",
      "Минеральный напиток: магний для мышц и нервной системы, кальций для костей и зубов.",
      "Citrus / апельсин-лимон",
      "0702037",
    ],
    [
      "basics",
      "Basics",
      "Пищевые волокна, витамины C, E и селен для защиты клеток и поддержки иммунной системы.",
      "Апельсин",
      "0705066",
    ],
    [
      "powercocktail",
      "PowerCocktail",
      "Утренний напиток с витаминами, волокнами и кофеином для поддержки энергетического обмена.",
      "Апельсин-черная смородина",
      "0705067",
    ],
  ].map(
    ([id, name, description, variant, code]): Product => ({
      id: "fitline-" + id,
      name: "FitLine " + name,
      brand: "FITLINE",
      category: "vitamins",
      price: null,
      images: ["/images/fitline/" + id + ".webp"],
      variants: [variant],
      description,
      detail:
        "Состав и применение по официальной информации FitLine Kazakhstan.",
      source: "https://www.fitline.com/kz/ru-ru/products/" + code,
      featured: id === "powercocktail",
    }),
  ),
  {
    id: "korean-band",
    name: "Корейский жгут",
    brand: "TRAINING EQUIPMENT",
    category: "equipment",
    price: null,
    images: [],
    variants: ["Уточнить вариант"],
    badge: "Снаряжение",
    description:
      "Тренировочный жгут для работы над техникой. Длину и сопротивление уточним при заказе.",
    detail:
      "Точная модель и фотография ожидают подтверждения магазина. Поможем подобрать подходящий вариант.",
  },
];
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const categoryName = (id: Category) =>
  categories.find((c) => c.id === id)!.name;

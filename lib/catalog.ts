export type Category = "kimono" | "vitamins" | "equipment";
export type PriceRange = { min: number; max: number };
export type Price = number | PriceRange | null;
export type ProductSpecKey =
  | "composition"
  | "origin"
  | "certification"
  | "purpose"
  | "feature"
  | "model";
export type ProductSpec = { key: ProductSpecKey; value: string };
export type ProductVariantSelection = { label?: string; value: string };
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  detail: string;
  price: Price;
  variantPrices?: Record<string, Price>;
  images: string[];
  variants: string[];
  variantLabel?: string;
  variantImages?: Record<string, string[]>;
  variantSwatches?: Record<string, string>;
  variantAttributes?: Record<string, Record<string, string>>;
  variantOptionSwatches?: Record<string, Record<string, string>>;
  availability?: string;
  badge?: string;
  featured?: boolean;
  source?: string;
  specs?: ProductSpec[];
  sizeField?: "belt";
};
export const categories: { id: Category; name: string; caption: string }[] = [
  { id: "kimono", name: "Кимоно", caption: "Для вашего пути в дзюдо" },
  { id: "vitamins", name: "Витамины", caption: "Линия FitLine" },
  { id: "equipment", name: "Снаряжение", caption: "Для работы на татами" },
];
const kimono = {
  category: "kimono" as const,
  price: null,
  variants: ["Цвет уточнить"],
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
  images: [
    "/images/products/zone/zone-" + id + "-white-main.webp",
    ...Array.from({ length: count }, (_, i) =>
      "/images/kimono/zone-" + id + "-" + i + ".webp"
    ),
  ],
  variants: ["Белый", "Синий"],
  variantSwatches: { Белый: "#f1f0eb", Синий: "#15529b" },
  variantImages: {
    Белый: [
      "/images/products/zone/zone-" + id + "-white-main.webp",
      "/images/kimono/zone-" + id + "-0.webp",
      ...(id === "kiwami"
        ? [
            "/images/kimono/zone-kiwami-2.webp",
            "/images/kimono/zone-kiwami-3.webp",
          ]
        : ["/images/kimono/zone-" + id + "-2.webp"]),
    ],
    Синий: [
      "/images/products/zone/zone-" + id + "-blue-main.webp",
      "/images/kimono/zone-" + id + "-1.webp",
    ],
  },
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
    price: 85000,
    specs: [
      { key: "composition", value: "70% хлопок / 30% полиэстер" },
      { key: "origin", value: "Япония" },
      { key: "certification", value: "Сертифицировано IJF" },
      { key: "purpose", value: "Тренировки и соревнования" },
      { key: "feature", value: "Баланс цены и качества" },
    ],
  },
  {
    ...zone(
      "idomu",
      "Idomu",
      "Соревновательная модель Zone. Сочетание хлопка и полиэстера, продуманный крой.",
      3,
    ),
    price: 100000,
    specs: [
      { key: "composition", value: "70% хлопок / 30% полиэстер" },
      { key: "origin", value: "Япония" },
      { key: "certification", value: "Сертифицировано IJF" },
      { key: "purpose", value: "Интенсивные тренировки и соревнования" },
      { key: "feature", value: "Плотное и долговечное исполнение" },
    ],
  },
  {
    ...zone(
      "kiwami",
      "Kiwami",
      "Флагман Zone, произведенный в Японии. Особое внимание ткани, вороту и посадке.",
      4,
    ),
    badge: "Made in Japan",
    featured: true,
    price: 140000,
    specs: [
      { key: "composition", value: "77% хлопок / 23% полиэстер" },
      { key: "origin", value: "Япония" },
      { key: "certification", value: "Сертифицировано IJF" },
      { key: "purpose", value: "Соревнования / продвинутые дзюдоисты" },
      { key: "feature", value: "Облегчённая конструкция, standing collar" },
    ],
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
      "/images/products/adidas/champion-iii-green/main.png",
      "/images/products/adidas/champion-iii-green/front.png",
      "/images/products/adidas/champion-iii-green/back.png",
    ],
    source:
      "https://imssport.pl/pl/p/Judoga-Adidas-Champion-III-2-IJF-GREEN-LABEL/986",
    variants: ["Цвет по фото / уточнить"],
    specs: [
      { key: "model", value: "Champion III Green" },
      { key: "certification", value: "Маркировка IJF Green Label" },
      { key: "purpose", value: "Дзюдо" },
      { key: "feature", value: "Green обозначает маркировку, не цвет ткани" },
    ],
  },
  {
    ...kimono,
    id: "adidas-champion-iii-gold",
    name: "Adidas Champion III Gold",
    brand: "ADIDAS",
    badge: "Gold details",
    description:
      "Модель Champion III с золотыми полосами. На фото белый вариант White / Gold.",
    images: [
      "/images/products/adidas/champion-iii-gold/main.png",
      "/images/products/adidas/champion-iii-gold/shoulder-detail.png",
      "/images/products/adidas/champion-iii-gold/ijf-label-detail.png",
      "/images/products/adidas/champion-iii-gold/pants-logo-detail.png",
    ],
    source:
      "https://www.roninwear.com/en/adidas-champion-iii-ijf-judogi-white-gold-p-22047.html",
    variants: ["Белый / золотые детали"],
    specs: [
      { key: "model", value: "Champion III Gold" },
      { key: "purpose", value: "Дзюдо" },
      { key: "feature", value: "Белая версия с золотыми полосами" },
    ],
  },
  {
    ...kimono,
    id: "adidas-champion-iii-red",
    name: "Adidas Champion III Red",
    brand: "ADIDAS",
    badge: "Red Label",
    description:
      "Champion III с красной маркировкой IJF. Red обозначает этикетку, а не цвет кимоно.",
    images: [
      "/images/products/adidas/champion-iii-red/main.png",
      "/images/products/adidas/champion-iii-red/angle.png",
      "/images/products/adidas/champion-iii-red/back.png",
      "/images/products/adidas/champion-iii-red/jacket-detail.png",
      "/images/products/adidas/champion-iii-red/folded-set.png",
      "/images/products/adidas/champion-iii-red/shoulder-detail.png",
    ],
    source:
      "https://gi-obi.com/urun/adidas-champion-iii-red-ijf-onayli-judo-gi/",
    variants: ["Цвет по фото / уточнить"],
    specs: [
      { key: "model", value: "Champion III Red" },
      { key: "certification", value: "Маркировка IJF Red Label" },
      { key: "purpose", value: "Дзюдо" },
      { key: "feature", value: "Red обозначает маркировку, не цвет ткани" },
    ],
  },
  {
    ...kimono,
    id: "adidas-champion-ii",
    name: "Adidas Champion II",
    brand: "ADIDAS",
    description:
      "Классическая модель Champion II с усиленными швами. Куртка и брюки для дзюдо.",
    images: [
      "/images/products/adidas/champion-ii/white.png",
    ],
    variantImages: {
      Белый: ["/images/products/adidas/champion-ii/white.png"],
      Синий: ["/images/products/adidas/champion-ii/blue.png"],
    },
    variantSwatches: { Белый: "#f1f0eb", Синий: "#15529b" },
    source:
      "https://imssport.pl/pl/p/Judoga-Adidas-Champion-II-IJF-APPROVED/343",
    variants: ["Белый", "Синий"],
    specs: [
      { key: "model", value: "Champion II" },
      { key: "purpose", value: "Дзюдо" },
      { key: "feature", value: "Куртка и брюки, усиленные швы" },
    ],
  },
  {
    ...kimono,
    id: "mizuno-judogi",
    name: "Mizuno — кимоно",
    brand: "Mizuno",
    description:
      "Кимоно Mizuno для дзюдо в белом и синем цветах. Точная модель и IJF-статус требуют подтверждения.",
    detail:
      "Доступны белый и синий цвета, а также лицензионная и оригинальная версии. Принадлежность к линейке Yusho / Yusho Best, IJF-статус, размерная сетка и наличие требуют подтверждения.",
    price: 75000,
    images: ["/images/products/mizuno/mizuno-white.png"],
    variants: [
      "white-licensed",
      "white-original",
      "blue-licensed",
      "blue-original",
    ],
    variantAttributes: {
      "white-licensed": { Цвет: "Белый", Версия: "Лицензионный" },
      "white-original": { Цвет: "Белый", Версия: "Оригинал" },
      "blue-licensed": { Цвет: "Синий", Версия: "Лицензионный" },
      "blue-original": { Цвет: "Синий", Версия: "Оригинал" },
    },
    variantOptionSwatches: {
      Цвет: { Белый: "#f1f0eb", Синий: "#15529b" },
    },
    variantImages: {
      "white-licensed": ["/images/products/mizuno/mizuno-white.png"],
      "white-original": ["/images/products/mizuno/mizuno-white.png"],
      "blue-licensed": ["/images/products/mizuno/mizuno-blue.png"],
      "blue-original": ["/images/products/mizuno/mizuno-blue.png"],
    },
    variantPrices: {
      "white-licensed": 75000,
      "white-original": 175000,
      "blue-licensed": 75000,
      "blue-original": 175000,
    },
    availability: "Наличие уточняется при заказе.",
    specs: [
      { key: "model", value: "Модель уточняется" },
      { key: "certification", value: "IJF-статус уточняется" },
      { key: "purpose", value: "Дзюдо" },
    ],
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
      images: [
        "/images/products/fitline/fitline-" + id + "-main.webp",
        "/images/fitline/" + id + ".webp",
      ],
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
    images: [
      "/images/products/equipment/korean-band/main.png",
      "/images/products/equipment/korean-band/rolled.png",
      "/images/products/equipment/korean-band/folded.png",
    ],
    variants: ["5 см × 200 см", "3 см × 200 см"],
    variantLabel: "Ширина",
    badge: "Снаряжение",
    description:
      "Тренировочный жгут длиной 200 см для работы над техникой. Доступен в двух вариантах ширины.",
    detail:
      "Доступны две ширины: 5 см и 3 см при одинаковой длине 200 см. Выберите подходящий вариант для ваших предпочтений и тренировочных задач.",
  },
  {
    id: "mizuno-black-belt",
    name: "Mizuno Black Belt",
    brand: "Mizuno",
    category: "equipment",
    price: 25000,
    images: ["/images/products/equipment/black-belts/mizuno-black-belt.png"],
    variants: ["Черный"],
    variantLabel: "Цвет",
    variantSwatches: { Черный: "#151617" },
    sizeField: "belt",
    badge: "Black Belt",
    description: "Чёрный пояс Mizuno для дзюдо. Размер подбирается индивидуально.",
    detail:
      "Точная модель, ширина и IJF-статус не подтверждены. Размер уточним при заказе.",
  },
  {
    id: "sakura-black-belt",
    name: "Sakura Black Belt",
    brand: "Sakura",
    category: "equipment",
    price: { min: 25000, max: 30000 },
    images: ["/images/products/equipment/black-belts/sakura-black-belt.png"],
    variants: ["Черный"],
    variantLabel: "Цвет",
    variantSwatches: { Черный: "#151617" },
    sizeField: "belt",
    badge: "Black Belt",
    description:
      "Чёрный пояс для дзюдо. Итоговая стоимость зависит от выбранного размера/варианта.",
    detail:
      "Точное официальное название модели, ширина и IJF-статус не подтверждены. Размер и итоговую стоимость уточним при заказе.",
  },
];
const productAliases: Record<string, string> = {
  "mizuno-white": "mizuno-judogi",
  "mizuno-blue": "mizuno-judogi",
};
export const getProduct = (id: string) =>
  products.find((p) => p.id === (productAliases[id] || id));
export const productImages = (product: Product, variant?: string) =>
  (variant && product.variantImages?.[variant]) || product.images;
export const productPrice = (product: Product, variant?: string): Price => {
  if (
    variant &&
    product.variantPrices &&
    Object.prototype.hasOwnProperty.call(product.variantPrices, variant)
  )
    return product.variantPrices[variant];
  return product.price;
};
export const productVariantSelections = (
  product: Product,
  variant: string,
): ProductVariantSelection[] => {
  const attributes = product.variantAttributes?.[variant];
  if (attributes)
    return Object.entries(attributes).map(([label, value]) => ({ label, value }));
  return [{ label: product.variantLabel, value: variant }];
};
export const productVariantGroups = (product: Product) => {
  const groups = new Map<string, string[]>();
  for (const variant of product.variants) {
    for (const [label, value] of Object.entries(
      product.variantAttributes?.[variant] || {},
    )) {
      const values = groups.get(label) || [];
      if (!values.includes(value)) values.push(value);
      groups.set(label, values);
    }
  }
  return [...groups].map(([label, values]) => ({ label, values }));
};
export const productVariantWithOption = (
  product: Product,
  currentVariant: string,
  label: string,
  value: string,
) => {
  const current = product.variantAttributes?.[currentVariant];
  if (!current) return currentVariant;
  return product.variants.find((variant) => {
    const candidate = product.variantAttributes?.[variant];
    return candidate &&
      candidate[label] === value &&
      Object.entries(current).every(
        ([key, currentValue]) => key === label || candidate[key] === currentValue,
      );
  }) || currentVariant;
};
export const normalizeProductVariant = (
  productId: string,
  variant: unknown,
): string | null => {
  const product = getProduct(productId);
  if (!product) return null;
  if (
    product.id === "mizuno-judogi" &&
    (productId === "mizuno-white" || productId === "mizuno-blue") &&
    typeof variant !== "string"
  )
    return productId === "mizuno-blue" ? "blue-licensed" : "white-licensed";
  if (typeof variant !== "string") return null;
  if (product.variants.includes(variant)) return variant;
  if (product.id === "mizuno-judogi") {
    const color = productId === "mizuno-blue" ? "blue" : "white";
    if (variant === "Лицензионный" || variant === "Белый" || variant === "Синий")
      return `${color}-licensed`;
    if (variant === "Оригинал") return `${color}-original`;
  }
  return null;
};
export const categoryName = (id: Category) =>
  categories.find((c) => c.id === id)!.name;
export const productHasSize = (product: Product) =>
  product.category === "kimono" || product.sizeField === "belt";

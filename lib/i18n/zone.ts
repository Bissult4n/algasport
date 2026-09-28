import { zoneModels } from "@/lib/zone-comparison";
import type { Locale } from ".";

type ZoneCopy = {
  label: string;
  summary: string;
  purpose: string;
  level: string;
  origin: string;
  material: string;
  features: string;
  advice: string;
};

const kk: Record<string, ZoneCopy> = {
  "zone-migaku": {
    label: "Техника және күнделікті жаттығу",
    summary: "Техниканы пысықтауға арналған қолайлы модель: жұмсақ мата және еркін қозғалыс.",
    purpose: "Жаттығу және техниканы дамыту",
    level: "Қолайлылыққа басымдық",
    origin: "Пәкістан",
    material: "70% мақта · 30% полиэстер",
    features: "Тігіс арасы кең; матасы тегіс әрі жұмсақ.",
    advice: "Негізгі мақсатыңыз жаттығу және техниканы пысықтау болса, Migaku моделінен бастаңыз.",
  },
  "zone-idomu": {
    label: "Қарқынды жаттығу және жарыс",
    summary: "Қарқынды жаттығу мен жарысқа арналған, беріктікке басымдық берілген модель.",
    purpose: "Қарқынды жаттығу және жарыс",
    level: "Беріктікке басымдық",
    origin: "Пәкістан",
    material: "70% мақта · 30% полиэстер",
    features: "Тығыз тігіс; өндіруші қарқынды қолданудағы беріктікке назар аударады.",
    advice: "Қарқынды жаттығып, жарыстарға тұрақты қатыссаңыз, Idomu моделін қарастырыңыз.",
  },
  "zone-kiwami": {
    label: "Жапонияда жасалған флагман",
    summary: "Ерекше мата өрімі мен жаға құрылымы бар Zone жоғарғы моделі.",
    purpose: "Жарыс және жоғары талапты жаттығу",
    level: "Желінің флагманы",
    origin: "Жапония",
    material: "77% мақта · 23% полиэстер",
    features: "Негізі мақта, арқауында полиэстер бар. Тік жаға және иық аймағын тігудің арнайы технологиясы.",
    advice: "Жапонияда жасалғаны және мата мен жаға ерекшеліктері маңызды болса, Kiwami моделін қарастырыңыз.",
  },
};

const en: Record<string, ZoneCopy> = {
  "zone-migaku": {
    label: "Technique and daily practice",
    summary: "A practical model for technique work, with soft fabric and freedom of movement.",
    purpose: "Training and technique development",
    level: "Practicality focused",
    origin: "Pakistan",
    material: "70% cotton · 30% polyester",
    features: "Wide stitch spacing; smooth, soft fabric texture.",
    advice: "If training and technique work are your main goals, start by considering Migaku.",
  },
  "zone-idomu": {
    label: "Intensive training and competition",
    summary: "A durability-focused model for intensive work and competition.",
    purpose: "Intensive training and competition",
    level: "Durability focused",
    origin: "Pakistan",
    material: "70% cotton · 30% polyester",
    features: "Dense stitching; the manufacturer emphasizes durability under intensive use.",
    advice: "For intensive training and regular competition, consider Idomu.",
  },
  "zone-kiwami": {
    label: "Flagship made in Japan",
    summary: "Zone's top model with a distinctive fabric weave and collar construction.",
    purpose: "Competition and demanding practice",
    level: "Range flagship",
    origin: "Japan",
    material: "77% cotton · 23% polyester",
    features: "Cotton base with polyester in the weft, a standing collar and dedicated shoulder construction.",
    advice: "If Japanese production and the fabric and collar construction matter most, consider Kiwami.",
  },
};

export const localizedZoneModels = (locale: Locale) =>
  zoneModels.map((model) =>
    locale === "ru" ? model : { ...model, ...(locale === "kk" ? kk : en)[model.id] },
  );

export const comparisonRowsFor = (locale: Locale) => {
  const labels = {
    ru: ["Для чего", "В линейке", "Производство", "Ткань куртки", "Особенности"],
    kk: ["Мақсаты", "Желідегі орны", "Өндірілген жері", "Күрте матасы", "Ерекшеліктері"],
    en: ["Best for", "Position in range", "Made in", "Jacket fabric", "Features"],
  }[locale];
  return (["purpose", "level", "origin", "material", "features"] as const).map(
    (key, index) => ({ key, label: labels[index] }),
  );
};

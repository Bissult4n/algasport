import { fitlineDetails, type FitLineDetails } from "@/lib/fitline-details";
import type { Locale } from ".";

const enCommon = {
  consult: "Consult a physician before use.",
  contraindications: "Contraindications: intolerance to ingredients, pregnancy and breastfeeding.",
  caffeine: "Not recommended with increased nervous excitability, insomnia, high blood pressure, cardiac rhythm disorders or severe atherosclerosis.",
};

const en: Record<string, FitLineDetails> = {
  "fitline-activize": {
    name: "Activize",
    reference: "Oxyplus · Blackcurrant",
    purpose: "A caffeinated vitamin drink for an active day. It contains B vitamins, vitamin C and plant extracts and is positioned to support energy metabolism and concentration.",
    facts: [
      { value: "Energy metabolism", label: "Vitamin B6" },
      { value: "Concentration", label: "Vitamins B6, B12 and C" },
      { value: "Contains caffeine", label: "Guarana extract" },
    ],
    audience: "For adults with an active lifestyle who value energy and focus during the day. Suitable for those choosing a caffeinated vitamin drink; FitLine places Activize in its Fitness range.",
    properties: [
      "Vitamin B6 contributes to normal energy-yielding metabolism.",
      "Vitamins B6, B12 and C support normal psychological function; the manufacturer associates these nutrients with the product's concentration positioning.",
      "Contains caffeine and extracts of guarana, green tea, turmeric and ginger.",
    ],
    usage: {
      portion: "1 scoop · 1.67 g",
      water: "40–50 ml",
      frequency: "2–3 times daily",
      instructions: [
        "Mix 1 measuring scoop of powder (1.67 g) with 40–50 ml of water.",
        "Adults take one serving 2–3 times daily after meals. Do not take in the evening.",
      ],
    },
    components: ["Vitamin C", "Vitamins B1, B2, B3, B5, B6, B9, B12 and biotin", "Caffeine and guarana", "Seaweed", "Green tea, turmeric and ginger"],
    nutrition: {
      caption: "Daily content for 2 or 3 servings, as listed in the manufacturer's table.",
      columns: ["2 servings", "3 servings"],
      rows: [
        ["Vitamin C", "60 mg", "90 mg"], ["B1", "1.4 mg", "2.1 mg"], ["B2", "1.6 mg", "2.4 mg"],
        ["B3 (niacin)", "20 mg", "30 mg"], ["B5", "6 mg", "9 mg"], ["B6", "1.9 mg", "2.9 mg"],
        ["B9", "250 µg", "375 µg"], ["B12", "1.34 µg", "2 µg"], ["Biotin", "40 µg", "60 µg"],
        ["Caffeine", "20 mg", "30 mg"],
      ],
    },
    ingredients: "Dextrose; guarana extract powder (maltodextrin, caffeine, guarana extract); citric acid; beetroot powder (beetroot juice concentrate, maltodextrin, citric acid); natural flavoring; L-ascorbic acid (vitamin C); niacin (B3); steviol glycosides; calcium D-pantothenate (B5); seaweed powder; pyridoxine hydrochloride (B6); thiamine hydrochloride (B1); riboflavin (B2); cyanocobalamin (B12); turmeric extract with β-cyclodextrin; green tea extract; ginger extract powder; folic acid (B9); D-biotin.",
    features: ["Vegan", "Gluten-free", "Lactose-free"],
    warnings: ["Contains caffeine. For adults; do not take in the evening.", enCommon.contraindications, enCommon.caffeine, enCommon.consult],
    difference: "Activize combines vitamins B and C with caffeine in a small serving. Basics focuses on fiber and cell protection, PowerCocktail combines fiber and caffeine, and Restorate supplies minerals.",
    sources: [
      { title: "FitLine Kazakhstan · Activize Oxyplus", url: "https://www.fitline.com/kz/ru-ru/products/0708054" },
      { title: "Manufacturer nutrition table", url: "https://cdn.brandfolder.io/CN4BR5TK/at/jjc9qp6btkgmj6m8zcnx8gc/RU_Activize_Oxyplus.png" },
    ],
  },
  "fitline-restorate": {
    name: "Restorate",
    reference: "Citrus · Orange-lemon",
    purpose: "A mineral drink formulated to support normal muscle and nervous system function, bones and teeth. The formula is based on calcium, magnesium, trace elements and vitamin D3.",
    facts: [
      { value: "Muscles and nerves", label: "Magnesium" },
      { value: "Bones and teeth", label: "Calcium and magnesium" },
      { value: "Skin and hair", label: "Zinc" },
    ],
    audience: "For adults who want to supplement their diet with minerals and support normal muscle function and the condition of bones and teeth. Convenient for those who prefer a drink format.",
    properties: [
      "Magnesium contributes to normal muscle and nervous system function.",
      "Calcium, magnesium and manganese contribute to the maintenance of normal bones; calcium and magnesium are also important for normal teeth.",
      "Zinc contributes to the maintenance of normal skin, hair and nails.",
    ],
    usage: {
      portion: "1 sachet · 6.7 g",
      water: "100 ml",
      frequency: "Once daily",
      instructions: [
        "Dissolve 1 sachet (6.7 g), or 1 teaspoon (6.7 g), in 100 ml of room-temperature water.",
        "Adults take once daily with a meal. Recommended course: 1 month.",
      ],
    },
    components: ["Calcium and magnesium", "Vitamin D3", "Zinc and iron", "Selenium, copper, manganese and chromium"],
    nutrition: {
      caption: "Per serving · 6.7 g.",
      columns: ["Amount"],
      rows: [
        ["Calcium", "268 mg"], ["Magnesium", "134 mg"], ["Vitamin D3", "7.5 µg"], ["Zinc", "10 mg"],
        ["Iron", "4.7 mg"], ["Selenium", "16.8 µg"], ["Copper", "0.67 mg"], ["Manganese", "1 mg"], ["Chromium", "0.06 mg"],
      ],
    },
    ingredients: "Fructose; citric acid (E330); calcium carbonate; magnesium carbonate; calcium lactate; tripotassium citrate monohydrate; natural flavoring with lime and orange extracts; trimagnesium citrate; zinc gluconate; beta-carotene (E160a); steviol glycosides (E960) with orange peel extract; iron citrate; manganese gluconate; copper gluconate; vitamin D3 preparation; chromium picolinate; sodium selenite.",
    features: ["Gluten-free", "No preservatives"],
    warnings: [enCommon.contraindications, enCommon.consult],
    difference: "Restorate focuses on minerals and vitamin D3. Activize emphasizes vitamins B and C with caffeine, while Basics and PowerCocktail also contain dietary fiber.",
    sources: [
      { title: "FitLine Kazakhstan · Restorate Citrus", url: "https://www.fitline.com/kz/ru-ru/products/0702037" },
      { title: "Manufacturer nutrition table", url: "https://cdn.brandfolder.io/CN4BR5TK/at/vgnmhvqf3454f87v3f3sss/RU_Restorate_Citrus.png" },
    ],
  },
  "fitline-basics": {
    name: "Basics",
    reference: "Orange",
    purpose: "A daily drink with dietary fiber, vitamins and selenium, intended to complement the diet and support natural cell protection and normal immune function.",
    facts: [
      { value: "Cell protection", label: "Vitamins C and E, selenium" },
      { value: "Immune function", label: "Vitamin C and selenium" },
      { value: "Dietary fiber", label: "Oat, pea and apple" },
    ],
    audience: "For adults looking for a daily drink with vitamins and dietary fiber, including vitamins C and E and selenium for normal immune function and cell protection.",
    properties: [
      "Selenium and vitamins C and E contribute to the protection of cells from oxidative stress.",
      "Selenium and vitamin C support normal immune system function.",
      "Contains dietary fiber, inulin and the lactic acid cultures Lactobacillus acidophilus and Lactobacillus reuteri.",
    ],
    usage: {
      portion: "12 g powder",
      water: "180 ml",
      frequency: "Once daily",
      instructions: ["Dissolve 12 g of powder in 180 ml of water. Adults take once daily.", "Do not exceed the recommended daily dose."],
    },
    components: ["Vitamins C and E, and beta-carotene (provitamin A)", "Selenium", "Oat, pea, apple and rice fiber; inulin", "Lactobacillus acidophilus and Lactobacillus reuteri", "Enzymes, acerola, vegetables and plant extracts"],
    ingredients: "Fructose; gum arabic (E414); oat and pea fiber; guar gum (E412); pectin (E440); citric acid (E330); acerola extract powder with vitamin C; flavoring; apple fiber; vegetable powder (broccoli, cabbage, carrot, pepper, spinach and tomato); multi-enzyme complex; vitamin C; inulin; rice fiber; steviol glycosides; lactic acid bacteria; turmeric extract; selenium-enriched yeast; green tea extract; vitamin E; beta-carotene; grape-seed extract.",
    features: ["Vegan", "Gluten-free", "Lactose-free"],
    warnings: [enCommon.contraindications, "A supplement does not replace a varied, balanced diet and a healthy lifestyle.", enCommon.consult],
    difference: "Basics focuses on dietary fiber, vitamins C and E, and selenium. PowerCocktail combines fiber with caffeine and B vitamins; Activize is a caffeinated vitamin drink in small servings; Restorate supplies minerals and D3.",
    sources: [{ title: "FitLine Kazakhstan · Basics", url: "https://www.fitline.com/kz/ru-ru/products/0705066" }],
  },
  "fitline-powercocktail": {
    name: "PowerCocktail",
    reference: "Orange-blackcurrant",
    purpose: "A morning drink combining vitamins, dietary fiber, caffeine and plant extracts. It is positioned to support energy metabolism, concentration and normal immune function.",
    facts: [
      { value: "Energy metabolism", label: "Vitamin B6" },
      { value: "Immune function", label: "Vitamin C" },
      { value: "15 mg caffeine", label: "Per 7.5 g serving" },
    ],
    audience: "For adults with a busy routine who prefer vitamins and dietary fiber in one morning drink. Suitable for those choosing a multi-component caffeinated product taken before breakfast.",
    properties: [
      "Vitamin B6 contributes to normal energy-yielding metabolism.",
      "Vitamins B6, B12 and C support normal psychological function; the manufacturer associates the product with concentration support.",
      "Vitamin C contributes to normal immune system function.",
      "Contains soluble dietary fiber, inulin, lactic acid cultures and digestive enzymes.",
    ],
    usage: {
      portion: "½ sachet · 7.5 g",
      water: "100 ml",
      frequency: "Once daily",
      instructions: [
        "Mix half a sachet (7.5 g) with 100 ml of water. Adults take once daily before breakfast.",
        "The label recommends a 2–3 week course. If needed, the course may be repeated after one month.",
      ],
    },
    components: ["Vitamins C, E and B group; beta-carotene", "Selenium", "Caffeine and guarana", "Soluble dietary fiber and inulin", "Lactobacillus acidophilus and Lactobacillus reuteri", "Digestive enzymes and berry, vegetable, herb and spice extracts"],
    nutrition: {
      caption: "Per daily serving · ½ sachet, 7.5 g.",
      columns: ["Amount"],
      rows: [
        ["Vitamin C", "75 mg"], ["Vitamin E", "5 mg"], ["B1", "1.05 mg"], ["B2", "1.2 mg"], ["B3 (niacin)", "25.5 mg"],
        ["B5", "4.5 mg"], ["B6", "1.5 mg"], ["B9 (folic acid)", "150 µg"], ["B12", "0.75 µg"], ["Biotin", "112.5 µg"],
        ["Selenium", "15 µg"], ["Beta-carotene", "0.97 mg"], ["Caffeine", "15 mg"],
      ],
    },
    ingredients: "Fructose; gum arabic; oat and pea fiber; guar gum and citrus pectin; natural flavoring; citric acid; guarana extract powder; beta-carotene; vitamin C; beetroot powder; apple fiber; niacin (B3); lactic acid cultures; enzyme complex; rice fiber; chicory-root inulin; fruit, vegetable and spice blend; vitamin E; turmeric extract; steviol glycosides; selenium-enriched yeast; calcium D-pantothenate (B5); seaweed powder; vitamins B6, B1, B2 and B12; ginger extract; grape-seed extract; folic acid and biotin.",
    features: ["Vegan", "Gluten-free", "Lactose-free"],
    warnings: ["Contains 15 mg of caffeine per daily serving. Intended for adults.", enCommon.contraindications, enCommon.caffeine, enCommon.consult, "Food supplement. Not a medicinal product."],
    difference: "PowerCocktail combines fiber, vitamins, selenium and caffeine in one morning serving. Activize is taken in small servings during the day, Basics focuses on cell protection and fiber, and Restorate contains minerals and D3.",
    sources: [
      { title: "FitLine Kazakhstan · PowerCocktail", url: "https://www.fitline.com/kz/ru-ru/products/0705067" },
      { title: "Manufacturer label and directions (PDF)", url: "https://cdn.brandfolder.io/CN4BR5TK/at/czrm5ghm5pn52j8mp4s83hhg/FitLine_PowerCoctail_.pdf" },
    ],
  },
};

const kkCommon = {
  consult: "Қолданар алдында дәрігермен кеңескен жөн.",
  contraindications: "Қарсы көрсетілімдер: құрамдастарды көтере алмау, жүктілік және бала емізу кезеңі.",
  caffeine: "Жүйке қозғыштығы жоғары, ұйқысыздық, қан қысымы жоғары, жүрек ырғағы бұзылған немесе айқын атеросклероз кезінде қолдануға болмайды.",
};

const kk: Record<string, FitLineDetails> = {
  "fitline-activize": {
    name: "Activize", reference: "Oxyplus · Қара қарақат",
    purpose: "Белсенді күнге арналған кофеині бар дәруменді сусын. Құрамындағы B тобы дәрумендері, C дәрумені және өсімдік сығындылары энергия алмасуы мен зейінді қолдауға бағытталған.",
    facts: [{ value: "Энергия алмасуы", label: "B6 дәрумені" }, { value: "Зейін", label: "B6, B12 және C дәрумендері" }, { value: "Кофеин бар", label: "Гуарана сығындысы" }],
    audience: "Күні бойы сергектік пен зейін маңызды белсенді ересектерге арналған. Кофеині бар дәруменді сусын іздейтіндерге лайық; FitLine Activize өнімін «Фитнес» желісіне жатқызады.",
    properties: ["B6 дәрумені қалыпты энергия алмасуына ықпал етеді.", "B6, B12 және C дәрумендері қалыпты психологиялық қызметті қолдайды; өндіруші өнімнің зейінге бағытталуын осы құрамдастармен байланыстырады.", "Құрамында кофеин, гуарана, көк шай, куркума және зімбір сығындылары бар."],
    usage: { portion: "1 қасық · 1,67 г", water: "40–50 мл", frequency: "Күніне 2–3 рет", instructions: ["1 өлшеуіш қасық ұнтақты (1,67 г) 40–50 мл суға араластырыңыз.", "Ересектер тамақтан кейін күніне 2–3 рет бір порциядан қабылдайды. Кешке қабылдамаңыз."] },
    components: ["C дәрумені", "B1, B2, B3, B5, B6, B9, B12 дәрумендері және биотин", "Кофеин және гуарана", "Теңіз балдыры", "Көк шай, куркума және зімбір"],
    nutrition: { caption: "Өндіруші кестесіндегі 2 немесе 3 порцияға арналған тәуліктік мөлшер.", columns: ["2 порция", "3 порция"], rows: [["C дәрумені", "60 мг", "90 мг"], ["B1", "1,4 мг", "2,1 мг"], ["B2", "1,6 мг", "2,4 мг"], ["B3 (ниацин)", "20 мг", "30 мг"], ["B5", "6 мг", "9 мг"], ["B6", "1,9 мг", "2,9 мг"], ["B9", "250 мкг", "375 мкг"], ["B12", "1,34 мкг", "2 мкг"], ["Биотин", "40 мкг", "60 мкг"], ["Кофеин", "20 мг", "30 мг"]] },
    ingredients: "Декстроза; гуарана сығындысының ұнтағы (мальтодекстрин, кофеин, гуарана сығындысы); лимон қышқылы; қызылша ұнтағы; табиғи хош иістендіргіш; L-аскорбин қышқылы (C дәрумені); ниацин (B3); стевиол гликозидтері; кальций D-пантотенаты (B5); теңіз балдыры ұнтағы; пиридоксин гидрохлориді (B6); тиамин гидрохлориді (B1); рибофлавин (B2); цианокобаламин (B12); куркума, көк шай және зімбір сығындылары; фолий қышқылы (B9); D-биотин.",
    features: ["Веган", "Глютенсіз", "Лактозасыз"], warnings: ["Құрамында кофеин бар. Ересектерге арналған; кешке қабылдамаңыз.", kkCommon.contraindications, kkCommon.caffeine, kkCommon.consult],
    difference: "Activize шағын порцияда B және C дәрумендерін кофеинмен біріктіреді. Basics талшық пен жасушаларды қорғауға, PowerCocktail талшық пен кофеинге, ал Restorate минералдарға бағытталған.",
    sources: [{ title: "FitLine Kazakhstan · Activize Oxyplus", url: "https://www.fitline.com/kz/ru-ru/products/0708054" }, { title: "Өндірушінің құрам кестесі", url: "https://cdn.brandfolder.io/CN4BR5TK/at/jjc9qp6btkgmj6m8zcnx8gc/RU_Activize_Oxyplus.png" }],
  },
  "fitline-restorate": {
    name: "Restorate", reference: "Citrus · Апельсин-лимон",
    purpose: "Бұлшықет пен жүйке жүйесінің қалыпты жұмысына, сүйек пен тіске қолдау көрсетуге арналған минералды сусын. Негізгі құрамдастары — кальций, магний, микроэлементтер және D3 дәрумені.",
    facts: [{ value: "Бұлшықет пен жүйке", label: "Магний" }, { value: "Сүйек пен тіс", label: "Кальций және магний" }, { value: "Тері мен шаш", label: "Мырыш" }],
    audience: "Рационын минералдармен толықтырып, бұлшықет жұмысына, сүйек пен тіс жағдайына көңіл бөлетін ересектерге арналған. Сусын түріндегі қоспаны қалайтындарға қолайлы.",
    properties: ["Магний бұлшықет пен жүйке жүйесінің қалыпты жұмысына ықпал етеді.", "Кальций, магний және марганец сүйектің қалыпты күйін сақтауға қатысады; кальций мен магний тіске де маңызды.", "Мырыш тері, шаш және тырнақтың қалыпты күйін сақтауға ықпал етеді."],
    usage: { portion: "1 пакет · 6,7 г", water: "100 мл", frequency: "Күніне 1 рет", instructions: ["1 пакетті (6,7 г) немесе 1 шай қасықты (6,7 г) бөлме температурасындағы 100 мл суға ерітіңіз.", "Ересектер тамақпен бірге күніне бір рет қабылдайды. Қабылдау ұзақтығы: 1 ай."] },
    components: ["Кальций және магний", "D3 дәрумені", "Мырыш және темір", "Селен, мыс, марганец және хром"],
    nutrition: { caption: "Бір порцияға · 6,7 г.", columns: ["Мөлшері"], rows: [["Кальций", "268 мг"], ["Магний", "134 мг"], ["D3 дәрумені", "7,5 мкг"], ["Мырыш", "10 мг"], ["Темір", "4,7 мг"], ["Селен", "16,8 мкг"], ["Мыс", "0,67 мг"], ["Марганец", "1 мг"], ["Хром", "0,06 мг"]] },
    ingredients: "Фруктоза; лимон қышқылы (E330); кальций карбонаты; магний карбонаты; кальций лактаты; калий цитраты; лайм мен апельсин сығындылары бар табиғи хош иістендіргіш; магний цитраты; мырыш глюконаты; бета-каротин (E160a); стевиол гликозидтері; темір цитраты; марганец пен мыс глюконаттары; D3 дәрумені; хром пиколинаты; натрий селениті.",
    features: ["Глютенсіз", "Консервантсыз"], warnings: [kkCommon.contraindications, kkCommon.consult],
    difference: "Restorate минералдар мен D3 дәруменіне бағытталған. Activize құрамында B және C дәрумендері мен кофеин бар, ал Basics пен PowerCocktail құрамында тағамдық талшық та болады.",
    sources: [{ title: "FitLine Kazakhstan · Restorate Citrus", url: "https://www.fitline.com/kz/ru-ru/products/0702037" }, { title: "Өндірушінің құрам кестесі", url: "https://cdn.brandfolder.io/CN4BR5TK/at/vgnmhvqf3454f87v3f3sss/RU_Restorate_Citrus.png" }],
  },
  "fitline-basics": {
    name: "Basics", reference: "Апельсин",
    purpose: "Тағамдық талшықтар, дәрумендер және селен қосылған күнделікті сусын. Рационды толықтырып, жасушалардың табиғи қорғанысын және иммундық жүйенің қалыпты жұмысын қолдауға арналған.",
    facts: [{ value: "Жасушаларды қорғау", label: "C, E дәрумендері және селен" }, { value: "Иммундық жүйе", label: "C дәрумені және селен" }, { value: "Тағамдық талшық", label: "Сұлы, бұршақ және алма" }],
    audience: "Дәрумендер мен тағамдық талшықтары бар күнделікті сусын іздейтін ересектерге арналған. Иммундық жүйенің қалыпты жұмысы мен жасушаларды қорғауға арналған C, E дәрумендері мен селенді бір өнімнен алғысы келетіндерге лайық.",
    properties: ["Селен және C, E дәрумендері жасушаларды тотығу күйзелісінен қорғауға ықпал етеді.", "Селен мен C дәрумені иммундық жүйенің қалыпты жұмысын қолдайды.", "Құрамында тағамдық талшықтар, инулин және Lactobacillus acidophilus пен Lactobacillus reuteri сүтқышқылды дақылдары бар."],
    usage: { portion: "12 г ұнтақ", water: "180 мл", frequency: "Күніне 1 рет", instructions: ["12 г ұнтақты 180 мл суға ерітіңіз. Ересектер күніне бір рет қабылдайды.", "Ұсынылған тәуліктік мөлшерден асырмаңыз."] },
    components: ["C, E дәрумендері және бета-каротин (A провитамині)", "Селен", "Сұлы, бұршақ, алма және күріш талшықтары; инулин", "Lactobacillus acidophilus және Lactobacillus reuteri", "Ферменттер, ацерола, көкөністер және өсімдік сығындылары"],
    ingredients: "Фруктоза; гуммиарабик (E414); сұлы және бұршақ талшықтары; гуар шайыры (E412); пектин (E440); лимон қышқылы (E330); C дәрумені бар ацерола сығындысы; хош иістендіргіш; алма талшығы; көкөніс ұнтағы; көпферментті кешен; C дәрумені; инулин; күріш талшығы; стевиол гликозидтері; сүтқышқылды бактериялар; куркума сығындысы; селенмен байытылған ашытқы; көк шай сығындысы; E дәрумені; бета-каротин; жүзім сүйегі сығындысы.",
    features: ["Веган", "Глютенсіз", "Лактозасыз"], warnings: [kkCommon.contraindications, "Қоспа әртүрлі әрі теңгерімді тамақтану мен салауатты өмір салтын алмастырмайды.", kkCommon.consult],
    difference: "Basics тағамдық талшықтарға, C және E дәрумендері мен селенге басымдық береді. PowerCocktail талшықты кофеин және B дәрумендерімен біріктіреді; Activize — шағын порциямен қабылданатын кофеині бар дәруменді сусын; Restorate құрамында минералдар мен D3 бар.",
    sources: [{ title: "FitLine Kazakhstan · Basics", url: "https://www.fitline.com/kz/ru-ru/products/0705066" }],
  },
  "fitline-powercocktail": {
    name: "PowerCocktail", reference: "Апельсин-қара қарақат",
    purpose: "Дәрумендер, тағамдық талшықтар, кофеин және өсімдік сығындылары біріктірілген таңғы сусын. Энергия алмасуын, зейінді және иммундық жүйенің қалыпты жұмысын қолдауға бағытталған.",
    facts: [{ value: "Энергия алмасуы", label: "B6 дәрумені" }, { value: "Иммундық жүйе", label: "C дәрумені" }, { value: "15 мг кофеин", label: "7,5 г порцияда" }],
    audience: "Таңертең дәрумендер мен тағамдық талшықтарды бір сусыннан қабылдағысы келетін, күн тәртібі тығыз ересектерге арналған. Таңғы ас алдында қабылданатын кофеині бар кешенді өнімді қалайтындарға лайық.",
    properties: ["B6 дәрумені қалыпты энергия алмасуына ықпал етеді.", "B6, B12 және C дәрумендері қалыпты психологиялық қызметті қолдайды; өндіруші өнімді зейінді қолдаумен байланыстырады.", "C дәрумені иммундық жүйенің қалыпты жұмысына ықпал етеді.", "Құрамында еритін тағамдық талшықтар, инулин, сүтқышқылды дақылдар және ас қорыту ферменттері бар."],
    usage: { portion: "½ пакет · 7,5 г", water: "100 мл", frequency: "Күніне 1 рет", instructions: ["Пакеттің жартысын (7,5 г) 100 мл суға араластырыңыз. Ересектер таңғы ас алдында күніне бір рет қабылдайды.", "Жапсырмадағы курс ұзақтығы: 2–3 апта. Қажет болса, бір айдан кейін қайталауға болады."] },
    components: ["C, E және B тобы дәрумендері; бета-каротин", "Селен", "Кофеин және гуарана", "Еритін тағамдық талшықтар және инулин", "Lactobacillus acidophilus және Lactobacillus reuteri", "Ас қорыту ферменттері; жидек, көкөніс, шөп және дәмдеуіш сығындылары"],
    nutrition: { caption: "Тәуліктік порцияға · ½ пакет, 7,5 г.", columns: ["Мөлшері"], rows: [["C дәрумені", "75 мг"], ["E дәрумені", "5 мг"], ["B1", "1,05 мг"], ["B2", "1,2 мг"], ["B3 (ниацин)", "25,5 мг"], ["B5", "4,5 мг"], ["B6", "1,5 мг"], ["B9 (фолий қышқылы)", "150 мкг"], ["B12", "0,75 мкг"], ["Биотин", "112,5 мкг"], ["Селен", "15 мкг"], ["Бета-каротин", "0,97 мг"], ["Кофеин", "15 мг"]] },
    ingredients: "Фруктоза; гуммиарабик; сұлы және бұршақ талшықтары; гуар шайыры мен цитрус пектині; табиғи хош иістендіргіш; лимон қышқылы; гуарана сығындысының ұнтағы; бета-каротин; C дәрумені; қызылша ұнтағы; алма талшығы; ниацин (B3); сүтқышқылды дақылдар; ферменттер кешені; күріш талшығы; цикорий инулині; жеміс, көкөніс және дәмдеуіш қоспасы; E дәрумені; куркума сығындысы; стевиол гликозидтері; селенмен байытылған ашытқы; кальций D-пантотенаты (B5); теңіз балдыры ұнтағы; B6, B1, B2 және B12 дәрумендері; зімбір мен жүзім сүйегі сығындылары; фолий қышқылы және биотин.",
    features: ["Веган", "Глютенсіз", "Лактозасыз"], warnings: ["Тәуліктік порцияда 15 мг кофеин бар. Ересектерге арналған.", kkCommon.contraindications, kkCommon.caffeine, kkCommon.consult, "Тағамдық қоспа. Дәрілік зат емес."],
    difference: "PowerCocktail бір таңғы порцияда талшық, дәрумендер, селен және кофеинді біріктіреді. Activize күн ішінде шағын порциямен қабылданады, Basics жасушаларды қорғау мен талшыққа бағытталған, ал Restorate құрамында минералдар мен D3 бар.",
    sources: [{ title: "FitLine Kazakhstan · PowerCocktail", url: "https://www.fitline.com/kz/ru-ru/products/0705067" }, { title: "Өндірушінің жапсырмасы мен нұсқаулығы (PDF)", url: "https://cdn.brandfolder.io/CN4BR5TK/at/czrm5ghm5pn52j8mp4s83hhg/FitLine_PowerCoctail_.pdf" }],
  },
};

export const localizedFitlineDetails = (productId: string, locale: Locale) =>
  (locale === "ru" ? fitlineDetails[productId] : (locale === "kk" ? kk : en)[productId]);

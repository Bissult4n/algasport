const translatedWords: Record<string, string> = {
  "дзюдо": "柔道",
  "judo": "柔道",
  "победа": "勝利",
  "victory": "勝利",
  "жеңіс": "勝利",
  "сила": "力",
  "strength": "力",
  "күш": "力",
  "смелость": "勇気",
  "courage": "勇気",
  "батылдық": "勇気",
  "дух": "精神",
  "spirit": "精神",
  "рух": "精神",
  "вперёд": "前進",
  "вперед": "前進",
  "forward": "前進",
  "алға": "前進",
  "alga": "前進",
  "чемпион": "王者",
  "champion": "王者",
};

const cyrillicToLatin: Record<string, string> = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "gh", д: "d",
  е: "e", ё: "yo", ж: "zh", з: "z", и: "i", й: "y", к: "k",
  қ: "k", л: "l", м: "m", н: "n", ң: "ng", о: "o", ө: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ұ: "u", ү: "u",
  ф: "f", х: "kh", һ: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sh",
  ы: "y", і: "i", э: "e", ю: "yu", я: "ya", ъ: "", ь: "",
};

const syllables: Record<string, string> = {
  kya: "キャ", kyu: "キュ", kyo: "キョ", gya: "ギャ", gyu: "ギュ", gyo: "ギョ",
  sha: "シャ", shu: "シュ", sho: "ショ", zha: "ジャ", zhu: "ジュ", zho: "ジョ",
  cha: "チャ", chu: "チュ", cho: "チョ", nya: "ニャ", nyu: "ニュ", nyo: "ニョ",
  hya: "ヒャ", hyu: "ヒュ", hyo: "ヒョ", bya: "ビャ", byu: "ビュ", byo: "ビョ",
  pya: "ピャ", pyu: "ピュ", pyo: "ピョ", mya: "ミャ", myu: "ミュ", myo: "ミョ",
  rya: "リャ", ryu: "リュ", ryo: "リョ", ja: "ジャ", ju: "ジュ", jo: "ジョ",
  shi: "シ", chi: "チ", tsu: "ツ", dzu: "ヅ", dji: "ヂ",
  va: "ヴァ", vi: "ヴィ", vu: "ヴ", ve: "ヴェ", vo: "ヴォ",
  fa: "ファ", fi: "フィ", fu: "フ", fe: "フェ", fo: "フォ",
  ti: "ティ", tu: "トゥ", di: "ディ", du: "ドゥ",
  ka: "カ", ki: "キ", ku: "ク", ke: "ケ", ko: "コ",
  ga: "ガ", gi: "ギ", gu: "グ", ge: "ゲ", go: "ゴ",
  sa: "サ", si: "シ", su: "ス", se: "セ", so: "ソ",
  za: "ザ", zi: "ジ", zu: "ズ", ze: "ゼ", zo: "ゾ",
  ta: "タ", te: "テ", to: "ト", da: "ダ", de: "デ", do: "ド",
  na: "ナ", ni: "ニ", nu: "ヌ", ne: "ネ", no: "ノ",
  ha: "ハ", hi: "ヒ", he: "ヘ", ho: "ホ",
  ba: "バ", bi: "ビ", bu: "ブ", be: "ベ", bo: "ボ",
  pa: "パ", pi: "ピ", pu: "プ", pe: "ペ", po: "ポ",
  ma: "マ", mi: "ミ", mu: "ム", me: "メ", mo: "モ",
  ya: "ヤ", yu: "ユ", yo: "ヨ",
  ra: "ラ", ri: "リ", ru: "ル", re: "レ", ro: "ロ",
  wa: "ワ", wo: "ヲ",
  a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ",
};

const syllableKeys = Object.keys(syllables).sort((a, b) => b.length - a.length);
const finalConsonants: Record<string, string> = {
  b: "ブ", c: "ク", d: "ド", f: "フ", g: "グ", h: "フ", j: "ジ",
  k: "ク", l: "ル", m: "ム", p: "プ", q: "ク", r: "ル", s: "ス",
  t: "ト", v: "フ", w: "ウ", x: "クス", y: "イ", z: "ズ",
};
const japaneseDigits: Record<string, string> = {
  "0": "〇", "1": "一", "2": "二", "3": "三", "4": "四",
  "5": "五", "6": "六", "7": "七", "8": "八", "9": "九",
};

const japaneseOnly = /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}々〆ヵヶー・、。]+$/u;

function romanize(value: string) {
  return Array.from(value.toLocaleLowerCase("und"))
    .map((char) => cyrillicToLatin[char] ?? char)
    .join("")
    .replace(/[^a-z0-9-]/g, "");
}

function katakana(value: string) {
  const input = romanize(value);
  let result = "";
  for (let index = 0; index < input.length;) {
    const char = input[index];
    if (japaneseDigits[char]) {
      result += japaneseDigits[char];
      index += 1;
      continue;
    }
    if (char === "-") {
      result += "ー";
      index += 1;
      continue;
    }
    if (
      index + 1 < input.length &&
      char === input[index + 1] &&
      /[bcdfgjklmpqrstvwxyz]/.test(char)
    ) {
      result += "ッ";
      index += 1;
      continue;
    }
    if (char === "n" && (index === input.length - 1 || !/[aeiouy]/.test(input[index + 1]))) {
      result += "ン";
      index += 1;
      continue;
    }
    const key = syllableKeys.find((candidate) => input.startsWith(candidate, index));
    if (key) {
      result += syllables[key];
      index += key.length;
      continue;
    }
    result += finalConsonants[char] || "";
    index += 1;
  }
  return result;
}

export function toJapaneseEmbroidery(value: string) {
  const normalized = value.normalize("NFKC").trim().replace(/\s+/g, " ");
  if (!normalized) return "";
  if (japaneseOnly.test(normalized.replaceAll(" ", "・")))
    return normalized.replaceAll(" ", "・");
  return normalized
    .split(/\s+/)
    .map((word) => {
      const japaneseWord = word.replace(/[・、。]+$/u, "");
      if (japaneseOnly.test(japaneseWord)) return japaneseWord;
      return translatedWords[word.toLocaleLowerCase("und")] || katakana(word);
    })
    .filter(Boolean)
    .join("・");
}

export const isJapaneseEmbroidery = (value: string) =>
  !!value && japaneseOnly.test(value);

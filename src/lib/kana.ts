// Romaji / kana conversion. The app accepts answers in romaji, hiragana or
// katakana; everything is folded to hiragana for comparison.

/** Katakana (U+30A1–30F6) maps onto hiragana (U+3041–3096) with a fixed offset. */
export function katakanaToHiragana(s: string): string {
  let out = '';
  for (const ch of s) {
    const code = ch.codePointAt(0) ?? 0;
    out += code >= 0x30a1 && code <= 0x30f6 ? String.fromCodePoint(code - 0x60) : ch;
  }
  return out;
}

// Romaji syllable -> hiragana. Hepburn, with common alternates (si/ti/tu/zi…).
const ROMAJI: Record<string, string> = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  sa: 'さ', shi: 'し', si: 'し', su: 'す', se: 'せ', so: 'そ',
  za: 'ざ', ji: 'じ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  ta: 'た', chi: 'ち', ti: 'ち', tsu: 'つ', tu: 'つ', te: 'て', to: 'と',
  da: 'だ', de: 'で', do: 'ど',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', hu: 'ふ', he: 'へ', ho: 'ほ',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を', n: 'ん',
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
};

const VOWELS = new Set(['a', 'i', 'u', 'e', 'o']);

/** Convert a romaji string to hiragana. Handles youon, the small tsu and ん. */
export function romajiToHiragana(input: string): string {
  // Expand macron long vowels.
  const s = input
    .replace(/[āâ]/g, 'aa')
    .replace(/[īî]/g, 'ii')
    .replace(/[ūû]/g, 'uu')
    .replace(/[ēê]/g, 'ee')
    .replace(/[ōô]/g, 'ou');

  let out = '';
  let i = 0;
  while (i < s.length) {
    let matched = false;
    for (let len = Math.min(3, s.length - i); len >= 1; len--) {
      const hira = ROMAJI[s.slice(i, i + len)];
      if (hira) {
        out += hira;
        i += len;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const c = s[i];
    // Sokuon: a doubled consonant becomes っ.
    if (c === s[i + 1] && c !== 'n' && !VOWELS.has(c)) {
      out += 'っ';
      i += 1;
      continue;
    }
    // Unknown character (already kana, punctuation) — keep as-is.
    out += c;
    i += 1;
  }
  return out;
}

import type { Exercise, CheckResult } from '../types';
import { katakanaToHiragana, romajiToHiragana } from './kana';

/**
 * Normalize a typed answer for comparison. Answers may be written in romaji,
 * hiragana or katakana — all are folded to a single hiragana form so any of
 * them matches a kana-authored answer key.
 */
export function normalize(s: string): string {
  let t = s.normalize('NFKC').toLowerCase().trim();
  t = t.replace(/[\s・、。.,!?！？'’ー-]/g, '');
  t = katakanaToHiragana(t);
  if (/[a-z]/.test(t)) t = romajiToHiragana(t);
  return t;
}

/** Levenshtein edit distance — used to spot a near-miss (typo) versus a genuinely wrong answer. */
export function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/**
 * The single centralized answer checker. Every question type routes through here,
 * so grading rules live in exactly one place.
 *
 * For `mcq`, `answer` is the selected option index. For all other types it is the typed string.
 */
export function checkAnswer(ex: Exercise, answer: string | number): CheckResult {
  if (ex.type === 'mcq') {
    const options = ex.options ?? [];
    const idx = typeof answer === 'number' ? answer : -1;
    const chosen = options[idx];
    if (!chosen) return { correct: false, feedback: 'No answer selected.' };
    return {
      correct: chosen.correct,
      feedback: chosen.rationale || ex.explanation,
    };
  }

  // Typed answers: text / fill_blank / word_order / match.
  const acceptedRaw = ex.accepted ?? [];
  const accepted = acceptedRaw.map(normalize);
  const guess = normalize(String(answer));
  if (!guess) return { correct: false, feedback: 'No answer entered.' };

  if (accepted.includes(guess)) {
    return { correct: true, feedback: ex.explanation };
  }

  // Near-miss: a few typos away from a correct answer. Tolerance scales with
  // length, so short words are not mistaken for typos of each other.
  if (ex.type !== 'word_order') {
    for (let i = 0; i < accepted.length; i++) {
      const target = accepted[i];
      const tolerance = target.length <= 4 ? 0 : target.length <= 8 ? 1 : 2;
      if (tolerance > 0 && editDistance(guess, target) <= tolerance) {
        return {
          correct: false,
          closeMiss: 'spelling',
          feedback: `Almost — check the reading. Expected: "${acceptedRaw[i]}".`,
        };
      }
    }
  }

  return { correct: false, feedback: `Not quite. ${ex.explanation}` };
}

# Japanese Trainer

A static, offline-capable web app for learning **Japanese** — from your very
first hiragana through to JLPT-level grammar. No backend, no runtime AI: every
question *and its feedback* lives in a data file, so the whole app is a free
static site.

Forked from [Malay Trainer](https://github.com/quahzhengjie/malay-trainer);
see that repo's `BUILD_PLAYBOOK.md` for the shared architecture.

## Structure

The app has four tabs:

- **Home** — at-a-glance overview: streak, daily goal, what's due for review, a
  "continue learning" shortcut, course progress and a kana cheat-sheet.
- **Learn** — the course map: chapters → lessons. Each lesson teaches first
  (a kana chart / intro card) then runs through its questions.
- **Review** — spaced repetition. Only questions you've already learned resurface
  here, scheduled by a Leitner algorithm.
- **Grammar** — browse every grammar / kana note directly.

## Answers — romaji or kana

Typed answers are accepted in **romaji, hiragana or katakana**.
`src/lib/kana.ts` folds every form to hiragana (katakana shifts by code point;
romaji is converted by a syllable table that handles youon, the small tsu and ん);
`src/lib/checkAnswer.ts` compares on that hiragana form. Author `accepted` answers
in kana.

## How content works

| Layer | Where | Edited by |
|---|---|---|
| Question bank | `content/bank/*.csv` (one CSV per JLPT level) | you, in Excel / Sheets |
| Course outline | `content/lessons.csv` (chapters & lessons) | you, in Excel / Sheets |
| Grammar / kana notes | `content/grammar/*.md` (Markdown + frontmatter) | you, in any editor |
| Build step | `scripts/build-bank.mjs` | compiles all of the above to `public/data/` |
| Answer grading | `src/lib/checkAnswer.ts` + `src/lib/kana.ts` | the single checker |

Everything in `public/data/` is **generated** — the CSVs and Markdown are the source of truth.

## Develop

```bash
npm install
npm run dev      # builds content, then starts Vite
```

## Add a question

Open a bank CSV (e.g. `content/bank/n5.csv`). Key columns:

- `id, level, skill, lesson, type, prompt` — `level` is a JLPT level (`N5`…`N1`);
  `lesson` must match a `lesson_id` in `lessons.csv`.
- **Multiple choice** (`type` = `mcq`): fill `opt_a..opt_d`, set one `opt_*_correct`
  to `true`, and write each `opt_*_why`.
- **Typed answer** (`type` = `text`, `fill_blank`, `word_order`): leave the options
  blank and fill `accepted` (in kana), pipe-separating alternatives.
- `explanation`, `grammar_note`, `tags` — the why, an optional note id, optional tags.

## Add a lesson, chapter or note

`content/lessons.csv` — one row per lesson; rows sharing a `chapter` are grouped.
`content/grammar/<id>.md` — a Markdown note with `id, title, level, tags` frontmatter.

## Test & deploy

```bash
npm test         # vitest — covers the answer checker, kana conversion and the SRS scheduler
```

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages. One-time setup: **Settings → Pages → Source: GitHub Actions**.

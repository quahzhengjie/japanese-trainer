# Japanese Trainer — Project Notes

A living reference for the project: current state, decisions and roadmap.
For *how to develop and add content*, see `README.md`.

_Last updated: 2026-05-22._

## What it is

A static, offline-capable PWA for learning **Japanese** — from first hiragana to
JLPT-level grammar. No backend, no runtime AI; the whole app is a free static site
on GitHub Pages.

Forked from **Malay Trainer** — same architecture (see that repo's
`BUILD_PLAYBOOK.md`). The one piece rebuilt for Japanese is the answer-checker.

- **Repo:** github.com/quahzhengjie/japanese-trainer (public)
- **Live:** https://quahzhengjie.github.io/japanese-trainer/

## Current state

- **Scaffold + first content slice.** 35 questions · 5 lessons · 1 chapter
  (Hiragana) · 5 kana notes. JLPT N5.
- **4 tabs:** Home (default) · Learn · Review · Grammar.
- Builds clean; unit tests pass (checker, kana conversion, SRS).

## Architecture

Identical to Malay Trainer: CSV/Markdown content → `scripts/build-bank.mjs` →
generated `public/data/*.json` → a React + Vite + TypeScript SPA. Spaced
repetition, Home/streak/XP, theme, PWA and the GitHub-Pages deploy all carry over.

**What is Japanese-specific:**

- `src/lib/kana.ts` — romaji/katakana → hiragana conversion. Katakana shifts by a
  fixed code-point offset; romaji is parsed by a longest-match syllable table that
  handles youon, the small tsu (doubled consonant) and ん.
- `src/lib/checkAnswer.ts` — `normalize()` folds any answer (romaji, hiragana,
  katakana) to hiragana, so all three forms match a kana-authored answer key.
- Levels are **JLPT N5→N1** (not CEFR). `skill` includes `kana`.
- localStorage keys are namespaced `japanese-trainer:*` so the app does not collide
  with Malay Trainer on the shared `*.github.io` origin.

## Roadmap (not yet done)

The current build is the hiragana starter slice. Next, in order:

1. **Finish hiragana** — the remaining rows (h, m, y, r, w), plus dakuten/handakuten
   (が…, ぱ…) and youon (きゃ…).
2. **Katakana** — the full second script, same lesson structure.
3. **N5 vocabulary & grammar** — greetings, numbers, particles (は・が・を), です/ます,
   basic sentence patterns.
4. **Kanji** — introduce kanji with readings; the `accepted` field already supports
   kanji + kana-reading alternatives.
5. **Levels N4 → N1** — expand the bank tier by tier (parallel agent generation,
   then validate + human-review).
6. **Listening question type** — hear a word, pick the kana/meaning.
7. Re-add a **placement step** in onboarding once there is more than one level.

## Known limitations / notes

- Content is AI-authored — the hiragana slice is mechanical and reliable, but later
  vocab/grammar should be reviewed by a fluent speaker.
- The romaji→kana converter handles standard Hepburn; particle spellings (は read
  "wa", を read "o") can differ from a literal romaji conversion — author such
  answers with kana, or pipe in the alternate form.
- Progress is single-device (`localStorage`); deliberate.
- `public/data/` is generated — never hand-edit; edit the CSV/Markdown.

## Conventions

- One commit per logical change; pushes auto-deploy. Branch: `main`.
- Quote every text field in the question CSVs. Run `node scripts/check-csv.mjs`
  after bulk edits.

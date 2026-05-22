// Shared data model. Exercise/Course/GrammarNote here match exactly what
// scripts/build-bank.mjs emits into public/data/.

export type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type Skill =
  | 'kana'
  | 'vocab'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'translation';
export type QType = 'mcq' | 'text' | 'fill_blank' | 'word_order' | 'match';

/** One choice in a multiple-choice question. `rationale` is the feedback shown for picking it. */
export interface Option {
  text: string;
  correct: boolean;
  rationale: string;
}

export interface Exercise {
  id: string;
  level: Level;
  skill: Skill;
  /** id of the Lesson this question belongs to. */
  lesson: string;
  type: QType;
  prompt: string;
  /** Present for `mcq`. */
  options?: Option[];
  /** Present for typed-answer types. Accepts romaji, hiragana or katakana. */
  accepted?: string[];
  /** The general "why" — always shown after answering. */
  explanation: string;
  /** id of a grammar note in content/grammar/. */
  grammarNote?: string;
  tags: string[];
}

export type CloseMiss = 'spelling' | 'register' | 'word_order';

export interface CheckResult {
  correct: boolean;
  feedback: string;
  /** Set when the answer was wrong but recognisably close. */
  closeMiss?: CloseMiss;
}

/** A unit of study: a teaching intro plus a fixed set of questions. */
export interface Lesson {
  id: string;
  title: string;
  level: string;
  intro: string;
  /** id of the grammar note shown as the lesson's teaching card. */
  grammarNote?: string;
  /** Exercise ids belonging to this lesson, in order. */
  exerciseIds: string[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  chapters: Chapter[];
}

export interface GrammarNote {
  id: string;
  title: string;
  level: string;
  tags: string[];
  body: string;
}

export interface GrammarIndex {
  notes: { id: string; title: string; level: string }[];
}

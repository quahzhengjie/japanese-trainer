import { describe, it, expect } from 'vitest';
import { checkAnswer, normalize, editDistance } from './checkAnswer';
import type { Exercise } from '../types';

const mcq: Exercise = {
  id: 't-mcq',
  level: 'N5',
  skill: 'kana',
  lesson: 'test',
  type: 'mcq',
  prompt: 'Which kana is read "a"?',
  options: [
    { text: 'あ', correct: true, rationale: 'Correct — あ is "a".' },
    { text: 'い', correct: false, rationale: 'い is "i".' },
  ],
  explanation: 'あ = a.',
  tags: [],
};

const text: Exercise = {
  id: 't-text',
  level: 'N5',
  skill: 'kana',
  lesson: 'test',
  type: 'text',
  prompt: 'Type the reading of か',
  accepted: ['か'],
  explanation: 'か = ka.',
  tags: [],
};

describe('normalize', () => {
  it('folds romaji, katakana and hiragana to one hiragana form', () => {
    expect(normalize('ka')).toBe('か');
    expect(normalize('カ')).toBe('か');
    expect(normalize('か')).toBe('か');
  });
});

describe('editDistance', () => {
  it('counts single-character edits', () => {
    expect(editDistance('すし', 'すし')).toBe(0);
    expect(editDistance('すし', 'すす')).toBe(1);
  });
});

describe('checkAnswer — mcq', () => {
  it('accepts the correct option index', () => {
    expect(checkAnswer(mcq, 0).correct).toBe(true);
  });
  it('rejects a wrong option and returns its rationale', () => {
    const r = checkAnswer(mcq, 1);
    expect(r.correct).toBe(false);
    expect(r.feedback).toContain('i');
  });
});

describe('checkAnswer — typed answers', () => {
  it('accepts the answer typed in romaji', () => {
    expect(checkAnswer(text, 'ka').correct).toBe(true);
  });
  it('accepts the answer typed in kana', () => {
    expect(checkAnswer(text, 'か').correct).toBe(true);
  });
  it('rejects a clearly wrong answer', () => {
    expect(checkAnswer(text, 'ki').correct).toBe(false);
  });
});

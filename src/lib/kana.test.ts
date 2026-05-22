import { describe, it, expect } from 'vitest';
import { katakanaToHiragana, romajiToHiragana } from './kana';

describe('katakanaToHiragana', () => {
  it('shifts katakana to hiragana and leaves hiragana alone', () => {
    expect(katakanaToHiragana('カタカナ')).toBe('かたかな');
    expect(katakanaToHiragana('すし')).toBe('すし');
  });
});

describe('romajiToHiragana', () => {
  it('converts basic syllables', () => {
    expect(romajiToHiragana('sushi')).toBe('すし');
    expect(romajiToHiragana('kawaii')).toBe('かわいい');
  });
  it('handles the small tsu from a doubled consonant', () => {
    expect(romajiToHiragana('kitte')).toBe('きって');
  });
  it('handles ん before a consonant', () => {
    expect(romajiToHiragana('sensei')).toBe('せんせい');
  });
  it('handles youon (contracted sounds)', () => {
    expect(romajiToHiragana('kyou')).toBe('きょう');
  });
});

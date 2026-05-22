import { useEffect, useState } from 'react';
import type { CheckResult, Exercise } from '../types';
import { kanaToRomaji } from '../lib/kana';
import { romajiEnabled, onRomajiChange } from '../lib/readingAid';

const KANA_RE = /[぀-ヿ]/;

interface Props {
  exercise: Exercise;
  /** True once the question has been answered — inputs lock until the user moves on. */
  locked: boolean;
  /** The grading result, once answered — used to colour the options. */
  result: CheckResult | null;
  onAnswer: (answer: string | number) => void;
}

export function QuestionCard({ exercise, locked, result, onAnswer }: Props) {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [romaji, setRomaji] = useState(romajiEnabled);

  useEffect(() => onRomajiChange(() => setRomaji(romajiEnabled())), []);

  const isMcq = exercise.type === 'mcq';
  // Reading aid: show romaji under the prompt — but never on the kana-learning
  // questions, where it would simply give the answer away.
  const showRomaji =
    romaji && exercise.skill !== 'kana' && KANA_RE.test(exercise.prompt);

  // After answering: green the correct option, red the wrong pick, dim the rest.
  function optionClass(index: number, correct: boolean): string {
    if (!result) return 'option';
    if (correct) return 'option option-correct';
    if (index === selected) return 'option option-wrong';
    return 'option option-dim';
  }

  return (
    <section className="card">
      <div className="meta">
        <span className="pill">{exercise.level}</span>
        <span className="pill pill-soft">{exercise.skill}</span>
      </div>
      <h2 className="prompt" lang="ja">
        {exercise.prompt}
      </h2>
      {showRomaji && (
        <p className="romaji-line" aria-hidden="true">
          {kanaToRomaji(exercise.prompt)}
        </p>
      )}

      {isMcq ? (
        <div className="options">
          {(exercise.options ?? []).map((opt, i) => (
            <button
              key={i}
              type="button"
              className={optionClass(i, opt.correct)}
              disabled={locked}
              onClick={() => {
                setSelected(i);
                onAnswer(i);
              }}
            >
              <span>{opt.text}</span>
              {result && opt.correct && <span className="option-mark">✓</span>}
              {result && i === selected && !opt.correct && (
                <span className="option-mark">✗</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <form
          className="text-answer"
          onSubmit={(e) => {
            e.preventDefault();
            if (!locked && text.trim()) onAnswer(text);
          }}
        >
          <input
            autoFocus
            value={text}
            disabled={locked}
            placeholder="Type your answer — rōmaji or kana…"
            aria-label="Your answer"
            lang="ja"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            className={
              result ? (result.correct ? 'input-correct' : 'input-wrong') : undefined
            }
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" disabled={locked || !text.trim()}>
            Check
          </button>
        </form>
      )}
    </section>
  );
}

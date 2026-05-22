import type { Level } from '../types';

interface Props {
  /** `start` is the level to begin at; null = absolute beginner. */
  onComplete: (start: Level | null) => void;
}

export function Onboarding({ onComplete }: Props) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Welcome">
      <div className="overlay-inner">
        <main>
          <section className="card onboard">
            <span className="brand-mark onboard-mark">日</span>
            <h1>ようこそ!</h1>
            <p>
              Learn Japanese — from your very first hiragana through to JLPT-level
              grammar, at your own pace.
            </p>
            <ul className="onboard-list">
              <li>
                <strong>Learn</strong> — lessons that teach a point, then practise it.
              </li>
              <li>
                <strong>Review</strong> — spaced repetition brings questions back so
                they stick.
              </li>
              <li>
                <strong>Grammar</strong> — kana charts and notes, plus a cheat-sheet
                on Home.
              </li>
            </ul>
            <p className="explain">
              Type answers in rōmaji or kana — both are accepted. Your progress is
              saved on this device.
            </p>
            <button
              type="button"
              className="primary block"
              autoFocus
              onClick={() => onComplete(null)}
            >
              Start learning
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { romajiEnabled, setRomajiEnabled, onRomajiChange } from '../lib/readingAid';

/** Header toggle for the romaji reading aid. */
export function RomajiToggle() {
  const [on, setOn] = useState(romajiEnabled);

  useEffect(() => onRomajiChange(() => setOn(romajiEnabled())), []);

  const label = on ? 'Hide the romaji reading aid' : 'Show the romaji reading aid';
  return (
    <button
      type="button"
      className={`icon-btn romaji-btn${on ? ' romaji-btn-on' : ''}`}
      onClick={() => setRomajiEnabled(!on)}
      aria-label={label}
      aria-pressed={on}
      title={label}
    >
      <span aria-hidden="true">あ</span>
    </button>
  );
}

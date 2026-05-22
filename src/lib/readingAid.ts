// The romaji reading aid — a learner setting, on by default for beginners.
// Persisted per-device; broadcasts so every view re-syncs when it is toggled.

const KEY = 'japanese-trainer:romaji';

export function romajiEnabled(): boolean {
  try {
    const v = localStorage.getItem(KEY);
    return v === null ? true : v === '1';
  } catch {
    return true;
  }
}

export function setRomajiEnabled(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    // localStorage unavailable — the setting just won't persist.
  }
  window.dispatchEvent(new CustomEvent('romajichange'));
}

export function onRomajiChange(handler: () => void): () => void {
  window.addEventListener('romajichange', handler);
  return () => window.removeEventListener('romajichange', handler);
}

// Pronunciation via the browser's built-in speech synthesis — free, no audio assets.

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string): void {
  if (!canSpeak() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    const voice = window.speechSynthesis.getVoices().find((v) => /^ja\b/i.test(v.lang));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch {
    // speech synthesis unavailable — silently no-op
  }
}

type FeedbackSound = "correct" | "incorrect";

export function playFeedbackSound(type: FeedbackSound): void {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextClass();

  if (type === "correct") {
    playTone(context, 880, 0, 0.14);
    playTone(context, 1174.66, 0.14, 0.16);
    return;
  }

  playTone(context, 180, 0, 0.18);
  playTone(context, 135, 0.18, 0.22);
}

function playTone(
  context: AudioContext,
  frequency: number,
  startOffset: number,
  duration: number
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + startOffset;
  const end = start + duration;

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, end);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.02);
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

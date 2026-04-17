"use client";

let audioCtx: AudioContext | null = null;

// Global state for sound toggle
let isSoundEnabled = true;
let subscribers: ((enabled: boolean) => void)[] = [];

if (typeof window !== "undefined") {
  const stored = localStorage.getItem("coldcraft_sound_enabled");
  if (stored !== null) {
    isSoundEnabled = stored === "true";
  }
}

export const setSoundEnabled = (enabled: boolean) => {
  isSoundEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem("coldcraft_sound_enabled", enabled.toString());
  }
  subscribers.forEach((cb) => cb(enabled));
};

export const getSoundEnabled = () => isSoundEnabled;

export const subscribeToSoundStatus = (cb: (enabled: boolean) => void) => {
  subscribers.push(cb);
  return () => {
    subscribers = subscribers.filter((fn) => fn !== cb);
  };
};

const initAudio = () => {
  if (typeof window === "undefined" || !isSoundEnabled) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const playHoverSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // A soft, cute "blip" sound typical of modern minimal UI
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(600, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime); // keep volume very low and subtle
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.04);
};

export const playClickSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // A sharper, lower "tock" for clicking
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);

  gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.05);
};

// Auswahllisten für Serien-Builder, Onboarding und Editor.

export const NICHES = [
  { id: 'history', label: 'Geschichte', emoji: '🏛️', ready: true, desc: 'Überraschende Momente aus der Weltgeschichte.' },
  { id: 'motivation', label: 'Motivation', emoji: '🔥', ready: false, desc: 'Kurze Impulse, Zitate und Denkanstösse.' },
  { id: 'facts', label: 'Fakten', emoji: '💡', ready: false, desc: 'Wissen in 30 Sekunden – Natur, Technik, Alltag.' },
  { id: 'horror', label: 'Horror-Stories', emoji: '👻', ready: false, desc: 'Gruselige Kurzgeschichten mit Spannungsbogen.' },
  { id: 'reddit', label: 'Reddit-Stories', emoji: '💬', ready: false, desc: 'Erzählte Community-Geschichten (eigene Texte).' },
  { id: 'characters', label: 'Figuren-Geschichten', emoji: '🧑‍🎤', ready: true, desc: 'Eine erfundene Hauptfigur erlebt in jeder Folge ein neues Abenteuer – immer mit demselben Gesicht.' },
  { id: 'custom', label: 'Eigenes Thema', emoji: '✍️', ready: true, desc: 'Du gibst das Thema vor, die KI plant die Serie.' },
];

export const ART_STYLES = [
  { id: 'realistic', label: 'Realistisch' },
  { id: 'anime', label: 'Anime' },
  { id: 'comic', label: 'Comic' },
  { id: 'manga', label: 'Manga' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'stock', label: 'Stock-Footage' },
];

export const LANGUAGES = [
  { id: 'de', label: 'Deutsch', bcp47: 'de-DE' },
  { id: 'de-CH', label: 'Deutsch (Schweiz)', bcp47: 'de-CH' },
  { id: 'en', label: 'English', bcp47: 'en-US' },
  { id: 'fr', label: 'Français', bcp47: 'fr-FR' },
  { id: 'it', label: 'Italiano', bcp47: 'it-IT' },
  { id: 'es', label: 'Español', bcp47: 'es-ES' },
];

// Stimmen-Presets. "providerVoice" wird vom TTS-Modul auf echte Stimmen gemappt.
export const VOICES = [
  { id: 'calm-m', label: 'Ruhig (m)', pitch: 0.95, rate: 1.0, gender: 'male', providerVoice: { elevenlabs: 'pNInz6obpgDQGcFmaJgB', openai: 'onyx' } },
  { id: 'clear-m', label: 'Klar (m)', pitch: 1.0, rate: 1.0, gender: 'male', providerVoice: { elevenlabs: 'pNInz6obpgDQGcFmaJgB', openai: 'ash' } },
  { id: 'story-m', label: 'Erzähler (m)', pitch: 0.85, rate: 0.95, gender: 'male', providerVoice: { elevenlabs: 'VR6AewLTigWG4xSOukaG', openai: 'verse' } },
  { id: 'warm-f', label: 'Warm (w)', pitch: 1.05, rate: 1.0, gender: 'female', providerVoice: { elevenlabs: 'EXAVITQu4vr4xnSDxMaL', openai: 'coral' } },
  { id: 'soft-f', label: 'Sanft (w)', pitch: 1.0, rate: 0.97, gender: 'female', providerVoice: { elevenlabs: 'EXAVITQu4vr4xnSDxMaL', openai: 'sage' } },
  { id: 'energy-f', label: 'Energisch (w)', pitch: 1.15, rate: 1.1, gender: 'female', providerVoice: { elevenlabs: 'MF3mGyEYCl7XYWbV9V6O', openai: 'nova' } },
];

export const CAPTION_STYLES = [
  { id: 'karaoke', label: 'Karaoke', desc: 'Aktives Wort farbig hervorgehoben' },
  { id: 'pop', label: 'Pop', desc: 'Wort für Wort mit Zoom-Effekt' },
  { id: 'box', label: 'Box', desc: 'Satzblock auf dunklem Hintergrund' },
  { id: 'classic', label: 'Klassisch', desc: 'Weiss mit Kontur' },
  { id: 'minimal', label: 'Minimal', desc: 'Klein und dezent' },
];

export const CAPTION_FONTS = ['Inter Variable', 'Georgia', 'Impact', 'Courier New'];

export const DEFAULT_CAPTIONS = {
  style: 'karaoke',
  font: 'Inter Variable',
  color: '#ffffff',
  highlight: '#33d4a3',
  position: 'bottom', // top | middle | bottom
  size: 1, // Faktor
  uppercase: false,
};

// Eigene, prozedural erzeugte Musik (Web Audio) – dadurch garantiert lizenzfrei.
export const MUSIC_TRACKS = [
  { id: 'none', label: 'Keine Musik' },
  { id: 'calm', label: 'Ruhige Flächen', mood: 'ruhig', bpm: 70, root: 220, scale: [0, 3, 7, 10] },
  { id: 'tension', label: 'Spannung', mood: 'spannend', bpm: 90, root: 146.83, scale: [0, 1, 7, 8] },
  { id: 'epic', label: 'Episch', mood: 'episch', bpm: 80, root: 110, scale: [0, 7, 12, 15] },
  { id: 'uplift', label: 'Aufbruch', mood: 'positiv', bpm: 110, root: 261.63, scale: [0, 4, 7, 11] },
];

export const POST_FREQUENCIES = [
  { id: '3w', label: '3× pro Woche', perWeek: 3 },
  { id: '1d', label: '1× täglich', perWeek: 7 },
  { id: '2d', label: '2× täglich', perWeek: 14 },
];

export const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', soon: true }, // Auto-Posting: App-Review ausstehend
  { id: 'instagram', label: 'Instagram Reels', soon: true },
  { id: 'youtube', label: 'YouTube Shorts' },
];

// Ziel-Videolänge. TikTok-Monetarisierung (Creator Rewards) verlangt Videos über 1 Minute.
export const VIDEO_LENGTHS = [
  { seconds: 40, label: '30–45 s', desc: 'Kurz & knackig – maximale Reichweite' },
  { seconds: 65, label: '60–75 s', desc: 'Empfohlen – über 1 Minute (TikTok-Monetarisierung)' },
  { seconds: 90, label: '~90 s', desc: 'Ausführlich – mehr Story' },
];
export const DEFAULT_TARGET_SECONDS = 65;
export const MONETIZATION_MIN_SECONDS = 60;

// Auswahllisten für Serien-Builder, Onboarding und Editor.

export const NICHES = [
  { id: 'history', label: 'Geschichte', emoji: '🏛️', ready: true, desc: 'Überraschende Momente aus der Weltgeschichte.' },
  { id: 'motivation', label: 'Motivation', emoji: '🔥', ready: false, desc: 'Kurze Impulse, Zitate und Denkanstösse.' },
  { id: 'facts', label: 'Fakten', emoji: '💡', ready: false, desc: 'Wissen in 30 Sekunden – Natur, Technik, Alltag.' },
  { id: 'horror', label: 'Horror-Stories', emoji: '👻', ready: false, desc: 'Gruselige Kurzgeschichten mit Spannungsbogen.' },
  { id: 'reddit', label: 'Reddit-Stories', emoji: '💬', ready: false, desc: 'Erzählte Community-Geschichten (eigene Texte).' },
  { id: 'animalstories', label: 'Bewegende Tiergeschichten', emoji: '🐾', ready: true, desc: 'Rührende Geschichten über Tiere – Rettung, Treue, Abschied und Hoffnung. Emotional, aber nie grausam.' },
  { id: 'pov', label: 'POV: Zeitreise', emoji: '⏳', ready: true, desc: 'Du erlebst den Alltag in einer anderen Epoche – aus der Ich-Perspektive. Ein beliebtes Trend-Format.' },
  { id: 'promo', label: 'Werbung für dein Produkt', emoji: '📣', ready: true, desc: 'Kurze, ehrliche Werbevideos für deinen Shop, dein Lokal, deine App oder dein Angebot – mit Hook und klarem Aufruf am Schluss.' },
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
  { id: 'toon3d', label: '3D-Animation' },
  { id: 'fantasy', label: 'Märchen-Illustration' },
  { id: 'watercolor', label: 'Aquarell' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'noir', label: 'Film Noir' },
  { id: 'papercut', label: 'Papierschnitt' },
  { id: 'neon', label: 'Neon-Graffiti' },
];

// Version der Hörproben in /public/voices (bei neuen Aufnahmen erhöhen → kein alter Cache)
export const VOICE_SAMPLE_VERSION = 5;

export const LANGUAGES = [
  { id: 'de', label: 'Deutsch', bcp47: 'de-DE' },
  { id: 'de-CH', label: 'Deutsch (Schweiz)', bcp47: 'de-CH' },
  { id: 'en', label: 'English', bcp47: 'en-US' },
  { id: 'fr', label: 'Français', bcp47: 'fr-FR' },
  { id: 'it', label: 'Italiano', bcp47: 'it-IT' },
  { id: 'es', label: 'Español', bcp47: 'es-ES' },
  { id: 'pt', label: 'Português', bcp47: 'pt-PT' },
  { id: 'hr', label: 'Hrvatski', bcp47: 'hr-HR' },
  { id: 'sr', label: 'Srpski', bcp47: 'sr-Latn-RS' },
  { id: 'bs', label: 'Bosanski', bcp47: 'bs-BA' },
  { id: 'sq', label: 'Shqip', bcp47: 'sq-AL' },
  { id: 'tr', label: 'Türkçe', bcp47: 'tr-TR' },
];
// Sprachen, die die Premium-Stimmen (ElevenLabs multilingual v2) offiziell beherrschen; sonst ähnliche Standard-Stimme
export const PREMIUM_VOICE_LANGS = ['de', 'de-CH', 'en', 'fr', 'it', 'es', 'pt', 'hr', 'tr'];

// Stimmen-Presets. "providerVoice" wird vom TTS-Modul auf echte Stimmen gemappt.
export const VOICES = [
  { id: 'calm-m', label: 'Ruhig (m)', pitch: 0.95, rate: 1.0, gender: 'male', providerVoice: { elevenlabs: 'pNInz6obpgDQGcFmaJgB', openai: 'onyx' } },
  { id: 'clear-m', label: 'Klar (m)', pitch: 1.0, rate: 1.0, gender: 'male', providerVoice: { elevenlabs: 'pNInz6obpgDQGcFmaJgB', openai: 'ash' } },
  { id: 'story-m', label: 'Erzähler (m)', pitch: 0.85, rate: 0.95, gender: 'male', providerVoice: { elevenlabs: 'VR6AewLTigWG4xSOukaG', openai: 'echo' } },
  { id: 'warm-f', label: 'Warm (w)', pitch: 1.05, rate: 1.0, gender: 'female', providerVoice: { elevenlabs: 'EXAVITQu4vr4xnSDxMaL', openai: 'coral' } },
  { id: 'soft-f', label: 'Sanft (w)', pitch: 1.0, rate: 0.97, gender: 'female', providerVoice: { elevenlabs: 'EXAVITQu4vr4xnSDxMaL', openai: 'sage' } },
  { id: 'energy-f', label: 'Energisch (w)', pitch: 1.15, rate: 1.1, gender: 'female', providerVoice: { elevenlabs: 'MF3mGyEYCl7XYWbV9V6O', openai: 'nova' } },
  // Premium-Stimmen (ElevenLabs) – in Daily und Pro. Fallback: ähnliche OpenAI-Stimme
  { id: 'el-daniel', label: 'Daniel – warm (m)', premium: true, gender: 'male', providerVoice: { elevenlabs: 'jdKpAe6rxAe99tFGbsAc', openai: 'onyx' } },
  { id: 'el-noah', label: 'Noah – klar (m)', premium: true, gender: 'male', providerVoice: { elevenlabs: 't7z7JVU64WYfp4GSw7aZ', openai: 'ash' } },
  { id: 'el-fiete', label: 'Fiete – locker (m)', premium: true, gender: 'male', providerVoice: { elevenlabs: 'kHfXYCwbOq00KgBegten', openai: 'echo' } },
  { id: 'el-clara', label: 'Clara – ruhig (w)', premium: true, gender: 'female', providerVoice: { elevenlabs: 'Wh9XzZGVJQVPkBBHqnp3', openai: 'sage' } },
  { id: 'el-lola', label: 'Lola – lebendig (w)', premium: true, gender: 'female', providerVoice: { elevenlabs: 'SiMvlSW9cKKHDYT4BzOp', openai: 'coral' } },
  { id: 'el-brian', label: 'Brian – gefühlvoll (m, EN)', premium: true, gender: 'male', providerVoice: { elevenlabs: 'nPczCjzI2devNBz1zQrb', openai: 'onyx' } },
];
export const PREMIUM_VOICE_PLANS = ['daily', 'pro'];

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
  // Neuere Stücke: eigene Akkordfolgen und Instrumente (kit) – ebenfalls komplett im Browser erzeugt, also lizenzfrei.
  { id: 'piano', label: 'Sanftes Klavier', mood: 'gefühlvoll', bpm: 72, root: 220, lp: 3200, chords: [[0, 3, 7, 12], [-4, 0, 3, 8], [3, 7, 10, 15], [-2, 2, 5, 10]],
    kit: { pad: 0.35, bass: [0], pluck: { decay: 1.6, gain: 0.5, notes: [[0, 0, 0], [0.5, 1, 0], [1, 2, 0], [1.5, 3, 0], [2, 2, 0], [2.5, 1, 0], [3, 2, 0], [3.5, 3, 0]] } } },
  { id: 'lofi', label: 'Lo-Fi Beat', mood: 'entspannt', bpm: 82, root: 174.61, lp: 2400, chords: [[0, 4, 7, 11], [-3, 0, 4, 7], [2, 5, 9, 12], [-5, -1, 2, 5]],
    kit: { pad: 0.3, bass: [0, 2.5], kick: [0, 2.5], snare: [1, 3], hat: 0.5, pluck: { decay: 0.7, gain: 0.32, notes: [[0, -1, 0], [1.5, -1, 0], [2.5, -1, 0]] } } },
  { id: 'dark', label: 'Düster', mood: 'unheimlich', bpm: 60, root: 73.42, lp: 1200, chords: [[0, 7, 12, 15], [0, 7, 13, 15], [0, 6, 12, 15], [0, 7, 12, 15]],
    kit: { drone: 0.9, pad: 0.5, heart: true, pluck: { decay: 2.4, gain: 0.22, notes: [[0, 3, 1], [2.5, 2, 1]] } } },
  { id: 'countdown', label: 'Countdown', mood: 'nervös', bpm: 100, root: 130.81, lp: 3600, chords: [[0, 3, 7, 12], [0, 3, 8, 12], [0, 2, 7, 12], [0, 3, 7, 10]],
    kit: { pad: 0.35, tick: true, bass: [0, 1, 2, 3], arp: { wave: 'triangle', div: 1, gain: 0.16, octave: 0 } } },
  { id: 'pulse', label: 'Technik-Puls', mood: 'modern', bpm: 118, root: 110, lp: 4200, chords: [[0, 3, 7, 12], [-4, 0, 3, 8], [3, 7, 10, 15], [-2, 2, 5, 10]],
    kit: { pad: 0.25, bass: [0, 1, 2, 3], kick: [0, 1, 2, 3], hat: 0.5, arp: { wave: 'square', div: 4, gain: 0.07, octave: 1 } } },
  { id: 'happy', label: 'Fröhlich', mood: 'verspielt', bpm: 120, root: 261.63, lp: 4200, chords: [[0, 4, 7, 12], [-5, -1, 2, 7], [-3, 0, 4, 9], [-7, -3, 0, 5]],
    kit: { pad: 0.2, bass: [0, 2], kick: [0, 2], snare: [1, 3], hat: 0.5, pluck: { decay: 0.3, gain: 0.42, notes: [[0, 0, 0], [0.5, 2, 0], [1, 1, 0], [1.5, 2, 0], [2, 0, 0], [2.5, 3, 0], [3, 2, 0], [3.5, 1, 0]] } } },
  { id: 'drums', label: 'Kino-Trommeln', mood: 'dramatisch', bpm: 96, root: 98, lp: 2600, chords: [[0, 7, 12, 15], [-4, 3, 8, 12], [-2, 5, 10, 14], [0, 7, 12, 19]],
    kit: { pad: 0.8, drone: 0.4, toms: [[0, 82], [0.75, 82], [1.5, 110], [2, 82], [3, 70], [3.5, 110]] } },
  { id: 'ambient', label: 'Weite', mood: 'schwebend', bpm: 60, root: 174.61, lp: 2800, chords: [[0, 7, 14, 16], [-5, 2, 9, 14], [-3, 4, 12, 16], [-7, 0, 9, 12]],
    kit: { pad: 1, shimmer: 0.06 } },
  { id: 'drive', label: 'Motivation', mood: 'antreibend', bpm: 104, root: 196, lp: 3800, chords: [[0, 4, 7, 12], [-3, 0, 4, 9], [-7, -3, 0, 5], [-5, -1, 2, 7]],
    kit: { pad: 0.4, bass: [0, 1.5, 2.5], kick: [0, 1, 2, 3], snare: [1, 3], hat: 0.5, from: 2, arp: { wave: 'triangle', div: 2, gain: 0.14, octave: 1 } } },
  { id: 'report', label: 'Reportage', mood: 'sachlich', bpm: 108, root: 146.83, lp: 3400, chords: [[0, 3, 7, 12], [0, 3, 7, 10], [-2, 2, 5, 10], [-4, 0, 3, 8]],
    kit: { pad: 0.3, bass: [0, 2], hat: 1, pluck: { decay: 0.22, gain: 0.34, notes: [[0, 0, 0], [0.5, 0, 0], [1, 2, 0], [1.5, 0, 0], [2, 1, 0], [2.5, 0, 0], [3, 2, 0], [3.5, 1, 0]] } } },
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

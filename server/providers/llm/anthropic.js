// Skript-Modul auf Basis von Claude (Anthropic SDK).
import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';
const client = new Anthropic(); // liest ANTHROPIC_API_KEY

const LANG_NAMES = { de: 'Deutsch', 'de-CH': 'Deutsch in Schweizer Schreibweise (ss statt ß)', en: 'English', fr: 'Français', it: 'Italiano', es: 'Español' };
const MOTIFS = ['pyramid', 'temple', 'castle', 'tower', 'wall', 'ship', 'field', 'city'];

const SYSTEM = `Du bist Autor:in für kurze, gesichtslose Social-Media-Videos (TikTok, Reels, Shorts, 30–50 Sekunden).
Regeln:
- Fakten müssen stimmen. Wenn etwas umstritten oder unsicher ist, formuliere vorsichtig („gilt als“, „etwa“).
- Keine erfundenen Zahlen, Zitate oder Quellen. Keine Clickbait-Lügen.
- Der Hook (erster Satz) muss in unter 3 Sekunden neugierig machen.
- Jede Szene: 1–2 kurze, gesprochene Sätze. Insgesamt 80–120 Wörter.
- "visual" beschreibt das Bild zur Szene auf Englisch für ein Bildmodell (ohne Text im Bild, ohne reale Personen erkennbar).
- Call-to-Action freundlich und ehrlich.`;

const scriptSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    hook: { type: 'string' },
    scenes: {
      type: 'array',
      items: {
        type: 'object',
        properties: { text: { type: 'string' }, visual: { type: 'string' } },
        required: ['text', 'visual'],
        additionalProperties: false,
      },
    },
    cta: { type: 'string' },
    motif: { type: 'string', enum: MOTIFS },
  },
  required: ['title', 'hook', 'scenes', 'cta', 'motif'],
  additionalProperties: false,
};

const planSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    episodes: {
      type: 'array',
      items: {
        type: 'object',
        properties: { key: { type: 'string' }, title: { type: 'string' }, motif: { type: 'string', enum: MOTIFS } },
        required: ['key', 'title', 'motif'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'description', 'episodes'],
  additionalProperties: false,
};

async function ask(prompt, schema) {
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', format: { type: 'json_schema', schema } },
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  });
  if (response.stop_reason === 'refusal') throw new Error('Das Thema wurde vom KI-Modell abgelehnt. Bitte wähle ein anderes Thema.');
  if (response.stop_reason === 'max_tokens') throw new Error('Antwort des KI-Modells war unvollständig. Bitte erneut versuchen.');
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return JSON.parse(text);
}

export default {
  name: 'anthropic',
  async planSeries({ niche, topic, language, count = 6 }) {
    return ask(
      `Plane eine Kurzvideo-Serie mit ${count} Folgen.\nNische: ${niche}\nThema: ${topic || '(frei innerhalb der Nische)'}\nSprache der Titel: ${LANG_NAMES[language] || 'Deutsch'}\nJede Folge braucht einen eindeutigen key (kebab-case), einen packenden Titel und ein passendes Bildmotiv.`,
      planSchema,
    );
  },
  async writeScript({ niche, topic, language, episodeTitle, seriesTitle }) {
    return ask(
      `Schreibe das Skript für eine Folge.\nSerie: ${seriesTitle || topic || niche}\nFolge: ${episodeTitle || topic}\nNische: ${niche}\nSprache: ${LANG_NAMES[language] || 'Deutsch'}\nAufbau: hook, 3–5 scenes, cta.`,
      scriptSchema,
    );
  },
};

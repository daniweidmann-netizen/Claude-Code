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
- LÄNGE STRIKT: Hook + 3–4 Szenen + CTA zusammen 70–110 Wörter (= 30–45 Sekunden gesprochen). Jede Szene höchstens 2 kurze Sätze.
- Jahreszahlen und Zahlen nur, wenn du dir sicher bist; sonst weglassen oder mit „um“/„etwa“ formulieren. Datum einer Erfindung ≠ Patentanmeldung ≠ Patenterteilung – nicht verwechseln.
- "visual" beschreibt das Bild zur Szene auf Englisch für ein Bildmodell (ohne Text im Bild, ohne reale Personen erkennbar).
- Call-to-Action freundlich und ehrlich.`;

const NICHE_HINT = {
  history: 'Nische Geschichte: nur gut belegte historische Fakten, Jahreszahlen prüfen, Mythen als Mythen kennzeichnen.',
  facts: 'Nische Fakten: nur überprüfbare, allgemein anerkannte Fakten; Zahlen gerundet und vorsichtig formulieren.',
  motivation: 'Nische Motivation: ehrliche, alltagstaugliche Impulse ohne Heilsversprechen, keine erfundenen Zitate berühmter Personen.',
  horror: 'Nische Horror: FIKTIVE Kurzgeschichte mit Spannungsbogen; keine realen Personen, Orte nur allgemein; im CTA als fiktiv kennzeichnen.',
  reddit: 'Nische Community-Stories: eigene FIKTIVE Alltagsgeschichte im Stil einer Erzählung aus dem Netz – keine echten Posts kopieren, keine echten Nutzernamen; im CTA als fiktiv kennzeichnen.',
  custom: 'Eigenes Thema des Nutzers: sachlich korrekt bleiben, bei Unsicherheit vorsichtig formulieren.',
};

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
    archiveQuery: { type: 'string', description: 'Kurzer englischer Suchbegriff für historische Archivbilder (Wikimedia), z. B. „Anglo-Zanzibar War“ oder „Napoleon Bonaparte“. Bei nicht-historischen Themen ein allgemeiner Begriff.' },
  },
  required: ['title', 'hook', 'scenes', 'cta', 'motif', 'archiveQuery'],
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
      `Plane eine Kurzvideo-Serie mit ${count} Folgen.\n${NICHE_HINT[niche] || ''}\nNische: ${niche}\nThema: ${topic || '(frei innerhalb der Nische)'}\nSprache der Titel: ${LANG_NAMES[language] || 'Deutsch'}\nJede Folge braucht einen eindeutigen key (kebab-case), einen packenden Titel und ein passendes Bildmotiv.`,
      planSchema,
    );
  },
  async writeScript({ niche, topic, language, episodeTitle, seriesTitle }) {
    return ask(
      `Schreibe das Skript für eine Folge.\n${NICHE_HINT[niche] || ''}\nSerie: ${seriesTitle || topic || niche}\nFolge: ${episodeTitle || topic}\nNische: ${niche}\nSprache: ${LANG_NAMES[language] || 'Deutsch'}\nAufbau: hook, 3–4 scenes, cta. Maximal 110 Wörter insgesamt.`,
      scriptSchema,
    );
  },
};

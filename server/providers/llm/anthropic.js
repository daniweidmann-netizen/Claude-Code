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
- LÄNGE STRIKT: Halte dich exakt an die vorgegebene Wortzahl (sie entspricht der gewünschten Videolänge). Jede Szene höchstens 2–3 kurze Sätze.
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
  characters: 'Nische Figuren-Geschichten: FIKTIVE Geschichte mit EINER wiederkehrenden Hauptfigur, die in jeder Folge etwas erlebt (Spannung, Gefühl, Wendung). Keine realen Personen. Bildbeschreibungen (visual) zeigen die Hauptfigur in Aktion und nennen sie immer „the main character“; Aussehen der Figur NICHT neu beschreiben, nur Handlung, Ort, Licht und Stimmung.',
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
  async planSeries({ niche, topic, language, count = 6, character }) {
    return ask(
      `Plane eine Kurzvideo-Serie mit ${count} Folgen.\n${NICHE_HINT[niche] || ''}\nNische: ${niche}\nThema: ${topic || '(frei innerhalb der Nische)'}\nSprache der Titel: ${LANG_NAMES[language] || 'Deutsch'}${character ? `\nHauptfigur der Serie: ${String(character).slice(0, 600)}` : ''}\nJede Folge braucht einen eindeutigen key (kebab-case), einen packenden Titel und ein passendes Bildmotiv.`,
      planSchema,
    );
  },
  async writeScript({ niche, topic, language, episodeTitle, seriesTitle, targetSeconds = 65, idea, notes, ownText, character }) {
    const lang = LANG_NAMES[language] || 'Deutsch';
    if (ownText) {
      // Eigener Text: wortgetreu übernehmen, nur aufteilen und Bildbeschreibungen ergänzen
      return ask(
        `Der Nutzer hat sein Skript selbst geschrieben. Übernimm den Text WORTWÖRTLICH – nichts umformulieren, kürzen, ergänzen oder übersetzen, auch keine Rechtschreibung ändern.\nAufgabe: Teile ihn in hook (erster Satz bzw. erste Aussage), scenes (je 1–3 Sätze, in Originalreihenfolge) und cta (letzter Satz, falls er wie ein Abschluss/Aufruf klingt – sonst leerer String). Zusammen müssen hook + scenes + cta exakt den Originaltext ergeben.\nErgänze pro Szene "visual" (englische Bildbeschreibung), dazu title (kurz, in der Sprache des Textes), motif und archiveQuery.\n\n<nutzertext>\n${String(ownText).slice(0, 6000)}\n</nutzertext>`,
        scriptSchema,
      );
    }
    // Erfahrungswert gesprochenes Tempo (inkl. Pausen): ca. 2,0–2,3 Wörter pro Sekunde
    const t = Math.min(180, Math.max(15, Number(targetSeconds) || 65));
    const minWords = Math.round(t * 2.0);
    const maxWords = Math.round(t * 2.3);
    const scenes = t >= 80 ? '6–8' : t >= 55 ? '5–7' : '3–4';
    const ideaBlock = idea
      ? `\nDer Nutzer hat eine EIGENE Video-Idee – setze genau diese um:\n<idee>${String(idea).slice(0, 1500)}</idee>${notes ? `\nHinweise/Fakten des Nutzers, die vorkommen sollen (auf Plausibilität achten, nichts Falsches übernehmen):\n<hinweise>${String(notes).slice(0, 3000)}</hinweise>` : ''}`
      : '';
    return ask(
      `Schreibe das Skript für eine Folge.\n${NICHE_HINT[niche] || ''}${ideaBlock}\nSerie: ${seriesTitle || topic || niche}\nFolge: ${idea ? '(aus der Idee ableiten)' : episodeTitle || topic}\nNische: ${niche}\nSprache: ${lang}\nAufbau: hook, ${scenes} scenes, cta.\nGewünschte Videolänge: ${t} Sekunden → insgesamt ${minWords}–${maxWords} Wörter (Hook + Szenen + CTA). ${t >= 60 ? 'Wichtig: Das Video muss über 60 Sekunden lang sein – lieber etwas mehr als zu wenig Text.' : ''}${character ? `\nHauptfigur (immer dieselbe Person, im visual als „the main character“ bezeichnen): ${String(character).slice(0, 600)}` : ''}`,
      scriptSchema,
    );
  },
};

// Mock-Inhalte für den Prototyp (Nische "Geschichte").
// Wird vom Server-Mock-LLM UND als Offline-Fallback im Browser verwendet.
// Alle Fakten sind gängiges, überprüfbares Geschichtswissen – vor Veröffentlichung trotzdem gegenlesen.

const HISTORY = [
  {
    id: 'zanzibar',
    motif: 'ship',
    de: {
      title: 'Der kürzeste Krieg der Geschichte',
      hook: 'Dieser Krieg war vorbei, bevor du deinen Kaffee ausgetrunken hättest.',
      scenes: [
        { text: 'Am 27. August 1896 erklärte Grossbritannien dem Sultanat Sansibar den Krieg.', visual: 'British warships in a tropical harbour at dawn' },
        { text: 'Grund war ein neuer Sultan, der sich ohne britische Zustimmung an die Macht gesetzt hatte.', visual: 'Palace by the sea, flags in the wind' },
        { text: 'Um kurz nach neun Uhr eröffneten die Schiffe das Feuer auf den Palast.', visual: 'Smoke rising over a coastal palace' },
        { text: 'Nach etwa 38 bis 45 Minuten war alles vorbei. Bis heute gilt er als kürzester Krieg, der je dokumentiert wurde.', visual: 'Calm harbour after the battle, clock tower' },
      ],
      cta: 'Folge der Serie für mehr Geschichte in unter einer Minute.',
    },
    en: {
      title: 'The shortest war in history',
      hook: 'This war was over before you could finish your coffee.',
      scenes: [
        { text: 'On 27 August 1896, Britain went to war with the Sultanate of Zanzibar.', visual: 'British warships in a tropical harbour at dawn' },
        { text: 'The reason: a new sultan had taken power without British approval.', visual: 'Palace by the sea, flags in the wind' },
        { text: 'Shortly after nine in the morning, the ships opened fire on the palace.', visual: 'Smoke rising over a coastal palace' },
        { text: 'About 38 to 45 minutes later it was over – still considered the shortest war ever recorded.', visual: 'Calm harbour after the battle, clock tower' },
      ],
      cta: 'Follow the series for more history in under a minute.',
    },
  },
  {
    id: 'cleopatra',
    motif: 'pyramid',
    de: {
      title: 'Kleopatra und die Mondlandung',
      hook: 'Kleopatra lebte zeitlich näher an der Mondlandung als am Bau der grossen Pyramide.',
      scenes: [
        { text: 'Die Cheops-Pyramide in Gizeh wurde um 2560 vor Christus fertiggestellt.', visual: 'Great pyramid of Giza under a golden sky' },
        { text: 'Kleopatra die Siebte starb im Jahr 30 vor Christus. Da war die Pyramide schon rund 2500 Jahre alt.', visual: 'Egyptian queen silhouette in front of ancient ruins' },
        { text: 'Die erste Mondlandung war 1969 – also etwa 2000 Jahre nach Kleopatra.', visual: 'Moon over the desert at night' },
        { text: 'Für Kleopatra waren die Pyramiden also schon antike Ruinen.', visual: 'Pyramids at dusk with stars appearing' },
      ],
      cta: 'Welcher Zeit-Fakt hat dich überrascht? Folge für Teil 2.',
    },
    en: {
      title: 'Cleopatra and the Moon landing',
      hook: 'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.',
      scenes: [
        { text: 'The Great Pyramid of Giza was completed around 2560 BC.', visual: 'Great pyramid of Giza under a golden sky' },
        { text: 'Cleopatra the Seventh died in 30 BC. By then, the pyramid was already about 2,500 years old.', visual: 'Egyptian queen silhouette in front of ancient ruins' },
        { text: 'The first Moon landing was in 1969 – roughly 2,000 years after Cleopatra.', visual: 'Moon over the desert at night' },
        { text: 'To Cleopatra, the pyramids were already ancient ruins.', visual: 'Pyramids at dusk with stars appearing' },
      ],
      cta: 'Which time fact surprised you? Follow for part 2.',
    },
  },
  {
    id: 'emu',
    motif: 'field',
    de: {
      title: 'Der Emu-Krieg',
      hook: '1932 zog Australiens Armee gegen einen ungewöhnlichen Gegner ins Feld: Emus.',
      scenes: [
        { text: 'In Westaustralien frassen zehntausende Emus die Weizenfelder der Farmer leer.', visual: 'Wide wheat fields in Western Australia' },
        { text: 'Die Regierung schickte Soldaten mit zwei Maschinengewehren.', visual: 'Old army truck on a dusty outback road' },
        { text: 'Doch die Vögel waren schnell, verteilten sich und waren schwer zu treffen.', visual: 'Flock of emus running across the plains' },
        { text: 'Nach wenigen Wochen wurde der Einsatz abgebrochen. Die Emus gelten bis heute als inoffizielle Sieger.', visual: 'Sunset over the outback, emus in silhouette' },
      ],
      cta: 'Mehr schräge Geschichte? Folge der Serie.',
    },
    en: {
      title: 'The Great Emu War',
      hook: 'In 1932, Australia’s army went to war against an unusual enemy: emus.',
      scenes: [
        { text: 'In Western Australia, tens of thousands of emus were devouring farmers’ wheat fields.', visual: 'Wide wheat fields in Western Australia' },
        { text: 'The government sent soldiers with two machine guns.', visual: 'Old army truck on a dusty outback road' },
        { text: 'But the birds were fast, scattered quickly and were hard to hit.', visual: 'Flock of emus running across the plains' },
        { text: 'After a few weeks the operation was called off. The emus are still seen as the unofficial winners.', visual: 'Sunset over the outback, emus in silhouette' },
      ],
      cta: 'Want more strange history? Follow the series.',
    },
  },
  {
    id: 'napoleon',
    motif: 'castle',
    de: {
      title: 'War Napoleon wirklich klein?',
      hook: 'Napoleon war gar nicht klein. Der Mythos hat eine überraschende Erklärung.',
      scenes: [
        { text: 'Nach heutigen Schätzungen war Napoleon etwa 1,69 Meter gross – für seine Zeit eher durchschnittlich.', visual: 'Portrait silhouette of an emperor in a grand hall' },
        { text: 'Das Problem: Französische Zoll waren länger als englische. Fünf Fuss zwei klang in England nach sehr wenig.', visual: 'Old measuring rulers and documents on a desk' },
        { text: 'Dazu kamen britische Karikaturisten, die ihn als „Little Boney“ verspotteten.', visual: 'Satirical newspaper cartoons from the 1800s' },
        { text: 'Propaganda und ein Umrechnungsfehler – fertig war ein Mythos, der 200 Jahre hält.', visual: 'Castle on a hill at sunset' },
      ],
      cta: 'Kennst du noch einen Geschichts-Mythos? Folge für den nächsten.',
    },
    en: {
      title: 'Was Napoleon really short?',
      hook: 'Napoleon wasn’t actually short. The myth has a surprising explanation.',
      scenes: [
        { text: 'Modern estimates put Napoleon at about 1.69 metres – roughly average for his time.', visual: 'Portrait silhouette of an emperor in a grand hall' },
        { text: 'The catch: French inches were longer than English ones. Five foot two sounded tiny in England.', visual: 'Old measuring rulers and documents on a desk' },
        { text: 'On top of that, British cartoonists mocked him as “Little Boney”.', visual: 'Satirical newspaper cartoons from the 1800s' },
        { text: 'Propaganda plus a conversion error – and a myth was born that has lasted 200 years.', visual: 'Castle on a hill at sunset' },
      ],
      cta: 'Know another history myth? Follow for the next one.',
    },
  },
  {
    id: 'berlin',
    motif: 'wall',
    de: {
      title: 'Der Zettel, der die Mauer öffnete',
      hook: 'Die Berliner Mauer fiel wegen eines Satzes, der so nicht geplant war.',
      scenes: [
        { text: 'Am 9. November 1989 stellte Günter Schabowski auf einer Pressekonferenz neue Reiseregeln vor.', visual: 'Press conference room with microphones, 1980s' },
        { text: 'Auf die Frage, ab wann sie gelten, sagte er: „sofort, unverzüglich.“', visual: 'Close up of papers and a microphone' },
        { text: 'Tausende strömten noch am selben Abend an die Grenzübergänge.', visual: 'Crowd at a border crossing at night' },
        { text: 'Kurz vor Mitternacht öffneten Grenzer an der Bornholmer Strasse die Schlagbäume.', visual: 'Wall at night with people celebrating' },
      ],
      cta: 'Folge der Serie für mehr Momente, die Geschichte geschrieben haben.',
    },
    en: {
      title: 'The note that opened the Wall',
      hook: 'The Berlin Wall fell because of a sentence that wasn’t supposed to be said.',
      scenes: [
        { text: 'On 9 November 1989, Günter Schabowski presented new travel rules at a press conference.', visual: 'Press conference room with microphones, 1980s' },
        { text: 'Asked when they would take effect, he said: “immediately, without delay.”', visual: 'Close up of papers and a microphone' },
        { text: 'That same evening, thousands rushed to the border crossings.', visual: 'Crowd at a border crossing at night' },
        { text: 'Shortly before midnight, guards at Bornholmer Strasse opened the barriers.', visual: 'Wall at night with people celebrating' },
      ],
      cta: 'Follow the series for more moments that made history.',
    },
  },
  {
    id: 'oxford',
    motif: 'temple',
    de: {
      title: 'Älter als das Aztekenreich',
      hook: 'Die Universität Oxford ist älter als das Aztekenreich.',
      scenes: [
        { text: 'In Oxford wurde bereits 1096 unterrichtet.', visual: 'Old stone university building with towers' },
        { text: 'Tenochtitlan, die Hauptstadt der Azteken, wurde erst um 1325 gegründet.', visual: 'Ancient city on a lake with temples' },
        { text: 'Als dort die ersten Tempel entstanden, lehrte man in Oxford schon über 200 Jahre.', visual: 'Aztec temple pyramid at sunrise' },
        { text: 'Geschichte verläuft eben nicht so, wie unser Bauchgefühl es erwartet.', visual: 'Split view of a medieval town and an ancient temple' },
      ],
      cta: 'Mehr überraschende Zeitlinien? Folge der Serie.',
    },
    en: {
      title: 'Older than the Aztec Empire',
      hook: 'Oxford University is older than the Aztec Empire.',
      scenes: [
        { text: 'Teaching took place in Oxford as early as 1096.', visual: 'Old stone university building with towers' },
        { text: 'Tenochtitlan, the Aztec capital, was only founded around 1325.', visual: 'Ancient city on a lake with temples' },
        { text: 'When its first temples rose, Oxford had been teaching for over 200 years.', visual: 'Aztec temple pyramid at sunrise' },
        { text: 'History rarely follows our gut feeling.', visual: 'Split view of a medieval town and an ancient temple' },
      ],
      cta: 'Want more surprising timelines? Follow the series.',
    },
  },
];

import { TRANSLATIONS, SERIES_TITLES, CUSTOM_TEXT } from './mockScriptsI18n.js';

// Übersetzungen (FR/IT/ES) einhängen; Bildbeschreibungen (englisch) werden aus EN übernommen
for (const h of HISTORY) {
  for (const [lang, t] of Object.entries(TRANSLATIONS[h.id] || {})) {
    h[lang] = { ...t, scenes: t.scenes.map((text, i) => ({ text, visual: h.en.scenes[i].visual })) };
  }
}

const pickLang = (lang) => {
  const l = (lang || 'de').slice(0, 2);
  return ['de', 'en', 'fr', 'it', 'es'].includes(l) ? l : 'en';
};

export function mockSeriesPlan({ niche, topic, language }) {
  const l = pickLang(language);
  if (niche === 'history') {
    const titles = {
      de: { title: 'Geschichte in 45 Sekunden', description: 'Überraschende Momente der Weltgeschichte – kurz, korrekt, packend.' },
      en: { title: 'History in 45 seconds', description: 'Surprising moments in world history – short, accurate, gripping.' },
      ...SERIES_TITLES,
    }[l];
    return { ...titles, episodes: HISTORY.map((h) => ({ key: h.id, title: (h[l] || h.en).title, motif: h.motif })) };
  }
  const t = topic || ({ de: 'dein Thema', fr: 'ton sujet', it: 'il tuo tema', es: 'tu tema' }[l] || 'your topic');
  const partTitle = (n) => (CUSTOM_TEXT[l] ? CUSTOM_TEXT[l](t).part(n) : l === 'de' ? `${t} – Teil ${n}` : `${t} – Part ${n}`);
  return {
    title: t,
    description: l === 'de' ? `Serie rund um „${t}“. (Platzhalter – mit verbundenem LLM plant die KI echte Folgen.)` : `Series about “${t}”. (Placeholder – with a connected LLM the AI plans real episodes.)`,
    episodes: [1, 2, 3, 4, 5].map((n) => ({ key: `custom-${n}`, title: partTitle(n), motif: ['city', 'field', 'tower', 'temple', 'ship'][n - 1] })),
  };
}

export function mockScript({ niche, topic, language, episodeKey, episodeTitle }) {
  const l = pickLang(language);
  const h = HISTORY.find((x) => x.id === episodeKey) || (niche === 'history' ? HISTORY[0] : null);
  if (h) return { ...(h[l] || h.en), motif: h.motif, notice: null };
  const t = topic || episodeTitle || 'Thema';
  if (CUSTOM_TEXT[l]) {
    const c = CUSTOM_TEXT[l](t);
    return {
      title: episodeTitle || t, motif: 'city', notice: c.notice, hook: c.hook, cta: c.cta,
      scenes: [1, 2, 3].map((n) => ({ text: c.scene(n), visual: `${t}, scene ${n}` })),
    };
  }
  const de = l === 'de';
  return {
    title: episodeTitle || t,
    motif: 'city',
    notice: de
      ? 'Platzhalter-Skript: Verbinde ein LLM (z. B. LLM_PROVIDER=anthropic), damit TrueReel echte Inhalte zu deinem Thema schreibt. Du kannst den Text auch direkt bearbeiten.'
      : 'Placeholder script: connect an LLM (e.g. LLM_PROVIDER=anthropic) so TrueReel writes real content for your topic. You can also edit the text directly.',
    hook: de ? `Drei Dinge über ${t}, die kaum jemand weiss.` : `Three things about ${t} almost nobody knows.`,
    scenes: [1, 2, 3].map((n) => ({
      text: de ? `Punkt ${n}: Hier steht ein spannender Fakt über ${t}. Bearbeite diesen Text im Editor.` : `Point ${n}: an interesting fact about ${t} goes here. Edit this text in the editor.`,
      visual: `${t}, scene ${n}`,
    })),
    cta: de ? 'Folge für mehr davon.' : 'Follow for more.',
  };
}

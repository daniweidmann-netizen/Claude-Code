// SEO-Seiten „KI-Video-Generator“ pro Nische (/tools/:slug englisch, /ki-video-generator/:slug deutsch).
// Nur ehrliche, nachprüfbare Aussagen über TrueReel – keine Einkommensversprechen, keine Aussagen über Mitbewerber.

export const TOOL_BASE = { en: '/tools', de: '/ki-video-generator' };
export const TOOLS_UPDATED = '2026-11-21';

const COMMON = {
  en: {
    steps: [['Enter a topic', 'Type a topic or pick a series idea. The AI writes a hook, the story and a call to action.'], ['Check the preview', 'Images, voice and captions are created automatically. Change any text, image or voice before posting.'], ['Post or schedule', 'Download the MP4 in 1080p or upload it directly to YouTube Shorts on a schedule.']],
    faqTitle: 'Questions', examplesTitle: 'Example hooks', stepsTitle: 'How it works', tryTitle: 'Try it now – free, no account', trySub: 'Enter a topic and get a hook and short script in seconds.',
    others: 'Other video generators', cta: 'Create your first video free', note: 'Images and voices are AI-generated. Label AI content when you post it.',
    indexTitle: 'AI video generators for faceless short videos', indexDescription: 'Free-to-try AI generators for faceless TikToks, Reels and YouTube Shorts: facts, motivation, history, scary stories, animal stories, POV and product ads.',
  },
  de: {
    steps: [['Thema eingeben', 'Gib ein Thema ein oder wähle eine Serien-Idee. Die KI schreibt Hook, Geschichte und Aufruf zum Schluss.'], ['Vorschau prüfen', 'Bilder, Stimme und Untertitel entstehen automatisch. Jeden Text, jedes Bild und die Stimme kannst du vor dem Posten ändern.'], ['Posten oder planen', 'MP4 in 1080p herunterladen oder nach Zeitplan direkt auf YouTube Shorts hochladen.']],
    faqTitle: 'Fragen', examplesTitle: 'Beispiel-Hooks', stepsTitle: 'So funktioniert es', tryTitle: 'Jetzt testen – gratis, ohne Konto', trySub: 'Gib ein Thema ein und erhalte in Sekunden einen Hook und ein kurzes Skript.',
    others: 'Weitere Video-Generatoren', cta: 'Erstes Video gratis erstellen', note: 'Bilder und Stimmen sind KI-generiert. Kennzeichne KI-Inhalte beim Posten.',
    indexTitle: 'KI-Video-Generatoren für Faceless-Kurzvideos', indexDescription: 'KI-Generatoren für gesichtslose TikToks, Reels und YouTube Shorts – Fakten, Motivation, Geschichte, Gruselgeschichten, Tiergeschichten, POV und Produktwerbung. Gratis testen.',
  },
};
export const toolText = (lang) => COMMON[lang];

export const TOOLS = [
  {
    id: 'facts',
    en: { slug: 'ai-facts-video-generator', name: 'Facts videos', title: 'AI Facts Video Generator for TikTok, Reels & Shorts', description: 'Turn any topic into a faceless facts video with script, AI images, voice-over and captions. Try free, no credit card.',
      intro: 'Facts videos work because they open a curiosity gap in the first second. TrueReel writes the hook, checks that numbers are phrased carefully and turns the script into a finished vertical video.',
      examples: ['This animal survived outer space – and came back alive.', 'Hardly anyone knows why the Eiffel Tower is taller in summer.', 'Your phone has more computing power than the Apollo 11 computer – by a lot.'],
      topics: ['Why the sky is blue', 'The smallest country in the world', 'How deep the ocean really is'],
      faq: [['Are the facts checked?', 'The AI is instructed to use only well-established facts and to phrase uncertain numbers carefully. You review every script before posting.'], ['How long are the videos?', 'You choose: short (about 20–30 seconds) for growth or over 60 seconds for TikTok monetization.'], ['Can I post them myself?', 'Yes. Download the MP4 in 1080p or let TrueReel upload to YouTube Shorts on a schedule.']] },
    de: { slug: 'fakten', name: 'Fakten-Videos', title: 'KI-Fakten-Video-Generator für TikTok, Reels & Shorts', description: 'Mach aus jedem Thema ein gesichtsloses Fakten-Video mit Skript, KI-Bildern, Stimme und Untertiteln. Gratis testen, ohne Kreditkarte.',
      intro: 'Fakten-Videos funktionieren, weil sie in der ersten Sekunde neugierig machen. TrueReel schreibt den Hook, formuliert unsichere Zahlen vorsichtig und macht daraus ein fertiges Hochformat-Video.',
      examples: ['Dieses Tier hat das Weltall überlebt – und kam lebend zurück.', 'Kaum jemand weiss, warum der Eiffelturm im Sommer höher ist.', 'Dein Handy rechnet um ein Vielfaches schneller als der Computer von Apollo 11.'],
      topics: ['Warum der Himmel blau ist', 'Das kleinste Land der Welt', 'Wie tief das Meer wirklich ist'],
      faq: [['Werden die Fakten geprüft?', 'Die KI darf nur gut belegte Fakten verwenden und formuliert unsichere Zahlen vorsichtig. Du siehst jedes Skript vor dem Posten.'], ['Wie lang sind die Videos?', 'Du wählst: kurz (ca. 20–30 Sekunden) für Wachstum oder über 60 Sekunden für die TikTok-Monetarisierung.'], ['Kann ich selbst posten?', 'Ja. MP4 in 1080p herunterladen oder von TrueReel nach Zeitplan auf YouTube Shorts hochladen lassen.']] },
  },
  {
    id: 'motivation',
    en: { slug: 'ai-motivational-video-generator', name: 'Motivational videos', title: 'AI Motivational Video Generator – Faceless & Honest', description: 'Create faceless motivational shorts with calm voice-overs, cinematic images and captions – without fake quotes. Try free.',
      intro: 'Motivation content grows when it feels personal and practical. TrueReel writes short, honest impulses for everyday life – no invented quotes from famous people, no miracle promises.',
      examples: ['The hard truth: discipline is just a habit you have not built yet.', 'Let me save you years: stop waiting to feel ready.', 'You might disagree, but rest is part of the work.'],
      topics: ['How to stop procrastinating', 'Small habits that change your life', 'Why consistency beats talent'],
      faq: [['Does it use real quotes?', 'No invented quotes. The AI writes original impulses and only quotes people if you provide a verified quote.'], ['Which voices are available?', 'Calm and energetic voices in 12 languages, including natural premium voices.'], ['Can I build a daily series?', 'Yes. Set up a series once and get a new video on your schedule.']] },
    de: { slug: 'motivation', name: 'Motivations-Videos', title: 'KI-Motivations-Video-Generator – gesichtslos & ehrlich', description: 'Erstelle gesichtslose Motivations-Shorts mit ruhiger Stimme, filmischen Bildern und Untertiteln – ohne erfundene Zitate. Gratis testen.',
      intro: 'Motivations-Inhalte wachsen, wenn sie persönlich und alltagstauglich sind. TrueReel schreibt kurze, ehrliche Impulse – keine erfundenen Zitate berühmter Personen, keine Heilsversprechen.',
      examples: ['Die harte Wahrheit: Disziplin ist nur eine Gewohnheit, die du noch nicht aufgebaut hast.', 'Lass mich dir Jahre sparen: Hör auf zu warten, bis du dich bereit fühlst.', 'Du wirst das vielleicht anders sehen, aber: Pausen gehören zur Arbeit.'],
      topics: ['Wie man aufhört aufzuschieben', 'Kleine Gewohnheiten mit grosser Wirkung', 'Warum Dranbleiben Talent schlägt'],
      faq: [['Werden echte Zitate verwendet?', 'Keine erfundenen Zitate. Die KI schreibt eigene Impulse und zitiert nur, wenn du ein belegtes Zitat angibst.'], ['Welche Stimmen gibt es?', 'Ruhige und energische Stimmen in 12 Sprachen, inklusive natürlicher Premium-Stimmen.'], ['Geht eine tägliche Serie?', 'Ja. Serie einmal einrichten und nach Zeitplan neue Videos erhalten.']] },
  },
  {
    id: 'history',
    en: { slug: 'ai-history-video-generator', name: 'History videos', title: 'AI History Video Generator – Myths, Moments & Mysteries', description: 'Create faceless history shorts with archive-style images, voice-over and captions. Myths are labeled as myths. Try free.',
      intro: 'History shorts are a popular faceless format: surprising moments, famous myths and real mysteries. TrueReel keeps dates careful, labels myths as myths and can use public-domain archive images.',
      examples: ['Vikings never wore horned helmets – so where does the myth come from?', 'The shortest war in history lasted less than an hour.', 'This ship kept sailing – but no one was left on board.'],
      topics: ['The shortest war in history', 'Was Napoleon really short?', 'The Mary Celeste mystery'],
      faq: [['Are the dates correct?', 'The AI is told to use well-documented facts only and to phrase uncertain dates carefully. You review every script.'], ['Where do the images come from?', 'AI-generated images, or public-domain archive images for historical topics where available.'], ['Can I make multi-part series?', 'Yes – cliffhanger series like “Part 1/2” work very well for history topics.']] },
    de: { slug: 'geschichte', name: 'Geschichts-Videos', title: 'KI-Geschichts-Video-Generator – Mythen, Momente & Rätsel', description: 'Erstelle gesichtslose Geschichts-Shorts mit Archiv-Bildern, Stimme und Untertiteln. Mythen werden als Mythen gekennzeichnet. Gratis testen.',
      intro: 'Geschichts-Shorts sind ein beliebtes Faceless-Format: überraschende Momente, bekannte Mythen und echte Rätsel. TrueReel geht vorsichtig mit Jahreszahlen um, kennzeichnet Mythen und nutzt wo möglich gemeinfreie Archivbilder.',
      examples: ['Wikinger trugen nie Hörnerhelme – woher kommt der Mythos?', 'Der kürzeste Krieg der Geschichte dauerte keine Stunde.', 'Dieses Schiff segelte weiter – aber niemand war mehr an Bord.'],
      topics: ['Der kürzeste Krieg der Geschichte', 'War Napoleon wirklich klein?', 'Das Rätsel der Mary Celeste'],
      faq: [['Stimmen die Jahreszahlen?', 'Die KI darf nur gut belegte Fakten verwenden und formuliert Unsicheres vorsichtig. Du prüfst jedes Skript.'], ['Woher kommen die Bilder?', 'KI-Bilder oder – bei historischen Themen, wo verfügbar – gemeinfreie Archivbilder.'], ['Gehen mehrteilige Serien?', 'Ja – Cliffhanger-Serien wie „Teil 1/2“ funktionieren bei Geschichte besonders gut.']] },
  },
  {
    id: 'scary',
    en: { slug: 'ai-scary-story-video-generator', name: 'Scary story videos', title: 'AI Scary Story Video Generator – Faceless Horror Shorts', description: 'Create fictional horror stories with tension, dark images, a fitting voice and captions. Clearly labeled as fiction. Try free.',
      intro: 'Short horror stories keep people watching until the last second. TrueReel writes fictional stories with a real tension arc and labels them as fiction – no real people, no real crime cases.',
      examples: ['I heard my name from the basement. I live alone.', 'The new house had one rule: never open the third door.', 'Every night at 3:17 the baby monitor turned on by itself.'],
      topics: ['A cabin in the woods at night', 'The last train of the night', 'A voice on the baby monitor'],
      faq: [['Are the stories real?', 'No. They are fictional and labeled as such in the call to action.'], ['Can I choose the style?', 'Yes – cinematic, film noir, anime, comic and more.'], ['How long are they?', 'You choose between short videos and stories over 60 seconds.']] },
    de: { slug: 'gruselgeschichten', name: 'Gruselgeschichten', title: 'KI-Gruselgeschichten-Generator – Faceless Horror-Shorts', description: 'Erstelle erfundene Gruselgeschichten mit Spannung, dunklen Bildern, passender Stimme und Untertiteln. Klar als Fiktion gekennzeichnet. Gratis testen.',
      intro: 'Kurze Gruselgeschichten halten die Leute bis zur letzten Sekunde. TrueReel schreibt erfundene Geschichten mit echtem Spannungsbogen und kennzeichnet sie als Fiktion – keine realen Personen, keine echten Kriminalfälle.',
      examples: ['Ich hörte meinen Namen aus dem Keller. Ich wohne allein.', 'Das neue Haus hatte eine Regel: Öffne nie die dritte Tür.', 'Jede Nacht um 3:17 Uhr schaltete sich das Babyfon von selbst ein.'],
      topics: ['Eine Hütte im Wald bei Nacht', 'Der letzte Zug der Nacht', 'Eine Stimme im Babyfon'],
      faq: [['Sind die Geschichten echt?', 'Nein. Sie sind erfunden und werden im Schluss-Satz als Fiktion gekennzeichnet.'], ['Kann ich den Stil wählen?', 'Ja – filmisch, Film Noir, Anime, Comic und mehr.'], ['Wie lang sind sie?', 'Du wählst zwischen kurzen Videos und Geschichten über 60 Sekunden.']] },
  },
  {
    id: 'animals',
    en: { slug: 'ai-animal-story-video-generator', name: 'Animal story videos', title: 'AI Animal Story Video Generator – Emotional & Faceless', description: 'Create touching animal stories – rescue, loyalty, goodbye and hope – with an emotional voice, consistent animal images and captions. Try free.',
      intro: 'Emotional animal stories are a popular faceless format. TrueReel keeps the same animal in every scene, uses an expressive voice and labels fictional stories – emotional, but never cruel.',
      examples: ['He waited at the same bus stop every day at 5 pm.', 'Nobody chose him at the shelter – until a little girl did.', 'She walked 40 miles to find her way home.'],
      topics: ['An old dog waiting for his owner', 'A cat rescued from the rain', 'A horse’s last day at work'],
      faq: [['Does the animal look the same in every scene?', 'Yes – the AI describes the same animal (breed, fur, features) in every scene.'], ['Is there an emotional voice?', 'Yes, premium voices can speak softly, sadly or hopefully.'], ['Are the stories true?', 'They are fictional by default and labeled as such, unless you base them on a documented real event.']] },
    de: { slug: 'tiergeschichten', name: 'Tiergeschichten', title: 'KI-Tiergeschichten-Generator – berührend & gesichtslos', description: 'Erstelle berührende Tiergeschichten – Rettung, Treue, Abschied und Hoffnung – mit gefühlvoller Stimme, gleichbleibendem Tier und Untertiteln. Gratis testen.',
      intro: 'Bewegende Tiergeschichten sind ein beliebtes Faceless-Format. TrueReel zeigt in jeder Szene dasselbe Tier, nutzt eine ausdrucksstarke Stimme und kennzeichnet erfundene Geschichten – emotional, aber nie grausam.',
      examples: ['Er wartete jeden Tag um 17 Uhr an derselben Bushaltestelle.', 'Im Tierheim wollte ihn niemand – bis ein kleines Mädchen kam.', 'Sie lief 60 Kilometer, um nach Hause zu finden.'],
      topics: ['Ein alter Hund wartet auf sein Herrchen', 'Eine Katze, aus dem Regen gerettet', 'Der letzte Arbeitstag eines Pferdes'],
      faq: [['Sieht das Tier in jeder Szene gleich aus?', 'Ja – die KI beschreibt in jeder Szene dasselbe Tier (Rasse, Fell, Merkmale).'], ['Gibt es eine gefühlvolle Stimme?', 'Ja, Premium-Stimmen können leise, traurig oder hoffnungsvoll sprechen.'], ['Sind die Geschichten wahr?', 'Standardmässig erfunden und so gekennzeichnet – ausser du nennst ein belegtes, echtes Ereignis.']] },
  },
  {
    id: 'pov',
    en: { slug: 'ai-pov-video-generator', name: 'POV videos', title: 'AI POV Video Generator – “POV: you live in 1347”', description: 'Create first-person POV time-travel videos: daily life in another era with immersive images, voice and captions. Try free.',
      intro: 'POV time-travel videos let viewers experience a day in another era – food, work, dangers and surprises. TrueReel writes them in the second person with well-documented details and first-person images.',
      examples: ['POV: you live in Florence in 1347 – and something is wrong with the rats.', 'POV: you are a Roman soldier on your first day at Hadrian’s Wall.', 'POV: you work in a Swiss watch workshop in 1900.'],
      topics: ['POV: a day in ancient Rome', 'POV: a sailor in 1700', 'POV: a medieval market day'],
      faq: [['Are the details historically accurate?', 'The AI is told to use well-documented everyday details and not to present clichés as facts.'], ['What do the images look like?', 'First-person shots in the chosen era – your own hands and feet partly visible, no real people.'], ['Can I pick the era?', 'Yes, or leave it open for variety.']] },
    de: { slug: 'pov', name: 'POV-Videos', title: 'KI-POV-Video-Generator – „POV: Du lebst im Jahr 1347“', description: 'Erstelle POV-Zeitreise-Videos aus der Ich-Perspektive: Alltag in einer anderen Epoche mit Bildern, Stimme und Untertiteln. Gratis testen.',
      intro: 'In POV-Zeitreise-Videos erleben Zuschauer einen Tag in einer anderen Epoche – Essen, Arbeit, Gefahren und Überraschungen. TrueReel schreibt sie in der Du-Form mit gut belegten Details und Bildern aus der Ich-Perspektive.',
      examples: ['POV: Du lebst 1347 in Florenz – und mit den Ratten stimmt etwas nicht.', 'POV: Du bist römischer Soldat, erster Tag am Hadrianswall.', 'POV: Du arbeitest um 1900 in einer Schweizer Uhrenwerkstatt.'],
      topics: ['POV: Ein Tag im alten Rom', 'POV: Seefahrer im Jahr 1700', 'POV: Markttag im Mittelalter'],
      faq: [['Stimmen die Details?', 'Die KI soll gut belegte Alltagsdetails verwenden und keine Klischees als Tatsachen darstellen.'], ['Wie sehen die Bilder aus?', 'Aufnahmen aus der Ich-Perspektive in der gewählten Epoche – eigene Hände und Füsse teils sichtbar, keine realen Personen.'], ['Kann ich die Epoche wählen?', 'Ja, oder offen lassen für Abwechslung.']] },
  },
  {
    id: 'product',
    en: { slug: 'ai-product-ad-video-generator', name: 'Product ad videos', title: 'AI Product Ad Video Generator – With Your Real Photos', description: 'Create short, honest ad videos for your shop, café or app using your real product photos. No invented reviews or numbers. Try free.',
      intro: 'Upload up to 6 photos of your product, add your facts and benefits – TrueReel writes a hook, shows your real photos in the product scenes and uses AI images only for everyday situations. Only your facts are used: no invented reviews, prices or numbers.',
      examples: ['Still drinking cold coffee at your desk? There is a better way.', 'Three reasons our sourdough takes 24 hours.', 'This phone case survived a 2-metre drop – here is why.'],
      topics: ['A café with homemade cakes', 'A handmade phone case shop', 'A yoga class for beginners'],
      faq: [['Are my real photos used?', 'Yes. Product scenes show your photos in full; AI images are only used for everyday situations.'], ['Will the AI invent claims?', 'No. It may only use the facts you enter – no made-up reviews, discounts or numbers.'], ['Is it labeled as AI?', 'Yes, videos include an AI notice, and you should label AI content when posting.']] },
    de: { slug: 'produktwerbung', name: 'Produktwerbung', title: 'KI-Werbevideo-Generator – mit deinen echten Produktfotos', description: 'Erstelle kurze, ehrliche Werbevideos für Shop, Café oder App mit deinen echten Produktfotos. Keine erfundenen Bewertungen oder Zahlen. Gratis testen.',
      intro: 'Lade bis zu 6 Fotos deines Produkts hoch und gib deine Fakten und Vorteile ein – TrueReel schreibt den Hook, zeigt in den Produkt-Szenen deine echten Fotos und nutzt KI-Bilder nur für Alltagssituationen. Es werden nur deine Fakten verwendet: keine erfundenen Bewertungen, Preise oder Zahlen.',
      examples: ['Trinkst du am Schreibtisch immer noch kalten Kaffee? Es geht besser.', 'Drei Gründe, warum unser Sauerteig 24 Stunden braucht.', 'Diese Handyhülle hat einen Sturz aus 2 Metern überlebt – darum.'],
      topics: ['Ein Café mit hausgemachten Kuchen', 'Ein Shop für handgemachte Handyhüllen', 'Ein Yoga-Kurs für Anfänger'],
      faq: [['Werden meine echten Fotos verwendet?', 'Ja. Produkt-Szenen zeigen deine Fotos ganz; KI-Bilder nur für Alltagssituationen.'], ['Erfindet die KI Aussagen?', 'Nein. Sie darf nur deine Angaben verwenden – keine erfundenen Bewertungen, Rabatte oder Zahlen.'], ['Wird es als KI gekennzeichnet?', 'Ja, die Videos enthalten einen KI-Hinweis, und du solltest KI-Inhalte beim Posten kennzeichnen.']] },
  },
  {
    id: 'shorts',
    en: { slug: 'faceless-youtube-shorts-generator', name: 'YouTube Shorts', title: 'Faceless YouTube Shorts Generator – Auto-Upload on a Schedule', description: 'Create faceless YouTube Shorts with AI script, images, voice and captions – and upload them to your channel on a schedule. Try free.',
      intro: 'Connect your YouTube channel once, create a series and TrueReel prepares a new Short on your schedule. By default nothing goes live without your approval – you can turn that off once you trust the results.',
      examples: ['Hardly anyone talks about this: …', 'Let me show you step by step how …', 'This sounds fake, but it is true: …'],
      topics: ['Strange laws around the world', 'Inventions from Switzerland', 'How bees make honey'],
      faq: [['Does it upload to YouTube automatically?', 'Yes, after you connect your channel. You can require approval before each post.'], ['Is the AI label set?', 'Yes, uploads are marked as altered or synthetic content where YouTube asks for it.'], ['What about TikTok and Instagram?', 'You can download each video in 1080p and post it there; direct posting is being added.']] },
    de: { slug: 'youtube-shorts', name: 'YouTube Shorts', title: 'Faceless-YouTube-Shorts-Generator – automatisch nach Zeitplan hochladen', description: 'Erstelle gesichtslose YouTube Shorts mit KI-Skript, Bildern, Stimme und Untertiteln – und lade sie nach Zeitplan auf deinen Kanal. Gratis testen.',
      intro: 'Verbinde deinen YouTube-Kanal einmal, erstelle eine Serie, und TrueReel bereitet nach deinem Zeitplan neue Shorts vor. Standardmässig geht nichts ohne deine Freigabe online – das kannst du abschalten, sobald du den Ergebnissen vertraust.',
      examples: ['Darüber spricht kaum jemand: …', 'Ich zeig dir Schritt für Schritt, wie …', 'Klingt erfunden, ist aber wahr: …'],
      topics: ['Seltsame Gesetze weltweit', 'Erfindungen aus der Schweiz', 'Wie Bienen Honig machen'],
      faq: [['Lädt es automatisch auf YouTube hoch?', 'Ja, nachdem du deinen Kanal verbunden hast. Auf Wunsch mit Freigabe vor jedem Post.'], ['Wird das KI-Label gesetzt?', 'Ja, Uploads werden als veränderte bzw. synthetische Inhalte markiert, wo YouTube das verlangt.'], ['Und TikTok und Instagram?', 'Jedes Video kannst du in 1080p herunterladen und dort posten; direktes Posten wird gerade ergänzt.']] },
  },
];

export function findTool(lang, slug) {
  const t = TOOLS.find((x) => x[lang]?.slug === slug);
  return t ? { tool: t, page: t[lang] } : null;
}

export type ProjectCategory = "unternehmen" | "shops" | "landingpages";

export interface ProjectStat {
  label: string;
  value: string;
}

export interface ProjectProcessStep {
  title: string;
  text: string;
}

export interface ProjectColor {
  name: string;
  hex: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  industry: string;
  goal: string;
  result: string;
  summary: string;
  tags: string[];
  gradient: [string, string, string];
  stats: ProjectStat[];
  problem: string;
  solution: string;
  process: ProjectProcessStep[];
  colors: ProjectColor[];
  typography: { display: string; body: string };
}

export const categoryLabels: Record<"alle" | ProjectCategory, string> = {
  alle: "Alle",
  unternehmen: "Unternehmen",
  shops: "Shops",
  landingpages: "Landingpages",
};

export const projects: Project[] = [
  {
    slug: "alpine-interiors",
    title: "Alpine Interiors",
    client: "Alpine Interiors AG",
    category: "unternehmen",
    categoryLabel: "Unternehmen",
    year: "2025",
    industry: "Möbel & Interior Design",
    goal: "Digitale Präsenz auf dem Niveau der physischen Showrooms",
    result: "+164% qualifizierte Anfragen in 90 Tagen",
    summary:
      "Ein digitaler Showroom für einen Schweizer Möbelhersteller, der Materialität und Ruhe in Bewegung übersetzt.",
    tags: ["Next.js", "TypeScript", "Framer Motion", "Sanity CMS"],
    gradient: ["#d8b478", "#7c6cf0", "#0b0c0f"],
    stats: [
      { label: "Anfragen", value: "+164%" },
      { label: "Ladezeit", value: "0.9s" },
      { label: "Lighthouse", value: "99/100" },
    ],
    problem:
      "Alpine Interiors fertigt Möbelstücke, die Jahrzehnte überdauern – die alte Webseite wirkte wie ein Katalog aus dem letzten Jahrzehnt. Kunden verließen die Seite, bevor sie die Qualität der Arbeit überhaupt wahrnehmen konnten.",
    solution:
      "Wir haben einen digitalen Showroom entworfen, der die Haptik der Materialien über große Bildkompositionen, ruhige Bewegungsabläufe und editoriale Typografie vermittelt. Jedes Produkt bekommt Raum zum Atmen, jede Interaktion fühlt sich handgefertigt an.",
    process: [
      { title: "Discovery", text: "Werksbesuch, Interviews mit dem Gründerteam, Analyse der Zielgruppe." },
      { title: "Art Direction", text: "Moodboards, Materialstudien, Typografie-System auf Basis der Markenwerte." },
      { title: "Prototyping", text: "Interaktive High-Fidelity-Prototypen mit echten Scroll- und Hover-Zuständen." },
      { title: "Entwicklung", text: "Next.js Frontend, Sanity als headless CMS, Performance-Budget von 1.2s." },
      { title: "Launch", text: "Stufenweiser Rollout mit A/B-Test der Startseite und Monitoring." },
    ],
    colors: [
      { name: "Alpine Sand", hex: "#D8B478" },
      { name: "Tiefschwarz", hex: "#0B0C0F" },
      { name: "Nebelgrau", hex: "#9A9AA4" },
      { name: "Ivory", hex: "#F4F3EF" },
    ],
    typography: { display: "Fraunces", body: "Inter" },
  },
  {
    slug: "vertex-capital",
    title: "Vertex Capital",
    client: "Vertex Capital Partners",
    category: "unternehmen",
    categoryLabel: "Unternehmen",
    year: "2024",
    industry: "Finanzberatung",
    goal: "Vertrauen und Substanz für ein neues Beratungsboutique",
    result: "3x mehr Erstgespräche über das Kontaktformular",
    summary:
      "Eine zurückhaltende, hochpräzise Markenwelt für eine Vermögensverwaltung, die auf Substanz statt Lautstärke setzt.",
    tags: ["Next.js", "TypeScript", "GSAP", "Tailwind CSS"],
    gradient: ["#5b8cff", "#0b0c0f", "#d8b478"],
    stats: [
      { label: "Erstgespräche", value: "3x" },
      { label: "Absprungrate", value: "-38%" },
      { label: "Ladezeit", value: "1.1s" },
    ],
    problem:
      "Ein neu gegründetes Beratungshaus brauchte digitale Präsenz, die sofort Vertrauen aufbaut – ohne die gängigen Finance-Klischees aus Stockfotos und blauen Anzügen.",
    solution:
      "Reduktion als Statement: viel Schwarzraum, präzise Zahlen-Animationen und eine restriktive Farbpalette. Bewegung wird sparsam und gezielt eingesetzt, um Aussagen zu unterstreichen statt abzulenken.",
    process: [
      { title: "Kennenlernen", text: "Positionierung im Wettbewerbsumfeld, Zielgruppen-Workshops." },
      { title: "Strategie", text: "Informationsarchitektur und Content-Strategie für komplexe Finanzthemen." },
      { title: "Design", text: "Editoriales Layout-System mit strengem Raster und Mikrotypografie." },
      { title: "Entwicklung", text: "Barrierefreie, performante Umsetzung mit serverseitigem Rendering." },
      { title: "Betreuung", text: "Kontinuierliche Content-Erweiterung und Performance-Monitoring." },
    ],
    colors: [
      { name: "Vertex Blue", hex: "#5B8CFF" },
      { name: "Obsidian", hex: "#0B0C0F" },
      { name: "Brass", hex: "#D8B478" },
      { name: "Ivory", hex: "#F4F3EF" },
    ],
    typography: { display: "Fraunces", body: "Inter" },
  },
  {
    slug: "nordlicht-living",
    title: "Nordlicht Living",
    client: "Nordlicht Living GmbH",
    category: "shops",
    categoryLabel: "Shops",
    year: "2025",
    industry: "Wohnaccessoires E-Commerce",
    goal: "Conversion-starker Shop mit editorialem Look",
    result: "+92% Conversion Rate, +47% Warenkorbwert",
    summary:
      "Ein Onlineshop für skandinavisches Wohndesign, der sich anfühlt wie ein Interior-Magazin – und trotzdem verkauft.",
    tags: ["Next.js", "Shopify", "Framer Motion", "TypeScript"],
    gradient: ["#52d9c4", "#7c6cf0", "#0b0c0f"],
    stats: [
      { label: "Conversion", value: "+92%" },
      { label: "Warenkorb", value: "+47%" },
      { label: "Ladezeit", value: "1.0s" },
    ],
    problem:
      "Der bisherige Shop nutzte ein Standard-Theme – austauschbar, langsam und ohne erkennbare Markenhaltung inmitten eines hart umkämpften Marktes.",
    solution:
      "Ein individuelles Storefront-Erlebnis mit großformatiger Produktfotografie, ruhigen Übergängen und einem Checkout, der sich nahtlos in das Editorial-Design einfügt – ohne die Conversion zu gefährden.",
    process: [
      { title: "Kennenlernen", text: "Sortiments- und Zielgruppenanalyse, Customer-Journey-Mapping." },
      { title: "Strategie", text: "Conversion-Architektur und Content-Hierarchie je Kategorie." },
      { title: "Design", text: "Editoriales Produktraster, individuelle PDP- und Checkout-Gestaltung." },
      { title: "Entwicklung", text: "Headless Shopify auf Next.js, Performance-first Bildpipeline." },
      { title: "Launch", text: "Migration ohne Downtime, SEO-Redirects, Monitoring der Kern-KPIs." },
    ],
    colors: [
      { name: "Nordlicht Teal", hex: "#52D9C4" },
      { name: "Dämmerviolett", hex: "#7C6CF0" },
      { name: "Tiefschwarz", hex: "#0B0C0F" },
      { name: "Ivory", hex: "#F4F3EF" },
    ],
    typography: { display: "Fraunces", body: "Inter" },
  },
  {
    slug: "kilo-korn",
    title: "Kilo & Korn",
    client: "Kilo & Korn AG",
    category: "shops",
    categoryLabel: "Shops",
    year: "2024",
    industry: "Bio-Lebensmittel E-Commerce",
    goal: "Abo-Shop mit hoher Wiederkaufrate",
    result: "58% Abo-Anteil am Gesamtumsatz",
    summary:
      "Ein Abo-Shop für Bio-Grundnahrungsmittel, gebaut für Vertrauen, Wiederholung und ein gutes Gewissen.",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    gradient: ["#d8b478", "#52d9c4", "#0b0c0f"],
    stats: [
      { label: "Abo-Anteil", value: "58%" },
      { label: "Retention", value: "+31%" },
      { label: "Ladezeit", value: "0.8s" },
    ],
    problem:
      "Ein austauschbares Grundnahrungsmittel-Sortiment brauchte eine Marke, die Vertrauen und Herkunft greifbar macht – digital, ohne Bio-Klischees.",
    solution:
      "Warme, erdige Bildwelt kombiniert mit einem präzisen, technischen Interface für Abo-Verwaltung. Die Balance aus Handwerk und Klarheit macht den Unterschied.",
    process: [
      { title: "Kennenlernen", text: "Sourcing-Reise zu Erzeugerbetrieben, Markenkern-Workshop." },
      { title: "Strategie", text: "Abo-Mechanik, Pricing-Architektur, Retention-Hebel." },
      { title: "Design", text: "Editoriale Herkunfts-Storys je Produktlinie." },
      { title: "Entwicklung", text: "Stripe Billing Integration, individuelles Abo-Dashboard." },
      { title: "Betreuung", text: "Laufende Optimierung der Retention-Flows." },
    ],
    colors: [
      { name: "Kornfeld", hex: "#D8B478" },
      { name: "Frischgrün", hex: "#52D9C4" },
      { name: "Erdschwarz", hex: "#0B0C0F" },
      { name: "Ivory", hex: "#F4F3EF" },
    ],
    typography: { display: "Fraunces", body: "Inter" },
  },
  {
    slug: "pulse-fitness-launch",
    title: "Pulse Fitness Launch",
    client: "Pulse Fitness Inc.",
    category: "landingpages",
    categoryLabel: "Landingpages",
    year: "2025",
    industry: "Fitness App",
    goal: "App-Launch mit maximaler Aufmerksamkeit in 48 Stunden",
    result: "23'400 Pre-Registrations in der ersten Woche",
    summary:
      "Eine kinetische Launch-Page für eine Fitness-App, gebaut wie ein Trailer – mit Sound, Bewegung und Sog.",
    tags: ["Next.js", "GSAP", "Framer Motion", "Lenis"],
    gradient: ["#7c6cf0", "#5b8cff", "#0b0c0f"],
    stats: [
      { label: "Pre-Registrations", value: "23.4K" },
      { label: "Scrolltiefe", value: "87%" },
      { label: "Ladezeit", value: "1.2s" },
    ],
    problem:
      "Ein Launch-Fenster von 48 Stunden, keine bestehende Zielgruppe, keine zweite Chance auf einen ersten Eindruck.",
    solution:
      "Eine einzige, cinematische Scroll-Erzählung mit choreografierten Reveal-Momenten, die App-Funktionen wie Filmsequenzen inszeniert – gebaut für virale Weiterleitung.",
    process: [
      { title: "Kennenlernen", text: "Sprint-Workshop mit dem Gründerteam, Positionierung in 48 Stunden." },
      { title: "Strategie", text: "Ein Story-Bogen, eine Handlung, ein CTA." },
      { title: "Design", text: "Storyboard-getriebenes Motion-Design, Frame für Frame." },
      { title: "Entwicklung", text: "GSAP-Timeline-Choreografie mit Performance-Budget." },
      { title: "Launch", text: "Koordinierter Go-Live mit Social- und Presse-Kampagne." },
    ],
    colors: [
      { name: "Pulse Violet", hex: "#7C6CF0" },
      { name: "Electric Blue", hex: "#5B8CFF" },
      { name: "Tiefschwarz", hex: "#0B0C0F" },
      { name: "Ivory", hex: "#F4F3EF" },
    ],
    typography: { display: "Fraunces", body: "Inter" },
  },
  {
    slug: "terra-immobilien",
    title: "Terra Immobilien",
    client: "Terra Immobilien AG",
    category: "unternehmen",
    categoryLabel: "Unternehmen",
    year: "2024",
    industry: "Immobilien",
    goal: "Premium-Auftritt für exklusive Liegenschaften",
    result: "+120% Anfragen für Top-Segment-Objekte",
    summary:
      "Eine Bühne für aussergewöhnliche Immobilien – kartografisch, ruhig und mit Fokus auf Raum statt Reiz.",
    tags: ["Next.js", "TypeScript", "Mapbox", "Framer Motion"],
    gradient: ["#0b0c0f", "#d8b478", "#5b8cff"],
    stats: [
      { label: "Anfragen", value: "+120%" },
      { label: "Verweildauer", value: "+2.4min" },
      { label: "Ladezeit", value: "1.0s" },
    ],
    problem:
      "Hochpreisige Liegenschaften wurden auf Standard-Immobilienportalen wie Massenware präsentiert – ohne Kontext, ohne Geschichte.",
    solution:
      "Jede Liegenschaft erhält eine eigene, kartenbasierte Erzählung mit Fokus auf Licht, Lage und Architektur – kuratiert statt kategorisiert.",
    process: [
      { title: "Kennenlernen", text: "Objektbegehungen, Zielgruppenanalyse im Premium-Segment." },
      { title: "Strategie", text: "Kuratiertes Portfolio-System statt klassischer Listenansicht." },
      { title: "Design", text: "Kartografische Interfaces, ruhige Bildkompositionen." },
      { title: "Entwicklung", text: "Individuelle Mapbox-Integration, optimierte Bildpipeline." },
      { title: "Betreuung", text: "Redaktionelle Pflege neuer Objekte im monatlichen Rhythmus." },
    ],
    colors: [
      { name: "Terra Gold", hex: "#D8B478" },
      { name: "Himmelblau", hex: "#5B8CFF" },
      { name: "Tiefschwarz", hex: "#0B0C0F" },
      { name: "Ivory", hex: "#F4F3EF" },
    ],
    typography: { display: "Fraunces", body: "Inter" },
  },
  {
    slug: "aurora-skincare",
    title: "Aurora Skincare",
    client: "Aurora Skincare Labs",
    category: "shops",
    categoryLabel: "Shops",
    year: "2025",
    industry: "Kosmetik E-Commerce",
    goal: "Wissenschaftliche Marke mit sinnlichem Interface",
    result: "+76% durchschnittlicher Bestellwert",
    summary:
      "Ein Shop, der Laborpräzision und sinnliche Textur miteinander verbindet – für eine Skincare-Marke mit wissenschaftlichem Anspruch.",
    tags: ["Next.js", "Shopify", "GSAP", "TypeScript"],
    gradient: ["#f1ddb0", "#7c6cf0", "#0b0c0f"],
    stats: [
      { label: "Bestellwert", value: "+76%" },
      { label: "Conversion", value: "+54%" },
      { label: "Ladezeit", value: "0.9s" },
    ],
    problem:
      "Die Formulierungen waren wissenschaftlich fundiert, aber die Marke wirkte digital wie jede andere austauschbare DTC-Beauty-Marke.",
    solution:
      "Makroaufnahmen von Texturen, animierte Wirkstoff-Diagramme und ein reduziertes Interface, das Vertrauen über Präzision statt Lautstärke aufbaut.",
    process: [
      { title: "Kennenlernen", text: "Labor-Workshop mit dem Formulierungsteam." },
      { title: "Strategie", text: "Content-Architektur für erklärungsbedürftige Wirkstoffe." },
      { title: "Design", text: "Makrofotografie-Kunstrichtung, animierte Diagramm-Sprache." },
      { title: "Entwicklung", text: "Headless Shopify, GSAP-basierte Ingredient-Visuals." },
      { title: "Launch", text: "Internationaler Rollout in drei Sprachen." },
    ],
    colors: [
      { name: "Aurora Champagne", hex: "#F1DDB0" },
      { name: "Dämmerviolett", hex: "#7C6CF0" },
      { name: "Tiefschwarz", hex: "#0B0C0F" },
      { name: "Ivory", hex: "#F4F3EF" },
    ],
    typography: { display: "Fraunces", body: "Inter" },
  },
  {
    slug: "quantum-summit",
    title: "Quantum Summit",
    client: "Quantum Summit Conference",
    category: "landingpages",
    categoryLabel: "Landingpages",
    year: "2024",
    industry: "Tech-Konferenz",
    goal: "Ticketverkauf für eine neue Flagship-Konferenz",
    result: "1'800 verkaufte Tickets vor Speaker-Ankündigung",
    summary:
      "Eine technoide Event-Seite, die Tickets verkauft, bevor auch nur ein Speaker bestätigt ist – über Atmosphäre statt Namen.",
    tags: ["Next.js", "Three.js", "Framer Motion", "TypeScript"],
    gradient: ["#5b8cff", "#52d9c4", "#0b0c0f"],
    stats: [
      { label: "Tickets", value: "1.8K" },
      { label: "Conversion", value: "12.4%" },
      { label: "Ladezeit", value: "1.1s" },
    ],
    problem:
      "Eine komplett neue Konferenzmarke ohne Leadgeschichte musste in einem gesättigten Tech-Event-Markt sofort Relevanz beanspruchen.",
    solution:
      "Ein generatives Lichtsystem als visuelles Leitmotiv, das Programm-Inhalte in Wellen freigibt und ein Gefühl exklusiven Zugangs erzeugt.",
    process: [
      { title: "Kennenlernen", text: "Positionierung gegenüber etablierten Flagship-Events." },
      { title: "Strategie", text: "Gestaffelter Ticket-Drop als Spannungsbogen." },
      { title: "Design", text: "Generatives Lichtmotiv, technoide Typografie." },
      { title: "Entwicklung", text: "WebGL-Hintergrundsystem mit striktem Performance-Budget." },
      { title: "Launch", text: "Drei-Wellen-Kampagne mit Countdown-Mechanik." },
    ],
    colors: [
      { name: "Quantum Blue", hex: "#5B8CFF" },
      { name: "Signal Teal", hex: "#52D9C4" },
      { name: "Tiefschwarz", hex: "#0B0C0F" },
      { name: "Ivory", hex: "#F4F3EF" },
    ],
    typography: { display: "Fraunces", body: "Inter" },
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

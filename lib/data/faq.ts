export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Wie lange dauert ein typisches Projekt?",
    answer:
      "Je nach Umfang zwischen 4 und 12 Wochen. Eine fokussierte Landingpage kann in 3 bis 4 Wochen live gehen, ein vollständiger Unternehmensauftritt oder E-Commerce-Shop benötigt in der Regel 8 bis 12 Wochen von Kennenlernen bis Launch.",
  },
  {
    question: "Was kostet eine Webseite von ShopWerk?",
    answer:
      "Jedes Projekt ist massgeschneidert, daher arbeiten wir mit individuellen Angeboten statt Pauschalpaketen. Nach einem ersten Gespräch erhalten Sie eine transparente Kalkulation auf Basis von Umfang, Funktionsumfang und Zeitrahmen.",
  },
  {
    question: "Übernehmt ihr auch Wartung und Weiterentwicklung nach dem Launch?",
    answer:
      "Ja. Wir bieten laufende Betreuung inklusive Sicherheitsupdates, Performance-Monitoring, Content-Pflege und Weiterentwicklung an – auf Wunsch mit individuellem Service-Level-Agreement.",
  },
  {
    question: "Arbeitet ihr auch mit bestehenden Marken oder nur mit Neugründungen?",
    answer:
      "Beides. Rund die Hälfte unserer Projekte sind Relaunches etablierter Marken, die digital ihrem eigenen Qualitätsanspruch gerecht werden wollen. Wir entwickeln bestehende Markensysteme konsequent weiter, statt bei null zu beginnen.",
  },
  {
    question: "Welche Technologien setzt ihr ein?",
    answer:
      "Unser Standard-Stack ist Next.js, React und TypeScript im Frontend, Tailwind CSS für das Styling sowie Framer Motion, GSAP und Lenis für Animationen. Für E-Commerce nutzen wir je nach Anforderung Shopify Headless oder individuelle Lösungen.",
  },
  {
    question: "Kann ich Inhalte nach dem Launch selbst pflegen?",
    answer:
      "Ja. Wir integrieren ein headless CMS Ihrer Wahl, sodass Sie Texte, Bilder und Projekte ohne Entwicklerkenntnisse aktualisieren können – das Design-System bleibt dabei konsistent geschützt.",
  },
  {
    question: "Bietet ihr auch SEO und Marketing-Unterstützung an?",
    answer:
      "Technisches SEO ist von Beginn an Teil jedes Projekts – von Core Web Vitals über strukturierte Daten bis zur Sitemap. Für Content-Strategie und laufendes SEO-Marketing arbeiten wir eng mit spezialisierten Partnern zusammen.",
  },
  {
    question: "Wo sitzt ShopWerk und arbeitet ihr auch remote?",
    answer:
      "Unser Studio befindet sich in Grafstal in der Schweiz. Wir betreuen Kunden in der gesamten Schweiz sowie im deutschsprachigen Raum – persönlich vor Ort oder vollständig remote, ganz wie es für Sie passt.",
  },
];

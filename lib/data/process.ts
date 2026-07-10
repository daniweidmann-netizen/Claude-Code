export interface ProcessStep {
  index: string;
  title: string;
  description: string;
  icon: string;
}

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Kennenlernen",
    description:
      "Wir hören zu, bevor wir gestalten. Im ersten Gespräch verstehen wir Ihre Marke, Ihre Ziele und Ihre Zielgruppe wirklich.",
    icon: "MessageCircle",
  },
  {
    index: "02",
    title: "Strategie",
    description:
      "Aus Erkenntnissen wird ein Plan: Informationsarchitektur, Content-Strategie und ein klares Zielsystem für messbaren Erfolg.",
    icon: "Compass",
  },
  {
    index: "03",
    title: "Design",
    description:
      "Wir gestalten jede Seite als eigenständiges Erlebnis – mit eigener Bewegungssprache, Typografie und visueller Dramaturgie.",
    icon: "PenTool",
  },
  {
    index: "04",
    title: "Entwicklung",
    description:
      "Sauberer, komponentenbasierter Code auf Next.js und TypeScript verwandelt Design in ein performantes, robustes Produkt.",
    icon: "Code2",
  },
  {
    index: "05",
    title: "Launch",
    description:
      "Sorgfältige Qualitätssicherung, Performance-Feinschliff und ein koordinierter Go-Live ohne Überraschungen.",
    icon: "Rocket",
  },
  {
    index: "06",
    title: "Betreuung",
    description:
      "Nach dem Launch bleiben wir an Ihrer Seite – mit Monitoring, Updates und kontinuierlicher Weiterentwicklung.",
    icon: "LifeBuoy",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "ShopWerk hat verstanden, was wir noch nicht in Worte fassen konnten. Das Ergebnis wirkt nicht wie eine Webseite – es wirkt wie ein Statement.",
    name: "Nadine Frei",
    role: "Geschäftsführerin",
    company: "Alpine Interiors AG",
    initials: "NF",
  },
  {
    quote:
      "Wir haben mit drei Agenturen gesprochen. Nur eine hat uns gezeigt, wie unsere Marke sich anfühlen sollte, bevor wir es selbst wussten.",
    name: "Marco Bettoni",
    role: "CEO",
    company: "Vertex Capital Partners",
    initials: "MB",
  },
  {
    quote:
      "Die Ladezeit ist nicht das Beeindruckende. Das Beeindruckende ist, dass sich jede Interaktion absichtsvoll anfühlt.",
    name: "Léa Dubois",
    role: "Head of Brand",
    company: "Nordlicht Living GmbH",
    initials: "LD",
  },
  {
    quote:
      "Unser Umsatz über den Shop hat sich innerhalb von zwei Quartalen fast verdoppelt. Das Design trägt die Marke, nicht umgekehrt.",
    name: "Jonas Keller",
    role: "Gründer",
    company: "Kilo & Korn AG",
    initials: "JK",
  },
  {
    quote:
      "48 Stunden vor dem Launch waren wir überzeugt, dass wir es nicht schaffen. ShopWerk hat geliefert – pixelgenau, pünktlich.",
    name: "Sarah Meier",
    role: "Head of Growth",
    company: "Pulse Fitness Inc.",
    initials: "SM",
  },
  {
    quote:
      "Selten erlebt man ein Team, das Design, Code und Geschäftsziele gleichermassen ernst nimmt. Genau das war der Unterschied.",
    name: "Thomas Aeschbacher",
    role: "Verwaltungsratspräsident",
    company: "Terra Immobilien AG",
    initials: "TA",
  },
];

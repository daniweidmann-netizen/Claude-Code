/**
 * All website copy (de-CH). Product statements are taken VERBATIM from the
 * existing Vireli store / packaging (see references/). Do not add claims here
 * without approval — see DEVELOPMENT_PLAN.md §4.
 * Swiss orthography: "ss" instead of "ß".
 */

export const announcement = "Kostenloser Versand ab CHF 60"; // TODO verify: must match Shopify shipping rule

export const nav = [
  { href: "#nacht", label: "Die Nacht", n: "01" },
  { href: "#beeren", label: "Mixed Berry", n: "02" },
  { href: "#formel", label: "Die Formel", n: "03" },
  { href: "#produkt", label: "Das Produkt", n: "04" },
  { href: "#ritual", label: "Das Ritual", n: "05" },
] as const;

export const hero = {
  index: "Die Nacht",
  lines: ["Dein Abend.", "Dein Ritual.", "Deine Ruhe."],
  // Store hero copy (verbatim)
  sub: "Deine Abendroutine mit ausgewählten Inhaltsstoffen – melatoninfrei, vegan und ohne Zuckerzusatz.",
  cta: "Night Gummies entdecken",
  // Pack claims (verbatim from packaging badges)
  badges: ["Melatoninfrei", "Vegan", "Ohne Zuckerzusatz"],
};

export const berries = {
  index: "Mixed Berry",
  title: "Mixed Berry",
  // The four berries illustrated on the pack. Illustration only — no statement about
  // fruit content or flavour source until confirmed (DEVELOPMENT_PLAN §4.7).
  names: ["Erdbeere", "Himbeere", "Brombeere", "Heidelbeere"],
  caption: "Night Gummies – Mixed Berry. 60 Gummies, 60 Portionen.",
};

export const formula = {
  index: "Die Formel",
  title: "Was steckt drin?",
  intro: "Eine ausgewählte Kombination aus pflanzlichen Inhaltsstoffen, Vitaminen und Mineralstoffen.",
  items: [
    { key: "l-theanin", name: "L-Theanin", text: "Ausgewählter Bestandteil der Vireli Rezeptur.", star: false },
    { key: "ashwagandha", name: "Ashwagandha-Extrakt", text: "Pflanzlicher Bestandteil der Rezeptur.", star: false },
    { key: "vitamin-d", name: "Vitamin D", text: "Trägt zu einer normalen Funktion des Immunsystems bei.", star: true },
    { key: "zink", name: "Zink", text: "Trägt zu einer normalen kognitiven Funktion bei.", star: true },
  ],
};

export const product = {
  index: "Das Produkt",
  eyebrow: "Nahrungsergänzungsmittel",
  facts: [
    { k: "Inhalt", v: "60 Gummies" },
    { k: "Portionen", v: "60" },
    { k: "Verzehr", v: "1 Gummie täglich" },
  ],
  badges: ["Melatoninfrei", "Vegan", "Ohne Zuckerzusatz"],
  taxNote: "inkl. MwSt.",
};

export const ritual = {
  index: "Das Ritual",
  title: "Deine Abendroutine",
  // Store copy (verbatim) — wording pending legal review (DEVELOPMENT_PLAN §4.2)
  text: "Einfach eine Gummie abends nehmen – und deinem Körper die Ruhe geben, die er verdient.",
  steps: [
    { n: "I", t: "Abends", d: "Wenn der Tag zur Ruhe kommt." },
    { n: "II", t: "Ein Gummie", d: "Einfach 1 Gummie täglich." },
    { n: "III", t: "Dein Ritual", d: "Melatoninfrei, vegan, ohne Zuckerzusatz." },
  ],
};

export const finale = {
  title: ["Bereit für", "deinen Abend?"],
  cta: "Night Gummies kaufen",
};

export const footer = {
  links: [
    { href: "#produkt", label: "Shop" },
    { href: "#", label: "Über Vireli" },
    { href: "#", label: "Kontakt" },
  ],
  legal: [
    { href: "#", label: "Impressum" },
    { href: "#", label: "Datenschutz" },
    { href: "#", label: "AGB" },
    { href: "#", label: "Versand & Rückgabe" },
  ],
  newsletter: "Abendpost von Vireli – neue Rituale, zuerst für dich.",
};

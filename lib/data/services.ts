export interface Service {
  index: string;
  icon: string;
  title: string;
  description: string;
  points: string[];
}

export const services: Service[] = [
  {
    index: "01",
    icon: "PenTool",
    title: "Webdesign",
    description:
      "Individuelles Interface-Design, das Ihre Marke auf jeder Auflösung wie eine bewusste Entscheidung wirken lässt – nicht wie ein Template.",
    points: ["Art Direction", "UI/UX Design", "Design Systeme", "Prototyping"],
  },
  {
    index: "02",
    icon: "Code2",
    title: "Webentwicklung",
    description:
      "Sauberer, komponentenbasierter Code auf Next.js und TypeScript – gebaut für Geschwindigkeit, Skalierbarkeit und Wartbarkeit.",
    points: ["Next.js & React", "TypeScript", "Headless CMS", "API-Integration"],
  },
  {
    index: "03",
    icon: "ShoppingBag",
    title: "E-Commerce",
    description:
      "Shops, die konvertieren, ohne an Ästhetik zu verlieren. Von Produktseite bis Checkout jedes Detail auf Umsatz optimiert.",
    points: ["Shopify Headless", "Checkout-Optimierung", "Abo-Modelle", "Payment-Integration"],
  },
  {
    index: "04",
    icon: "Sparkles",
    title: "Branding",
    description:
      "Markenidentitäten mit Substanz: Logo, Typografie, Farbwelt und Tonalität – konsequent über jeden Berührungspunkt hinweg.",
    points: ["Markenstrategie", "Visuelle Identität", "Typografie-Systeme", "Brand Guidelines"],
  },
  {
    index: "05",
    icon: "Search",
    title: "SEO",
    description:
      "Technisches und inhaltliches SEO, das Sichtbarkeit aufbaut, ohne Design und Performance zu kompromittieren.",
    points: ["Technisches SEO", "Content-Strategie", "Local SEO", "Schema Markup"],
  },
  {
    index: "06",
    icon: "Gauge",
    title: "Performance",
    description:
      "Ladezeiten unter 1.5 Sekunden sind für uns Standard, nicht Ausnahme. Jedes Kilobyte wird gerechtfertigt.",
    points: ["Core Web Vitals", "Bildoptimierung", "Caching-Strategie", "Lighthouse 95+"],
  },
  {
    index: "07",
    icon: "LifeBuoy",
    title: "Wartung",
    description:
      "Kontinuierliche Betreuung nach dem Launch – Updates, Monitoring und Weiterentwicklung aus einer Hand.",
    points: ["Monitoring", "Sicherheitsupdates", "Content-Pflege", "Support SLA"],
  },
  {
    index: "08",
    icon: "Server",
    title: "Hosting",
    description:
      "Zuverlässige, europäische Infrastruktur mit automatischer Skalierung und Zero-Downtime-Deployments.",
    points: ["Edge Hosting", "CDN & Caching", "SSL & Sicherheit", "99.9% Uptime"],
  },
];

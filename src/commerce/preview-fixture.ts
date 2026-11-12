import type { Product } from "./types";

/**
 * PREVIEW ONLY — used when Shopify credentials are not configured, so the
 * layout can be designed locally. Every page using it shows a visible
 * "Vorschau-Daten" badge. The price is the reference value from the brief,
 * NOT live data. Production reads everything from the Storefront API.
 */
export const PREVIEW_PRODUCT: Product = {
  id: "preview",
  handle: "vireli-night-gummies-mixed-berry",
  title: "Vireli Night Gummies – Mixed Berry",
  description: "",
  image: null,
  variant: {
    id: "preview-variant",
    availableForSale: true,
    price: { amount: "34.90", currencyCode: "CHF" },
    compareAtPrice: null,
  },
  info: [
    { key: "ingredients", label: "Zutaten", value: null },
    { key: "nutrition_table", label: "Nährwerte", value: null },
    { key: "recommended_intake", label: "Verzehrempfehlung", value: null },
    { key: "warnings", label: "Hinweise", value: null },
    { key: "claims_footnote", label: "Fussnote", value: null },
  ],
};

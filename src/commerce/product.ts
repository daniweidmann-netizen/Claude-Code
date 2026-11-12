import "server-only";
import { storefrontCached } from "./client";
import { PRODUCT_QUERY } from "./queries";
import type { Product, ProductInfoField, ProductResult } from "./types";
import { PREVIEW_PRODUCT } from "./preview-fixture";

const INFO_LABELS: Record<ProductInfoField["key"], string> = {
  ingredients: "Zutaten",
  nutrition_table: "Nährwerte",
  recommended_intake: "Verzehrempfehlung",
  warnings: "Hinweise",
  claims_footnote: "Fussnote",
};

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: Product["image"];
  variants: { nodes: NonNullable<Product["variant"]>[] };
  metafields: ({ key: ProductInfoField["key"]; value: string } | null)[];
};

export async function getProduct(): Promise<ProductResult> {
  const client = storefrontCached();
  const handle = process.env.SHOPIFY_PRODUCT_HANDLE;

  if (!client || !handle) {
    // Local design work without Shopify credentials: clearly-labelled preview data.
    if (process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_LABELS !== "false") {
      return { source: "preview", product: PREVIEW_PRODUCT };
    }
    return { source: "unavailable", product: null, reason: "Shopify ist nicht verbunden." };
  }

  try {
    const { data, errors } = await client.request<{ product: RawProduct | null }>(PRODUCT_QUERY, {
      variables: { handle },
    });
    if (errors || !data?.product) {
      return { source: "unavailable", product: null, reason: "Produkt konnte nicht geladen werden." };
    }
    const p = data.product;
    const byKey = new Map(p.metafields.filter(Boolean).map((m) => [m!.key, m!.value]));
    return {
      source: "shopify",
      product: {
        id: p.id,
        handle: p.handle,
        title: p.title,
        description: p.description,
        image: p.featuredImage,
        variant: p.variants.nodes[0] ?? null,
        info: (Object.keys(INFO_LABELS) as ProductInfoField["key"][]).map((key) => ({
          key,
          label: INFO_LABELS[key],
          value: byKey.get(key) ?? null,
        })),
      },
    };
  } catch {
    return { source: "unavailable", product: null, reason: "Shopify ist momentan nicht erreichbar." };
  }
}

export type Money = { amount: string; currencyCode: string };

export type ProductInfoField = {
  key: "ingredients" | "nutrition_table" | "recommended_intake" | "warnings" | "claims_footnote";
  label: string;
  value: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: { url: string; altText: string | null; width: number; height: number } | null;
  variant: {
    id: string;
    availableForSale: boolean;
    price: Money;
    compareAtPrice: Money | null;
  } | null;
  info: ProductInfoField[];
};

/** Where the product data came from. "preview" = Shopify not connected (local design work only). */
export type ProductResult =
  | { source: "shopify"; product: Product }
  | { source: "preview"; product: Product }
  | { source: "unavailable"; product: null; reason: string };

export type CartLine = {
  id: string;
  quantity: number;
  merchandiseId: string;
  title: string;
  variantTitle: string;
  image: { url: string; altText: string | null } | null;
  cost: Money;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  lines: CartLine[];
};

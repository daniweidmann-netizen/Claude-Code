import "server-only";
import { createStorefrontApiClient, type StorefrontApiClient } from "@shopify/storefront-api-client";

export function isShopifyConfigured() {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN);
}

function make(fetchInit: RequestInit & { next?: { revalidate?: number; tags?: string[] } }) {
  return createStorefrontApiClient({
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
    apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-10",
    privateAccessToken: process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN!,
    customFetchApi: (url, init) => fetch(url, { ...init, ...fetchInit }),
  });
}

let cached: StorefrontApiClient | null = null;
let live: StorefrontApiClient | null = null;

/** Cached reads (product data). Revalidated by webhook tag "shopify" or every 5 min. */
export function storefrontCached() {
  if (!isShopifyConfigured()) return null;
  return (cached ??= make({ next: { revalidate: 300, tags: ["shopify"] } }));
}

/** Uncached (cart mutations, live availability). */
export function storefrontLive() {
  if (!isShopifyConfigured()) return null;
  return (live ??= make({ cache: "no-store" }));
}

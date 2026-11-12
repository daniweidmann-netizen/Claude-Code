"use server";

import { cookies } from "next/headers";
import { storefrontLive } from "./client";
import { CART_CREATE, CART_LINES_ADD, CART_LINES_REMOVE, CART_LINES_UPDATE, CART_QUERY } from "./queries";
import type { Cart, Money } from "./types";

const COOKIE = "vireli_cart";

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Money };
      merchandise: {
        id: string;
        title: string;
        image: { url: string; altText: string | null } | null;
        product: { title: string };
      };
    }[];
  };
};

export type CartResult = { cart: Cart | null; error?: string };

const NOT_CONNECTED = "Shopify ist noch nicht verbunden – der Warenkorb ist in dieser Vorschau deaktiviert.";

function normalize(c: RawCart | null | undefined): Cart | null {
  if (!c) return null;
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    subtotal: c.cost.subtotalAmount,
    lines: c.lines.nodes.map((l) => ({
      id: l.id,
      quantity: l.quantity,
      merchandiseId: l.merchandise.id,
      title: l.merchandise.product.title,
      variantTitle: l.merchandise.title,
      image: l.merchandise.image,
      cost: l.cost.totalAmount,
    })),
  };
}

async function setCartCookie(id: string) {
  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

async function mutate(
  query: string,
  variables: Record<string, unknown>,
  field: string,
): Promise<CartResult> {
  const client = storefrontLive();
  if (!client) return { cart: null, error: NOT_CONNECTED };
  try {
    const { data, errors } = await client.request<Record<string, { cart: RawCart | null; userErrors: { message: string }[] }>>(
      query,
      { variables },
    );
    const payload = data?.[field];
    if (errors || !payload) return { cart: null, error: "Der Warenkorb konnte nicht aktualisiert werden." };
    if (payload.userErrors.length) return { cart: normalize(payload.cart), error: payload.userErrors[0].message };
    const cart = normalize(payload.cart);
    if (cart) await setCartCookie(cart.id);
    return { cart };
  } catch {
    return { cart: null, error: "Shopify ist momentan nicht erreichbar." };
  }
}

export async function getCart(): Promise<CartResult> {
  const client = storefrontLive();
  if (!client) return { cart: null };
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return { cart: null };
  try {
    const { data } = await client.request<{ cart: RawCart | null }>(CART_QUERY, { variables: { id } });
    return { cart: normalize(data?.cart) };
  } catch {
    return { cart: null };
  }
}

export async function addToCart(merchandiseId: string, quantity: number): Promise<CartResult> {
  const qty = Math.max(1, Math.min(10, Math.floor(quantity)));
  const id = (await cookies()).get(COOKIE)?.value;
  const lines = [{ merchandiseId, quantity: qty }];
  if (id) {
    const res = await mutate(CART_LINES_ADD, { cartId: id, lines }, "cartLinesAdd");
    if (res.cart) return res;
  }
  return mutate(CART_CREATE, { lines }, "cartCreate");
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartResult> {
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return { cart: null, error: "Kein Warenkorb gefunden." };
  if (quantity <= 0) return mutate(CART_LINES_REMOVE, { cartId: id, lineIds: [lineId] }, "cartLinesRemove");
  return mutate(CART_LINES_UPDATE, { cartId: id, lines: [{ id: lineId, quantity: Math.min(10, quantity) }] }, "cartLinesUpdate");
}

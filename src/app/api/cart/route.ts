import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCart, getOrCreateCart } from "@/lib/cart";

export async function GET() {
  const cart = await getCart();
  return NextResponse.json(cart);
}

const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = addItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.published) {
    return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });
  }

  const cart = await getOrCreateCart();

  const existingItem = cart.items.find((i) => i.productId === productId);

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE() {
  const cart = await getOrCreateCart();
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return NextResponse.json({ success: true });
}

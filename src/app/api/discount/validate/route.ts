import { NextResponse } from "next/server";
import { z } from "zod";
import { getCart, cartTotals } from "@/lib/cart";
import { findValidDiscount } from "@/lib/discount";

const schema = z.object({ code: z.string().min(1) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const cart = await getCart();
  const { subtotal } = cartTotals(cart.items);

  const result = await findValidDiscount(parsed.data.code, subtotal);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    code: result.discountCode.code,
    type: result.discountCode.type,
    value: result.discountCode.value,
    discountAmount: result.discountAmount,
  });
}

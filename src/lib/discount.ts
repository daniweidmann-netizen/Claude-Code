import { prisma } from "@/lib/prisma";

export async function findValidDiscount(code: string, subtotal: number) {
  const discountCode = await prisma.discountCode.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!discountCode || !discountCode.active) {
    return { error: "Rabattcode ist ungültig." };
  }

  if (discountCode.expiresAt && discountCode.expiresAt < new Date()) {
    return { error: "Rabattcode ist abgelaufen." };
  }

  if (
    discountCode.maxRedemptions !== null &&
    discountCode.timesRedeemed >= discountCode.maxRedemptions
  ) {
    return { error: "Rabattcode wurde bereits vollständig eingelöst." };
  }

  if (discountCode.minSubtotal !== null && subtotal < discountCode.minSubtotal) {
    return {
      error: `Mindestbestellwert von ${(discountCode.minSubtotal / 100).toFixed(2)} € nicht erreicht.`,
    };
  }

  const discountAmount =
    discountCode.type === "PERCENTAGE"
      ? Math.round((subtotal * discountCode.value) / 100)
      : Math.min(discountCode.value, subtotal);

  return { discountCode, discountAmount };
}

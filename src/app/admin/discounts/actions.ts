"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { discountSchema } from "@/lib/validations";

function parseDiscountForm(formData: FormData) {
  return discountSchema.safeParse({
    code: String(formData.get("code") ?? "").toUpperCase(),
    type: formData.get("type"),
    value:
      formData.get("type") === "PERCENTAGE"
        ? Number(formData.get("value"))
        : Math.round(Number(formData.get("value")) * 100),
    active: formData.get("active") === "on",
    maxRedemptions: formData.get("maxRedemptions") ? Number(formData.get("maxRedemptions")) : null,
    minSubtotal: formData.get("minSubtotal")
      ? Math.round(Number(formData.get("minSubtotal")) * 100)
      : null,
    expiresAt: formData.get("expiresAt") || null,
  });
}

export async function createDiscount(formData: FormData) {
  const parsed = parseDiscountForm(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ungültige Eingabe");
  }

  await prisma.discountCode.create({
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });
  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

export async function toggleDiscount(id: string, active: boolean) {
  await prisma.discountCode.update({ where: { id }, data: { active } });
  revalidatePath("/admin/discounts");
}

export async function deleteDiscount(id: string) {
  await prisma.discountCode.delete({ where: { id } });
  revalidatePath("/admin/discounts");
}

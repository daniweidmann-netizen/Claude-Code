"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";

export async function createAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nicht angemeldet");

  const parsed = addressSchema.safeParse({
    fullName: formData.get("fullName"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ungültige Eingabe");
  }

  const existingCount = await prisma.address.count({ where: { userId: session.user.id } });

  await prisma.address.create({
    data: { ...parsed.data, userId: session.user.id, isDefault: existingCount === 0 },
  });

  revalidatePath("/account/addresses");
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nicht angemeldet");

  await prisma.address.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nicht angemeldet");

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    }),
    prisma.address.updateMany({
      where: { id, userId: session.user.id },
      data: { isDefault: true },
    }),
  ]);

  revalidatePath("/account/addresses");
}

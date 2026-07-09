"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

function parseImages(raw: FormData) {
  const value = String(raw.get("images") ?? "");
  return value
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: Math.round(Number(formData.get("price")) * 100),
    compareAtPrice: formData.get("compareAtPrice")
      ? Math.round(Number(formData.get("compareAtPrice")) * 100)
      : null,
    images: parseImages(formData),
    stock: Number(formData.get("stock")),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sku: formData.get("sku") || null,
  });
}

export async function createProduct(formData: FormData) {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ungültige Eingabe");
  }

  await prisma.product.create({ data: parsed.data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ungültige Eingabe");
  }

  await prisma.product.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

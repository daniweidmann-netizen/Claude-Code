"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    image: formData.get("image") || null,
  });
}

export async function createCategory(formData: FormData) {
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ungültige Eingabe");
  }

  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ungültige Eingabe");
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new Error("Kategorie kann nicht gelöscht werden, solange ihr Produkte zugeordnet sind.");
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

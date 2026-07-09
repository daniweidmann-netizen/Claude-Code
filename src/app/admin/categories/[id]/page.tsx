import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";
import { updateCategory } from "../actions";

export const metadata: Metadata = { title: "Kategorie bearbeiten" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) notFound();

  const boundUpdate = updateCategory.bind(null, category.id);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Kategorie bearbeiten</h1>
      <div className="mt-6">
        <CategoryForm action={boundUpdate} defaults={category} submitLabel="Änderungen speichern" />
      </div>
    </div>
  );
}

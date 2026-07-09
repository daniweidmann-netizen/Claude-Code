import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

export const metadata: Metadata = { title: "Produkt bearbeiten" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Produkt bearbeiten</h1>
      <div className="mt-6 max-w-3xl">
        <ProductForm
          action={boundUpdate}
          categories={categories}
          defaults={product}
          submitLabel="Änderungen speichern"
        />
      </div>
    </div>
  );
}

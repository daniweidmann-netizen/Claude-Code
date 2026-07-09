import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export const metadata: Metadata = { title: "Neues Produkt" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Neues Produkt</h1>
      <div className="mt-6 max-w-3xl">
        <ProductForm action={createProduct} categories={categories} submitLabel="Produkt erstellen" />
      </div>
    </div>
  );
}

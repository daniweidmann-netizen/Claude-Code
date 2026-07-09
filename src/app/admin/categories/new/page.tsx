import type { Metadata } from "next";
import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory } from "../actions";

export const metadata: Metadata = { title: "Neue Kategorie" };

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Neue Kategorie</h1>
      <div className="mt-6">
        <CategoryForm action={createCategory} submitLabel="Kategorie erstellen" />
      </div>
    </div>
  );
}

type Category = { id: string; name: string };

type Defaults = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number | null;
  images?: string[];
  stock?: number;
  categoryId?: string;
  featured?: boolean;
  published?: boolean;
  sku?: string | null;
};

export default function ProductForm({
  action,
  categories,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  defaults?: Defaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="text-sm font-medium">Name</label>
        <input
          name="name"
          required
          defaultValue={defaults?.name}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Slug</label>
        <input
          name="slug"
          required
          defaultValue={defaults?.slug}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label className="text-sm font-medium">SKU (optional)</label>
        <input
          name="sku"
          defaultValue={defaults?.sku ?? ""}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm font-medium">Beschreibung</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defaults?.description}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Preis (€)</label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={defaults?.price !== undefined ? (defaults.price / 100).toFixed(2) : undefined}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Vergleichspreis (€, optional)</label>
        <input
          name="compareAtPrice"
          type="number"
          step="0.01"
          min="0"
          defaultValue={
            defaults?.compareAtPrice ? (defaults.compareAtPrice / 100).toFixed(2) : undefined
          }
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Lagerbestand</label>
        <input
          name="stock"
          type="number"
          min="0"
          required
          defaultValue={defaults?.stock ?? 0}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Kategorie</label>
        <select
          name="categoryId"
          required
          defaultValue={defaults?.categoryId}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="" disabled>
            Kategorie wählen
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm font-medium">Bild-URLs (eine pro Zeile)</label>
        <textarea
          name="images"
          rows={3}
          defaultValue={defaults?.images?.join("\n")}
          placeholder="https://picsum.photos/seed/produkt/800/800"
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex items-center gap-6 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={defaults?.featured} />
          Hervorgehoben
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={defaults?.published ?? true} />
          Veröffentlicht
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 w-fit rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 sm:col-span-2 dark:bg-white dark:text-neutral-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}

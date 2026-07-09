type Defaults = {
  name?: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
};

export default function CategoryForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: Defaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid max-w-xl gap-4">
      <div>
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
        <label className="text-sm font-medium">Beschreibung (optional)</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Bild-URL (optional)</label>
        <input
          name="image"
          defaultValue={defaults?.image ?? ""}
          placeholder="https://picsum.photos/seed/kategorie/600/450"
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <button
        type="submit"
        className="mt-2 w-fit rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}

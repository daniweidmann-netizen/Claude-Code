import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  stock: number;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:shadow-lg dark:border-white/10 dark:bg-neutral-900"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            Kein Bild
          </div>
        )}
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            Sale
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-neutral-900/80 px-2 py-1 text-xs font-semibold text-white">
            Ausverkauft
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-semibold">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

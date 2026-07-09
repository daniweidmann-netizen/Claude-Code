import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Elektronik",
    slug: "elektronik",
    description: "Aktuelle Gadgets und Technik für den Alltag.",
    image: "https://picsum.photos/seed/cat-electronics/600/450",
  },
  {
    name: "Mode",
    slug: "mode",
    description: "Zeitlose Kleidung und Accessoires.",
    image: "https://picsum.photos/seed/cat-fashion/600/450",
  },
  {
    name: "Wohnen",
    slug: "wohnen",
    description: "Möbel und Deko für dein Zuhause.",
    image: "https://picsum.photos/seed/cat-home/600/450",
  },
  {
    name: "Sport & Freizeit",
    slug: "sport-freizeit",
    description: "Ausrüstung für einen aktiven Lebensstil.",
    image: "https://picsum.photos/seed/cat-sport/600/450",
  },
];

const productsByCategory: Record<
  string,
  { name: string; price: number; compareAtPrice?: number; featured?: boolean }[]
> = {
  elektronik: [
    { name: "Kabellose Kopfhörer Pro", price: 12999, compareAtPrice: 15999, featured: true },
    { name: "Smartwatch Aurora", price: 19999, featured: true },
    { name: "Bluetooth Lautsprecher Mini", price: 5999 },
    { name: "USB-C Ladestation 4-fach", price: 3499 },
    { name: "Mechanische Tastatur Compact", price: 8999 },
    { name: "4K Webcam Studio", price: 7499 },
  ],
  mode: [
    { name: "Oversize Hoodie Basic", price: 5499, featured: true },
    { name: "Leinenhemd Sommer", price: 4499 },
    { name: "Slim Fit Chino", price: 5999 },
    { name: "Merino Wollpullover", price: 8999, compareAtPrice: 10999 },
    { name: "Lederguertel Klassik", price: 2999 },
    { name: "Sneaker Urban White", price: 8499, featured: true },
  ],
  wohnen: [
    { name: "Keramik Vase Terra", price: 3999 },
    { name: "Leseleuchte Bogen", price: 12999, featured: true },
    { name: "Baumwollteppich Nordic 160x230", price: 15999 },
    { name: "Duftkerze Zeder & Salbei", price: 1999 },
    { name: "Beistelltisch Eiche", price: 17999 },
    { name: "Kissenbezug Set Leinen", price: 2499 },
  ],
  "sport-freizeit": [
    { name: "Yogamatte Premium", price: 4999, featured: true },
    { name: "Trinkflasche Edelstahl 750ml", price: 2499 },
    { name: "Laufrucksack Trail 12L", price: 6999 },
    { name: "Widerstandsbänder Set", price: 2999 },
    { name: "Faltbares Fahrradschloss", price: 3999 },
    { name: "Trainingshandschuhe Grip", price: 2299 },
  ],
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categoryRecords = await Promise.all(
    categories.map((c) => prisma.category.create({ data: c }))
  );

  for (const category of categoryRecords) {
    const products = productsByCategory[category.slug] ?? [];
    for (const [index, p] of products.entries()) {
      const slug = slugify(p.name);
      await prisma.product.create({
        data: {
          name: p.name,
          slug,
          description: `${p.name} – hochwertige Verarbeitung und modernes Design. Perfekt für den täglichen Gebrauch. Kategorie: ${category.name}.`,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          images: [
            `https://picsum.photos/seed/${slug}-1/800/800`,
            `https://picsum.photos/seed/${slug}-2/800/800`,
          ],
          stock: 20 + index,
          featured: p.featured ?? false,
          published: true,
          sku: `SKU-${category.slug.toUpperCase()}-${index + 1}`,
          categoryId: category.id,
        },
      });
    }
  }

  await prisma.discountCode.createMany({
    data: [
      { code: "WILLKOMMEN10", type: "PERCENTAGE", value: 10 },
      { code: "SPARE5", type: "FIXED", value: 500, minSubtotal: 3000 },
      { code: "SOMMER20", type: "PERCENTAGE", value: 20, maxRedemptions: 100 },
    ],
  });

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@nova-shop.dev" },
    update: {},
    create: {
      name: "Shop Admin",
      email: "admin@nova-shop.dev",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("Kunde123!", 10);
  await prisma.user.upsert({
    where: { email: "kunde@nova-shop.dev" },
    update: {},
    create: {
      name: "Test Kunde",
      email: "kunde@nova-shop.dev",
      password: customerPassword,
      role: "USER",
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@nova-shop.dev / Admin123!");
  console.log("Kunden login: kunde@nova-shop.dev / Kunde123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

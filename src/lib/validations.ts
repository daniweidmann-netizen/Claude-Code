import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben"),
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2),
  phone: z.string().optional(),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  address: addressSchema,
  discountCode: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(1),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().optional().nullable(),
  images: z.array(z.string()).default([]),
  stock: z.number().int().nonnegative().default(0),
  categoryId: z.string().min(1),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sku: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const discountSchema = z.object({
  code: z.string().min(2),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().int().positive(),
  active: z.boolean().default(true),
  maxRedemptions: z.number().int().positive().optional().nullable(),
  minSubtotal: z.number().int().nonnegative().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

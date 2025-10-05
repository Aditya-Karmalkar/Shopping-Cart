import { NextResponse } from "next/server";

export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  sizes?: string[];
};

const PRODUCTS: Product[] = [
  {
    id: "prod-basic-tee",
    name: "Basic Tee",
    description: "Soft cotton tee in classic fit.",
    priceCents: 15770,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f692ab97-acef-4f34-b1f5-c9a73caf5f2f/generated_images/product-photography-of-a-basic-cotton-t--ad84f978-20251001053758.jpg",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "prod-denim-jacket",
    name: "Denim Jacket",
    description: "Timeless denim for every season.",
    priceCents: 57270,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f692ab97-acef-4f34-b1f5-c9a73caf5f2f/generated_images/product-photography-of-a-classic-denim-j-7653f4f8-20251001053912.jpg",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "prod-running-shoes",
    name: "Running Shoes",
    description: "Lightweight and comfortable daily runners.",
    priceCents: 65570,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f692ab97-acef-4f34-b1f5-c9a73caf5f2f/generated_images/product-photography-of-modern-running-sh-8027984e-20251001054016.jpg",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
  },
  {
    id: "prod-headphones",
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones.",
    priceCents: 107070,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f692ab97-acef-4f34-b1f5-c9a73caf5f2f/generated_images/product-photography-of-premium-wireless--e10b6275-20251001054126.jpg",
  },
  {
    id: "prod-backpack",
    name: "Everyday Backpack",
    description: "Durable and water-resistant commuter pack.",
    priceCents: 44820,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f692ab97-acef-4f34-b1f5-c9a73caf5f2f/generated_images/product-photography-of-a-modern-everyday-8d7fb70c-20251001054237.jpg",
  },
  {
    id: "prod-water-bottle",
    name: "Insulated Bottle",
    description: "Keeps drinks cold for 24h, hot for 12h.",
    priceCents: 19920,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f692ab97-acef-4f34-b1f5-c9a73caf5f2f/generated_images/product-photography-of-a-stainless-steel-ca9d38d9-20251001054343.jpg",
  },
  {
    id: "prod-notebook",
    name: "Hardcover Notebook",
    description: "Dot grid, 192 pages, lays flat.",
    priceCents: 13280,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f692ab97-acef-4f34-b1f5-c9a73caf5f2f/generated_images/product-photography-of-a-hardcover-noteb-74b75ee0-20251001054451.jpg",
  },
  {
    id: "prod-mug",
    name: "Ceramic Mug",
    description: "12oz matte finish ceramic mug.",
    priceCents: 12450,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f692ab97-acef-4f34-b1f5-c9a73caf5f2f/generated_images/product-photography-of-a-ceramic-coffee--58e159ff-20251001054558.jpg",
  },
];

export async function GET() {
  return NextResponse.json({ products: PRODUCTS });
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id) || null;
}
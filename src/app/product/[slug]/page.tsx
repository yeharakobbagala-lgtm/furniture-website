import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { products } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found — Square" };
  return {
    title: `${product.name} — Square Furniture & Living`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Related products from the same category or style
  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.style === product.style)
  );

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

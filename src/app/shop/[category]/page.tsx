import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopClient from "@/components/shop/ShopClient";
import { categories } from "@/data/categories";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found — Square" };
  return {
    title: `${category.name} Collection — Square Furniture & Living`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">Loading category...</div>}>
      <ShopClient
        initialCategory={category.slug}
        categoryBanner={{
          name: category.name,
          description: category.description,
          bannerImage: category.bannerImage,
        }}
      />
    </Suspense>
  );
}

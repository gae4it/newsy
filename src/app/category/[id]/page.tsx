"use client";

import { useParams } from 'next/navigation';
import { api } from "@/trpc/react";
import ProductCard from "@/app/_components/ProductCard";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = Number(params.id);

  const { data: products, isLoading } = api.product.getByCategory.useQuery({
    categoryId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

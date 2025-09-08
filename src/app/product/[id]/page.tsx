"use client";

import { useParams } from 'next/navigation';
import { api } from "@/trpc/react";
import ProductCard from "@/app/_components/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { data: product, isLoading } = api.product.getById.useQuery({
    id: productId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <ProductCard product={product} />
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { api } from "@/trpc/react";

export default function Home() {
  const { data: categories, isLoading } = api.category.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">gofrescoapp</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories?.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`} className="block bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-200">
              <h2 className="text-2xl font-bold">{category.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults } = api.product.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            gofrescoapp
          </Link>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {searchResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-white rounded-md shadow-lg mt-1">
                  <ul>
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <Link href={`/product/${product.id}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Link href="/cart" className="ml-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

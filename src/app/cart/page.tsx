"use client";

import { useCart } from "@/contexts/CartContext";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const variantIds = cart.map((item) => item.variantId);
  const { data: variants, isLoading } = api.variant.getByIds.useQuery(
    { ids: variantIds },
    { enabled: variantIds.length > 0 }
  );

  const createOrder = api.order.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate({
      customerName,
      customerEmail,
      items: cart.map((item) => ({ ...item, quantity: Number(item.quantity) })),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Lista della Spesa</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          {cart.length === 0 ? (
            <p>La tua lista della spesa è vuota.</p>
          ) : (
            <ul>
              {cart.map((item) => {
                const variant = variants?.find((v) => v.id === item.variantId);
                return (
                  <li key={item.variantId} className="flex items-center justify-between mb-2">
                    <span>{variant?.name}</span>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(item.variantId, Number(e.target.value))}
                      className="w-20 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Invia Ordine</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Invia
          </button>
        </form>
      </div>
    </main>
  );
}

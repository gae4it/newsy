import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { type Product, type Variant, UnitType } from '@prisma/client';

interface ProductCardProps {
  product: Product & { variants: Variant[] };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const handleAddToCart = (variantId: number) => {
    const quantity = quantities[variantId] || (product.unit === UnitType.WEIGHT ? 0.25 : 1);
    addItem(variantId, quantity);
  };

  const handleQuantityChange = (variantId: number, newQuantity: number) => {
    setQuantities((prev) => ({ ...prev, [variantId]: newQuantity }));
  };

  const step = product.unit === UnitType.WEIGHT ? 0.25 : 1;
  const min = product.unit === UnitType.WEIGHT ? 0.25 : 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <div>
        {product.variants.map((variant) => (
          <div key={variant.id} className="flex items-center justify-between mb-2">
            <span>{variant.name}</span>
            <div className="flex items-center">
              <input
                type="number"
                min={min}
                step={step}
                value={quantities[variant.id] || min}
                onChange={(e) => handleQuantityChange(variant.id, Number(e.target.value))}
                className="w-20 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <button
                onClick={() => handleAddToCart(variant.id)}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add to List
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  variantId: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (variantId: number, quantity: number) => void;
  removeItem: (variantId: number) => void;
  updateItemQuantity: (variantId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (variantId: number, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.variantId === variantId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { variantId, quantity }];
      }
    });
  };

  const removeItem = (variantId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.variantId !== variantId));
  };

  const updateItemQuantity = (variantId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

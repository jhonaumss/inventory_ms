// src/context/CartContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../models/Products";
import type { CartItem } from "../models/CartItem";

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product) => {
    if (!product.id) return;
    const productId = String(product.id);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        const newQty = Math.min(existing.quantity + 1, existing.maxQuantity);
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: newQty } : i
        );
      }
      return [
        ...prev,
        {
          productId: productId,
          name: product.name,
          quantity: 1,
          maxQuantity: product.quantity,
        },
      ];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity:
                quantity < 1 ? 1 : quantity > i.maxQuantity ? i.maxQuantity : quantity,
            }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = 0;// items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

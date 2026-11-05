"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PACK_OPTIONS, getPackPrice } from "@/data/product-detail-config";

// Keep the existing key so customers retain their saved cart.
const STORAGE_KEY = "100-peptides-cart-v1";
const CartContext = createContext(null);

export const CART_SETTINGS = {
  currency: "USD",
  freeShippingThreshold: 150,
};

export function formatCartMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CART_SETTINGS.currency,
  }).format(Number(value) || 0);
}

function normalizeCartItem(product, variant, quantity = 1, options = {}) {
  if (!product?.id || !variant?.id) {
    throw new Error("A valid product and variant are required.");
  }

  const packSize = Math.max(1, Math.floor(Number(options.packSize) || 1));
  const chosenPack = PACK_OPTIONS.find((pack) => pack.quantity === packSize);
  if (packSize !== 1 && !chosenPack) {
    throw new Error("Invalid pack selection.");
  }
  // Use the centralized discount, never an arbitrary amount from the caller.
  const discountPercent = chosenPack?.discountPercent ?? 0;
  const unitPrice = Number(variant.price);
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    throw new Error("A valid product price is required.");
  }
  const stock = variant.stock == null ? null : Math.max(0, Number(variant.stock));
  const maxStock = stock == null ? null : Math.floor(stock / packSize);
  if (variant.inStock === false || (maxStock != null && maxStock < 1)) {
    throw new Error("This selection is out of stock.");
  }
  const requested = Math.max(1, Math.floor(Number(quantity) || 1));
  const packPrice = getPackPrice(unitPrice, packSize, discountPercent);

  return {
    key: `${product.id}:${variant.id}:pack-${packSize}`,
    productId: product.id,
    variantId: variant.id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    variantLabel:
      packSize > 1 ? `${variant.label} · ${packSize} Bottles` : variant.label,
    unitPrice,
    packSize,
    discountPercent,
    price: packPrice, // price per pack; existing CartLineItem works unchanged
    maxStock, // maximum number of packs, not bottles
    quantity: Math.min(requested, maxStock ?? Infinity),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) {
        setItems(
          saved.filter(
            (item) => item && typeof item.key === "string" && item.quantity > 0,
          ),
        );
      }
    } catch {
      // Ignore malformed stored cart data.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart still works in memory when storage is unavailable.
    }
  }, [items, hydrated]);

  const addItem = useCallback((product, variant, quantity = 1, options = {}) => {
    const incoming = normalizeCartItem(product, variant, quantity, options);
    setItems((current) => {
      const previous = current.find((item) => item.key === incoming.key);
      if (!previous) return [...current, incoming];
      return current.map((item) =>
        item.key === incoming.key
          ? {
              ...incoming,
              quantity: Math.min(
                previous.quantity + incoming.quantity,
                incoming.maxStock ?? Infinity,
              ),
            }
          : item,
      );
    });
    // Automatically open existing CartDrawer after adding any item.
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.key !== key) return [item];
        const next = Math.floor(Number(quantity));
        if (!Number.isFinite(next)) return [item];
        if (next < 1) return [];
        return [{ ...item, quantity: Math.min(next, item.maxStock ?? Infinity) }];
      }),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity * (item.packSize || 1),
    0,
  );
  const remaining = Math.max(0, CART_SETTINGS.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / CART_SETTINGS.freeShippingThreshold) * 100,
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      subtotal,
      itemCount,
      remaining,
      freeShippingProgress,
      qualifiesForFreeShipping: remaining <= 0,
    }),
    [
      items,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      subtotal,
      itemCount,
      remaining,
      freeShippingProgress,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>.");
  return context;
}

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

const round = (value) => Math.round(value * 100) / 100;

function calculateItem(item) {
  const quantity = item.batches.reduce((sum, batch) => sum + batch.count, 0);
  const lineTotal = round(
    item.batches.reduce((sum, batch) => sum + batch.count * batch.unitPrice, 0),
  );

  return {
    ...item,
    quantity,
    lineTotal,
    price: quantity ? lineTotal / quantity : 0,
    packSize: 1,
    discountPercent: 0,
  };
}

function normalizeCartItem(product, variant, quantity = 1, options = {}) {
  if (!product?.id || !variant?.id) {
    throw new Error("A valid product and variant are required.");
  }

  const packSize = Math.max(1, Math.floor(Number(options.packSize) || 1));
  const pack = PACK_OPTIONS.find((item) => item.quantity === packSize);

  if (packSize !== 1 && !pack) {
    throw new Error("Invalid pack selection.");
  }

  const unitPrice = Number(variant.price);

  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    throw new Error("A valid product price is required.");
  }

  const stock =
    variant.stock == null ? null : Math.max(0, Number(variant.stock));

  if (variant.inStock === false || stock === 0) {
    throw new Error("This product is out of stock.");
  }

  const packCount = Math.max(1, Math.floor(Number(quantity) || 1));
  const bottleCount = packSize * packCount;

  if (stock != null && bottleCount > stock) {
    throw new Error("Selected quantity exceeds available stock.");
  }

  const discountedPrice =
    getPackPrice(unitPrice, packSize, pack?.discountPercent ?? 0) / packSize;

  return calculateItem({
    key: `${product.id}:${variant.id}`,
    productId: product.id,
    variantId: variant.id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    variantLabel: variant.label,
    unitPrice,
    maxStock: stock,
    batches: [{ count: bottleCount, unitPrice: discountedPrice }],
  });
}

function restoreCart(saved) {
  const merged = new Map();

  for (const item of saved) {
    if (!item?.productId || !item?.variantId) continue;

    const key = `${item.productId}:${item.variantId}`;
    const packSize = Math.max(1, Number(item.packSize) || 1);
    const quantity = Math.max(0, Math.floor(Number(item.quantity) || 0));

    const batches = Array.isArray(item.batches)
      ? item.batches
          .filter(
            (batch) =>
              Number(batch.count) > 0 &&
              Number.isFinite(Number(batch.unitPrice)) &&
              Number(batch.unitPrice) >= 0,
          )
          .map((batch) => ({
            count: Math.floor(Number(batch.count)),
            unitPrice: Number(batch.unitPrice),
          }))
      : quantity > 0
        ? [
            {
              count: quantity * packSize,
              unitPrice: Number(item.price || 0) / packSize,
            },
          ]
        : [];

    if (!batches.length) continue;

    const previous = merged.get(key);
    const variantLabel = String(item.variantLabel || "").split(" · ")[0];

    const base = {
      ...item,
      key,
      variantLabel,
      unitPrice: Number(item.unitPrice) || 0,
      maxStock:
        item.maxStock == null
          ? null
          : Number(item.maxStock) *
            (Array.isArray(item.batches) ? 1 : packSize),
    };

    merged.set(
      key,
      calculateItem({
        ...(previous || base),
        batches: [...(previous?.batches || []), ...batches],
      }),
    );
  }

  return [...merged.values()];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setItems(restoreCart(saved));
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem = useCallback(
    (product, variant, quantity = 1, options = {}) => {
      const incoming = normalizeCartItem(product, variant, quantity, options);

      setItems((current) => {
        const previous = current.find((item) => item.key === incoming.key);

        if (!previous) return [...current, incoming];

        const remaining =
          previous.maxStock == null
            ? Infinity
            : Math.max(0, previous.maxStock - previous.quantity);

        const count = Math.min(incoming.quantity, remaining);
        if (count < 1) return current;

        return current.map((item) => {
          if (item.key !== incoming.key) return item;

          return calculateItem({
            ...item,
            maxStock: incoming.maxStock,
            batches: [...item.batches, { ...incoming.batches[0], count }],
          });
        });
      });

      setIsOpen(true);
    },
    [],
  );

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

        if (next > item.quantity) {
          const count = Math.min(
            next - item.quantity,
            item.maxStock == null
              ? Infinity
              : Math.max(0, item.maxStock - item.quantity),
          );

          if (count < 1) return [item];

          return [
            calculateItem({
              ...item,
              batches: [...item.batches, { count, unitPrice: item.unitPrice }],
            }),
          ];
        }

        let toRemove = item.quantity - next;
        const batches = item.batches.map((batch) => ({ ...batch }));

        for (let i = batches.length - 1; i >= 0 && toRemove > 0; i--) {
          const removed = Math.min(batches[i].count, toRemove);
          batches[i].count -= removed;
          toRemove -= removed;
        }

        return [
          calculateItem({
            ...item,
            batches: batches.filter((batch) => batch.count > 0),
          }),
        ];
      }),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const subtotal = round(items.reduce((sum, item) => sum + item.lineTotal, 0));

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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

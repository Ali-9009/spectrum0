"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  FlaskConical,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  PACK_OPTIONS,
  getPackPrice,
  formatMoney,
} from "@/data/product-detail-config";

export default function QuickView({ product, onClose }) {
  const { addItem } = useCart();
  const [cartError, setCartError] = useState("");
  const titleId = useId();
  const [selectedVariant, setSelectedVariant] = useState(
    product.defaultVariant ?? 0,
  );
  const [selectedPack, setSelectedPack] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const variant = product.variants[selectedVariant];
  const pack = PACK_OPTIONS.find((item) => item.quantity === selectedPack);
  const packSize = pack?.quantity ?? 1;
  const discount = pack?.discountPercent ?? 0;
  const hasPrice = variant?.price != null;
  const unitPrice = hasPrice ? Number(variant.price) : 0;
  const packPrice = getPackPrice(unitPrice, packSize, discount);
  const totalPrice = packPrice * quantity;
  const regularPrice = unitPrice * packSize * quantity;
  const savings = Math.max(0, regularPrice - totalPrice);
  const totalBottles = packSize * quantity;
  const stock = Number(variant?.stock ?? Infinity);
  const availablePacks = Math.floor(stock / packSize);
  const inStock = variant?.inStock !== false && availablePacks >= quantity;
  const canAdd = hasPrice && Number.isFinite(unitPrice) && inStock;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant, selectedPack]);

  const handleAddToCart = () => {
    if (!canAdd) return;
    try {
      setCartError("");
      addItem(product, variant, quantity, {
        packSize,
        discountPercent: discount,
      });
      onClose();
    } catch (error) {
      setCartError(error?.message || "Unable to add product to cart.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B1020]/65 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[95dvh] w-full max-w-260 overflow-y-auto rounded-[26px] bg-white p-3 shadow-2xl sm:p-5 lg:overflow-visible lg:rounded-[30px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="text-primary hover:bg-primary absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3F8] shadow-sm transition-all duration-300 hover:text-white sm:top-4 sm:right-4"
        >
          <X size={20} />
        </button>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[22px] border border-[#EEE7F0] bg-[#FBF9FC] sm:min-h-[350px] md:min-h-[480px]">
            <div className="relative flex flex-1 items-center justify-center p-5 sm:p-8">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover"
                />
              ) : (
                <FlaskConical
                  size={85}
                  strokeWidth={1}
                  className="text-primary/30"
                />
              )}
            </div>

            <div className="absolute bottom-4 left-4 z-10">
              <span className="text-primary inline-flex items-center gap-2 rounded-full border border-[#E8DEEA] bg-white px-3 py-2 font-sans text-[10px] font-semibold tracking-wider uppercase">
                <FlaskConical size={14} />
                Research Use Only
              </span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col rounded-[22px] p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id={titleId}
                  className="font-heading text-primary mt-1 text-[26px] leading-[1.1] font-bold tracking-[-0.05em] sm:text-[30px]"
                >
                  {product.name}
                </h2>
                <div className="mt-2 mr-7 flex shrink-0 items-center gap-1.5 sm:mr-4">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      inStock ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`font-sans text-[11px] font-semibold ${
                      inStock ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            {product.description && (
              <p className="text-muted mt-3 font-sans text-sm">
                {product.description}
              </p>
            )}

            <div className="my-4 h-px w-full bg-[#F0EAF1]" />

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-muted w-[70px] shrink-0 font-sans text-[10px] font-bold tracking-[0.12em] uppercase">
                Strength
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedVariant(index)}
                    aria-pressed={selectedVariant === index}
                    className={`rounded-xl border px-4 py-2.5 font-sans text-[12px] font-semibold transition-all ${
                      selectedVariant === index
                        ? "border-primary bg-primary text-white"
                        : "text-primary hover:border-primary border-[#E8DFEA] bg-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-muted w-[70px] shrink-0 font-sans text-[10px] font-bold tracking-[0.12em] uppercase">
                Quantity
              </span>
              <div className="flex h-10 items-center rounded-full border border-[#E8DFEA] px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="text-primary hover:bg-accent-light flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-30"
                >
                  <Minus size={15} />
                </button>
                <span className="text-primary w-8 text-center font-sans text-[13px] font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(availablePacks, q + 1))
                  }
                  disabled={!inStock || quantity >= availablePacks}
                  aria-label="Increase quantity"
                  className="text-primary hover:bg-accent-light flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-30"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="my-5 h-px w-full bg-[#F0EAF1]" />

            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-muted font-sans text-[11px] font-bold tracking-[0.14em] uppercase">
                Bundle & Save
              </h3>
              <span className="text-secondary rounded-full bg-[#FFF0E5] px-3 py-1.5 font-sans text-[10px] font-bold">
                Up to 15% OFF
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PACK_OPTIONS.map((item) => {
                const selected = selectedPack === item.quantity;
                const price = getPackPrice(
                  unitPrice,
                  item.quantity,
                  item.discountPercent,
                );

                return (
                  <button
                    key={item.quantity}
                    type="button"
                    onClick={() =>
                      setSelectedPack(selected ? null : item.quantity)
                    }
                    aria-pressed={selected}
                    className={`group relative flex min-w-0 flex-col items-center rounded-[14px] border px-2 pt-5 pb-3 transition-all duration-300 ${
                      selected
                        ? "border-primary bg-[#F8EFF9]"
                        : "hover:border-primary/40 border-[#EAE3EB] bg-white"
                    }`}
                  >
                    <span
                      className={`absolute -top-2 right-2 rounded-md px-2 py-1 font-sans text-[9px] font-bold ${
                        selected
                          ? "bg-primary text-white"
                          : "text-primary bg-[#F3E4F4]"
                      }`}
                    >
                      -{item.discountPercent}%
                    </span>

                    <div className="flex h-14 items-end justify-center">
                      {Array.from({
                        length: Math.min(item.quantity, 3),
                      }).map((_, index) => (
                        <div
                          key={index}
                          className={`relative h-[55px] w-[32px] shrink-0 ${
                            index > 0 ? "-ml-3" : ""
                          }`}
                          style={{ zIndex: 3 - index }}
                        >
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt=""
                              fill
                              sizes="32px"
                              className="object-contain transition-transform duration-300 group-hover:-translate-y-1"
                            />
                          ) : (
                            <FlaskConical
                              size={24}
                              className="text-primary/30 mt-3"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="font-heading text-primary mt-2 text-[12px] font-bold sm:text-[13px]">
                      {item.label}
                    </p>

                    <p className="text-primary/70 mt-1 font-sans text-[11px] font-semibold">
                      {hasPrice ? formatMoney(price) : "—"}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className="group bg-primary hover:bg-primary-dark flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-4 font-sans text-[12px] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13px]"
                >
                  <ShoppingBag size={17} className="shrink-0" />
                  <span>
                    {!inStock
                      ? "Out of Stock"
                      : !hasPrice
                        ? "Unavailable"
                        : "Add to Cart"}
                  </span>
                  <ArrowRight size={16} className="hidden sm:block" />
                </button>

                <div className="shrink-0 text-right">
                  <span className="font-heading text-primary text-[20px] font-bold sm:text-[23px]">
                    {hasPrice ? formatMoney(totalPrice) : "—"}
                  </span>
                </div>
              </div>
              {cartError && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                  {cartError}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, FlaskConical } from "lucide-react";

export default function ProductCard({ product, onQuickView }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.defaultVariant ?? 0,
  );

  const variant = product.variants[selectedVariant];

  const formatPrice = (price) => {
    if (price == null) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <article className="group hover:border-primary/20 relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#EEE5EF] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(85,32,95,0.1)]">
      <div className="relative aspect-4/4 overflow-hidden bg-[#F8EFF9]">
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#E9C6EE]/50 blur-[65px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/80 blur-[65px]" />

        <button
          type="button"
          onClick={() => onQuickView?.(product)}
          aria-label={`Quick view ${product.name}`}
          className="text-primary hover:bg-primary absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:text-white"
        >
          <Eye size={20} strokeWidth={1.7} />
        </button>

        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="relative flex h-full w-full items-center justify-center p-8"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover drop-shadow-[0_20px_18px_rgba(65,20,75,0.15)] transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="border-primary/10 flex h-24 w-24 items-center justify-center rounded-[28px] border bg-white/60">
                <FlaskConical
                  size={42}
                  strokeWidth={1.1}
                  className="text-primary/45"
                />
              </div>
              <span className="text-primary/40 font-sans text-[11px] font-medium tracking-[0.15em] uppercase">
                Spectrum Biosciences
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/products/${product.slug}`} className="group/title">
          <h3 className="font-heading text-primary group-hover/title:text-primary-light sm:text-md leading-[1.35] font-semibold tracking-[-0.04em] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-2">
            {product.variants.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedVariant(index)}
                aria-pressed={selectedVariant === index}
                className={`min-h-9 rounded-full border px-3.5 py-1.5 font-sans text-[12px] font-semibold transition-all duration-300 ${
                  selectedVariant === index
                    ? "border-primary bg-primary text-white"
                    : "text-primary hover:border-primary border-[#E7DCE9] bg-[#FAF7FB]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#F0E8F1] pt-4">
            <div>
              <p className="font-heading text-primary text-[20px] font-bold tracking-tight">
                {formatPrice(variant.price) ?? "Price pending"}
              </p>
            </div>

            <Link
              href={`/products/${product.slug}?variant=${encodeURIComponent(variant.id)}`}
              aria-label={`View ${product.name} ${variant.label}`}
              className="bg-primary hover:bg-secondary flex h-12 w-12 items-center justify-center rounded-full text-white transition-all duration-300"
            >
              <ArrowUpRight
                size={21}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

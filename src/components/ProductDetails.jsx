"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileCheck2,
  FlaskConical,
  Headphones,
  LockKeyhole,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Truck,
  ZoomIn,
  X,
} from "lucide-react";
import {
  PACK_OPTIONS,
  getPackPrice,
  formatMoney,
} from "@/data/product-detail-config";

import { products } from "@/data/products";
import Bestsellers from "./Bestsellers";

import { useCart } from "@/context/CartContext";

const money = (value) => formatMoney(Number(value) || 0);

function Gallery({ product }) {
  const images = useMemo(
    () => [
      ...new Set([product.image, ...(product.gallery || [])].filter(Boolean)),
    ],
    [product.image, product.gallery],
  );
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setActive(0);
    setZoom(false);
  }, [product.slug]);

  useEffect(() => {
    if (!zoom) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event) => event.key === "Escape" && setZoom(false);
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [zoom]);

  const current = images[active] || images[0];

  return (
    <>
      <div className="lg:sticky lg:top-[100px]">
        <div className="relative h-[350px] w-full overflow-hidden rounded-[26px] sm:h-[450px] lg:h-[480px] xl:h-[510px]">
          {current ? (
            <Image
              key={current}
              src={current}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FlaskConical size={80} className="text-primary/25" />
            </div>
          )}

          {current && (
            <button
              type="button"
              onClick={() => setZoom(true)}
              aria-label="Enlarge product image"
              className="text-primary hover:bg-primary absolute right-5 bottom-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:text-white"
            >
              <ZoomIn size={19} />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-pressed={active === index}
                onClick={() => setActive(index)}
                className={`relative h-[76px] w-[76px] overflow-hidden rounded-xl border-2 bg-[#F9F3FA] transition-colors ${active === index ? "border-primary" : "hover:border-primary/30 border-transparent"}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="76px"
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
        <p className="mt-4 flex items-center gap-2 text-[11px] text-[#786D7C]">
          <FlaskConical size={15} className="text-primary" /> For laboratory
          research only
        </p>
      </div>

      {zoom && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} enlarged image`}
          onMouseDown={(event) =>
            event.target === event.currentTarget && setZoom(false)
          }
          className="fixed inset-0 z-[200] grid place-items-center bg-[#180B1D]/90 p-5 backdrop-blur-lg"
        >
          <button
            type="button"
            onClick={() => setZoom(false)}
            aria-label="Close enlarged image"
            className="text-primary absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white"
          >
            <X size={21} />
          </button>
          <div className="relative h-[80dvh] w-full max-w-[850px]">
            <Image
              src={current}
              alt={product.name}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

function Strengths({ variants, index, setIndex }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-bold tracking-widest text-[#29232D] uppercase">
        <span>Strength</span>
        <span className="text-primary tracking-normal normal-case">
          {variants[index]?.label}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {variants.map((variant, i) => {
          const selected = i === index;
          return (
            <button
              key={variant.id || i}
              type="button"
              disabled={variant.inStock === false}
              aria-pressed={selected}
              onClick={() => setIndex(i)}
              className={`relative min-h-[70px] rounded-2xl border-2 px-2 py-3 transition-all disabled:cursor-not-allowed disabled:opacity-40 ${selected ? "border-primary text-primary bg-[#F7EBF9]" : "hover:border-primary/40 border-[#EAE1EC] text-[#514653]"}`}
            >
              {selected && (
                <Check
                  size={13}
                  className="text-primary absolute top-2 right-2"
                />
              )}
              <span className="font-heading block text-[16px] font-bold sm:text-lg">
                {variant.label}
              </span>
              <span className="mt-1 block text-[11px] opacity-70">
                {variant.inStock === false ? "Sold out" : money(variant.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Packs({ product, price, selectedPack, setSelectedPack, stock }) {
  return (
    <section className="mt-7" aria-labelledby="packs-title">
      <div className="mb-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-secondary text-[10px] font-bold tracking-[0.15em] uppercase">
            More bottles. More savings.
          </p>
          <h2
            id="packs-title"
            className="font-heading mt-1 text-xl font-bold tracking-tight text-[#29232D]"
          >
            Bundle & Save
          </h2>
        </div>
        <span className="text-secondary rounded-full bg-[#FFF0E5] px-3 py-1.5 text-[10px] font-bold">
          UP TO 15% OFF
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {PACK_OPTIONS.map((pack) => {
          const selected = selectedPack === pack.quantity;
          const unavailable = pack.quantity > stock;
          return (
            <button
              type="button"
              key={pack.quantity}
              disabled={unavailable}
              aria-pressed={selected}
              onClick={() => setSelectedPack(selected ? null : pack.quantity)}
              className={`group relative flex min-w-0 flex-col items-center rounded-2xl border-2 px-1 pt-6 pb-3 transition-all disabled:cursor-not-allowed disabled:opacity-40 ${selected ? "border-primary bg-[#F8EFF9] shadow-[0_8px_20px_rgba(85,32,95,0.08)]" : "hover:border-primary/40 border-[#EAE3EB] bg-white"}`}
            >
              <span
                className={`absolute -top-2 right-1 rounded-full px-2 py-1 text-[9px] font-extrabold ${selected ? "bg-primary text-white" : "text-secondary bg-[#FFF0E5]"}`}
              >
                -{pack.discountPercent}%
              </span>
              <div className="flex h-[64px] items-end justify-center">
                {Array.from({ length: Math.min(pack.quantity, 3) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      style={{ zIndex: 3 - i }}
                      className={`relative h-[62px] w-[36px] shrink-0 ${i > 0 ? "-ml-4" : ""}`}
                    >
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-contain drop-shadow-[0_6px_5px_rgba(45,15,55,0.16)] transition-transform duration-300 group-hover:-translate-y-1"
                        />
                      ) : (
                        <FlaskConical
                          size={27}
                          className="text-primary/25 mt-4"
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
              <span className="font-heading text-primary mt-2 text-[12px] font-bold sm:text-[14px]">
                {pack.label}
              </span>
              <strong className="mt-1 text-[13px] text-[#29232D] sm:text-[15px]">
                {money(
                  getPackPrice(price, pack.quantity, pack.discountPercent),
                )}
              </strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Quantity({ value, onChange, max }) {
  return (
    <div className="flex h-12 w-[142px] items-center justify-between rounded-full border border-[#E6DCE8] px-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="text-primary grid h-9 w-9 place-items-center rounded-full hover:bg-[#F6E5F7] disabled:opacity-30"
      >
        <Minus size={17} />
      </button>
      <span className="font-heading text-primary font-bold">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="text-primary grid h-9 w-9 place-items-center rounded-full hover:bg-[#F6E5F7] disabled:opacity-30"
      >
        <Plus size={17} />
      </button>
    </div>
  );
}

function Assurance({ product }) {
  const rows = [
    {
      icon: Package,
      title: "Packaging",
      description: "Packaging details are provided with your order.",
    },
    {
      icon: Truck,
      title: "Shipping",
      description: "Delivery rates and options appear at checkout.",
    },
    {
      icon: FileCheck2,
      title: "Documentation",
      description: product.coa
        ? "Product certificate available."
        : "Ask our team about available batch certificates.",
      href: product.coa || "/contact",
      text: product.coa ? "View certificate" : "Contact us",
      external: Boolean(product.coa),
    },
    {
      icon: Headphones,
      title: "Need help?",
      description: "Contact us with product questions.",
      href: "/contact",
      text: "Contact us",
    },
  ];
  return (
    <div className="mt-7 divide-y divide-[#EDE6EE] rounded-[20px] border border-[#EDE6EE] bg-[#FCFAFC] px-5">
      {rows.map((row) => {
        const Icon = row.icon;
        return (
          <div key={row.title} className="flex gap-3 py-4">
            <div className="text-primary grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F5E8F7]">
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#29232D]">
                {row.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[#756B78]">
                {row.description}
              </p>
              {row.href && (
                <Link
                  href={row.href}
                  target={row.external ? "_blank" : undefined}
                  rel={row.external ? "noopener noreferrer" : undefined}
                  className="text-primary hover:text-secondary mt-1 inline-flex items-center gap-1 text-[11px] font-semibold"
                >
                  {row.text}
                  <ArrowUpRight size={12} />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Documentation({ product }) {
  const batches = Array.isArray(product.batches) ? product.batches : [];
  return (
    <section
      id="documentation"
      className="scroll-mt-28 border-t border-[#EEE7EF] py-14 sm:py-20"
      aria-labelledby="documentation-title"
    >
      <p className="text-secondary text-[11px] font-bold tracking-widest uppercase">
        Batch records
      </p>
      <h2
        id="documentation-title"
        className="font-heading mt-2 text-[clamp(28px,4vw,42px)] font-bold tracking-tight text-[#29232D]"
      >
        Laboratory Documentation
      </h2>
      <p className="text-md mt-2 max-w-2xl leading-relaxed text-[#756B78]">
        Review certificates where available, and match the lot number on your
        vial with the certificate.
      </p>
      {batches.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch, i) => (
            <article
              key={batch.lot || i}
              className="rounded-2xl border border-[#EDE5EE] bg-[#FCFAFC] p-5"
            >
              <div className="flex items-center justify-between">
                <FileCheck2 className="text-primary" />
                <span className="text-primary rounded-full bg-[#F6E5F7] px-3 py-1 text-xs">
                  Lot {batch.lot || "—"}
                </span>
              </div>
              <h3 className="font-heading mt-5 text-xl font-bold text-[#29232D]">
                {product.name}
              </h3>
              <p className="mt-1 text-xs text-[#756B78]">
                {batch.laboratory || "Certificate"}
              </p>
              <dl className="mt-5 space-y-3">
                {[
                  ["Reported purity", batch.purity],
                  ["Identity", batch.identity],
                  ["Net content", batch.netContent],
                  ["Tested", batch.testedAt],
                ]
                  .filter(([, value]) => value != null && value !== "")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-3 text-xs"
                    >
                      <dt className="text-[#756B78]">{key}</dt>
                      <dd className="font-semibold text-[#29232D]">{value}</dd>
                    </div>
                  ))}
              </dl>
              {batch.coaUrl && (
                <a
                  href={batch.coaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold text-white"
                >
                  View PDF <ArrowUpRight size={15} />
                </a>
              )}
            </article>
          ))}
        </div>
      ) : product.coa ? (
        <a
          href={product.coa}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white"
        >
          View Certificate <ArrowUpRight size={16} />
        </a>
      ) : (
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#F7F0F9] p-6">
          <div>
            <h3 className="font-heading text-primary text-lg font-bold">
              Looking for a batch certificate?
            </h3>
            <p className="mt-2 text-sm text-[#756B78]">
              No certificate is currently linked to this product. Contact us to
              ask about documentation.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-primary rounded-full px-5 py-3 text-sm font-semibold text-white"
          >
            Request information
          </Link>
        </div>
      )}
      <p className="mt-4 text-xs leading-relaxed text-[#827789]">
        Reported results apply to the specific documented batch only. Check the
        original certificate for methods and limits.
      </p>
    </section>
  );
}

function Information({ product }) {
  return (
    <section className="grid gap-8 border-t border-[#EEE7EF] py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div>
        <p className="text-secondary text-xs font-bold tracking-widest uppercase">
          The details
        </p>
        <h2 className="font-heading mt-3 text-[clamp(30px,4vw,44px)] font-bold tracking-tight text-[#29232D]">
          Compound Information<span className="text-secondary">.</span>
        </h2>
        <p className="text-primary mt-5 inline-flex items-center gap-2 rounded-full bg-[#F6E5F7] px-4 py-3 text-xs font-bold">
          <FlaskConical size={17} /> For Research Use Only
        </p>
      </div>
      <div className="space-y-8 text-sm leading-[1.85] text-[#756B78]">
        <article>
          <h3 className="font-heading mb-3 text-xl font-bold text-[#29232D]">
            About {product.name}
          </h3>
          <p>
            {product.longDescription ||
              product.description ||
              `${product.name} is listed in the Spectrum Biosciences research collection for laboratory use only.`}
          </p>
        </article>
        <article className="border-t border-[#EEE7EF] pt-7">
          <h3 className="font-heading mb-3 text-xl font-bold text-[#29232D]">
            Handling & Storage
          </h3>
          <p>
            Follow product-specific documentation and your laboratory's standard
            operating procedures. Maintain appropriate storage conditions, safe
            handling practices, and batch records.
          </p>
        </article>
        <article className="border-t border-[#EEE7EF] pt-7">
          <h3 className="font-heading mb-3 text-xl font-bold text-[#29232D]">
            Research Use Disclaimer
          </h3>
          <p>
            For scientific and laboratory research only. Not intended for human
            consumption, veterinary use, or clinical administration. No dosing
            or administration instructions are provided.
          </p>
        </article>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Is this product intended for human use?",
    a: "No. Products in this research collection are intended only for scientific and laboratory research.",
  },
  {
    q: "Where can I find a Certificate of Analysis?",
    a: "Check the laboratory documentation section for available certificates, or contact our team to ask about the relevant batch.",
  },
  {
    q: "How should research compounds be stored?",
    a: "Follow product-specific documentation and your laboratory's established procedures; requirements vary by compound.",
  },
  {
    q: "How do multi-bottle packs work?",
    a: "Choose a strength, select a 2-, 5-, or 10-bottle pack, then set the number of packs. The displayed total includes the applicable pack discount.",
  },
];

function RelatedProducts({ currentProduct }) {
  const relatedProducts = products
    .filter(
      (product) =>
        product.slug !== currentProduct.slug && product.active !== false,
    )
    .sort((a, b) => {
      const aMatch = a.category === currentProduct.category ? 1 : 0;
      const bMatch = b.category === currentProduct.category ? 1 : 0;

      return bMatch - aMatch;
    })
    .slice(0, 4);

  if (!relatedProducts.length) return null;

  return (
    <section
      aria-labelledby="related-products-title"
      className="border-t border-[#EEE7EF] bg-[#FBF8FC] px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADING */}

        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="text-secondary font-sans text-[11px] font-bold tracking-[0.18em] uppercase">
              Explore More
            </span>

            <h2
              id="related-products-title"
              className="font-heading mt-3 text-[clamp(30px,4vw,48px)] leading-tight font-bold tracking-[-0.06em] text-[#29232D]"
            >
              You May Also <span className="text-primary">Like.</span>
            </h2>

            <p className="mt-3 max-w-[470px] font-sans text-[13px] leading-relaxed text-[#756B78]">
              Continue exploring the Spectrum Biosciences research collection.
            </p>
          </div>

          <Link
            href="/shop"
            className="group text-primary hover:text-secondary inline-flex items-center gap-2 font-sans text-[12px] font-bold transition-colors"
          >
            View All Products
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </Link>
        </div>

        {/* PRODUCT GRID */}

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {relatedProducts.map((product) => {
            const variant =
              product.variants?.[product.defaultVariant ?? 0] ||
              product.variants?.[0];

            const price = Number(variant?.price);

            return (
              <article
                key={product.id}
                className="group hover:border-primary/20 min-w-0 overflow-hidden rounded-[20px] border border-[#EEE7EF] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(85,32,95,0.08)] sm:rounded-[25px]"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  {/* PRODUCT IMAGE */}

                  <div className="relative aspect-[4/4.5] overflow-hidden bg-[#F6F0F7]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FlaskConical size={55} className="text-primary/20" />
                      </div>
                    )}

                    {product.badge && (
                      <span className="text-primary absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1.5 font-sans text-[9px] font-bold shadow-sm sm:top-4 sm:left-4">
                        {product.badge}
                      </span>
                    )}

                    {/* ARROW */}

                    <span className="text-primary group-hover:bg-primary absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 group-hover:rotate-45 group-hover:text-white sm:right-4 sm:bottom-4 sm:h-10 sm:w-10">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  {/* PRODUCT DETAILS */}

                  <div className="p-4 sm:p-5">
                    <span className="text-secondary font-sans text-[9px] font-bold tracking-[0.12em] uppercase sm:text-[10px]">
                      {product.category || "Research Compound"}
                    </span>

                    <h3 className="font-heading group-hover:text-primary mt-2 line-clamp-2 min-h-[42px] text-[15px] leading-[1.3] font-bold tracking-[-0.035em] text-[#29232D] transition-colors sm:text-[19px]">
                      {product.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EEE7EF] pt-4">
                      <div>
                        <span className="block font-sans text-[10px] text-[#918597]">
                          Starting at
                        </span>

                        <span className="font-heading text-primary mt-1 block text-[18px] font-bold sm:text-[21px]">
                          {Number.isFinite(price)
                            ? formatMoney(price)
                            : "View Options"}
                        </span>
                      </div>

                      {variant?.label && (
                        <span className="text-primary rounded-full bg-[#F6E5F7] px-2.5 py-1.5 font-sans text-[10px] font-semibold">
                          {variant.label}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  const [open, setOpen] = useState(0);
  return (
    <section className="grid gap-8 border-t border-[#EEE7EF] pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div>
        <p className="text-secondary text-xs font-bold tracking-widest uppercase">
          Need to know
        </p>
        <h2 className="font-heading mt-3 text-[clamp(30px,4vw,44px)] font-bold tracking-tight text-[#29232D]">
          Product FAQs<span className="text-secondary">.</span>
        </h2>
        <Link
          href="/contact"
          className="text-primary mt-5 inline-flex items-center gap-2 text-xs font-bold"
        >
          Ask a question <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="divide-y divide-[#EEE7EF] border-t border-[#EEE7EF]">
        {faqs.map((faq, i) => (
          <article key={faq.q} className="py-5">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              aria-controls={`product-faq-${i}`}
              className="font-heading flex w-full items-center justify-between gap-4 text-left text-[16px] font-semibold text-[#29232D] sm:text-lg"
            >
              {faq.q}
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all ${open === i ? "bg-primary rotate-45 text-white" : "text-primary bg-[#F6E5F7]"}`}
              >
                <Plus size={17} />
              </span>
            </button>
            <div
              id={`product-faq-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pt-4 pr-8 text-sm leading-relaxed text-[#756B78]">
                  {faq.a}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ProductDetails({ product }) {
  const variants = product.variants || [];
  const [variantIndex, setVariantIndex] = useState(product.defaultVariant ?? 0);
  const [selectedPack, setSelectedPack] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");

  const { addItem } = useCart();

  useEffect(() => {
    setVariantIndex(product.defaultVariant ?? 0);
    setSelectedPack(null);
    setQuantity(1);
    setCartMessage("");
  }, [product.slug, product.defaultVariant]);

  useEffect(() => {
    if (!cartMessage) return;
    const id = setTimeout(() => setCartMessage(""), 3500);
    return () => clearTimeout(id);
  }, [cartMessage]);

  const variant = variants[variantIndex] || variants[0];
  const pack = PACK_OPTIONS.find((item) => item.quantity === selectedPack);
  const packSize = pack?.quantity ?? 1;
  const discountPercent = pack?.discountPercent ?? 0;
  const unitPrice = Number(variant?.price ?? 0);
  const hasPrice = variant?.price != null && Number.isFinite(unitPrice);
  const packPrice = getPackPrice(unitPrice, packSize, discountPercent);
  const totalPrice = Math.round(packPrice * quantity * 100) / 100;
  const totalBottles = packSize * quantity;
  const savings = Math.max(
    0,
    Math.round((unitPrice * totalBottles - totalPrice) * 100) / 100,
  );
  const stock =
    variant?.stock == null ? Infinity : Math.max(0, Number(variant.stock));
  const maxPacks = Math.min(99, Math.floor(stock / packSize));
  const canAdd = hasPrice && variant?.inStock !== false && quantity <= maxPacks;

  const changeVariant = (index) => {
    setVariantIndex(index);
    setQuantity(1);
  };
  const changePack = (size) => {
    setSelectedPack(size);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!variant || !canAdd) {
      setCartMessage("Selected quantity is unavailable.");
      return;
    }

    try {
      // CartContext stores one row per product, strength, and selected pack.
      // Its addItem() opens CartDrawer automatically.
      addItem(product, variant, quantity, {
        packSize,
        discountPercent,
      });
      setCartMessage("");
    } catch (error) {
      setCartMessage(error?.message || "Unable to add product to cart.");
    }
  };

  return (
    <main className="min-h-screen bg-white pb-20 lg:pb-0">
      <section className="px-4 pt-8 pb-16 sm:px-6 lg:px-10 lg:pt-12">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 xl:gap-16">
          <Gallery product={product} />
          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#827789]"
            >
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <ChevronRight size={13} />
              <Link href="/shop" className="hover:text-primary">
                Shop
              </Link>
              <ChevronRight size={13} />
              <span className="text-primary font-semibold">{product.name}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-primary rounded-full bg-[#F6E5F7] px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                {product.category || "Research compound"}
              </span>
            </div>
            <h1 className="font-heading mt-4 text-[clamp(34px,4vw,54px)] leading-tight font-extrabold tracking-[-0.06em] text-[#29232D]">
              {product.name}
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-[1.8] text-[#756B78] sm:text-sm">
              {product.description ||
                `${product.name} is part of the Spectrum Biosciences collection for scientific and laboratory research.`}
            </p>
            <div className="my-6 h-px bg-[#EEE7EF]" />
            <Strengths
              variants={variants}
              index={variantIndex}
              setIndex={changeVariant}
            />
            <Packs
              product={product}
              price={unitPrice}
              selectedPack={selectedPack}
              setSelectedPack={changePack}
              stock={variant?.inStock === false ? 0 : stock}
            />
            <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
              <div>
                <Quantity
                  value={quantity}
                  onChange={setQuantity}
                  max={Math.max(1, maxPacks)}
                />
              </div>
              <div className="text-right">
                <p className="font-heading text-primary text-[32px] font-extrabold tracking-tight">
                  {hasPrice ? money(totalPrice) : "Unavailable"}
                </p>
              </div>
            </div>
            {savings > 0 && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#F7DDC8] bg-[#FFF3E9] px-4 py-3 text-xs font-semibold">
                <span className="text-[#8D512D]">Bundle savings</span>
                <span className="text-secondary font-bold">
                  -{money(savings)}
                </span>
              </div>
            )}
            <button
              type="button"
              disabled={!canAdd}
              onClick={handleAddToCart}
              className="group bg-primary mt-6 flex w-full items-center justify-between rounded-full p-2 pl-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(85,32,95,0.2)] transition-all hover:bg-[#35143E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={19} />
                {canAdd ? "Add to Cart" : "Unavailable"}
              </span>
              <span className="flex items-center gap-3">
                {hasPrice && money(totalPrice)}
                <span className="text-primary grid h-11 w-11 place-items-center rounded-full bg-white transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={19} />
                </span>
              </span>
            </button>
            {cartMessage && (
              <p
                role="status"
                className="text-primary mt-3 rounded-xl bg-[#F6E5F7] px-4 py-3 text-xs font-semibold"
              >
                {cartMessage}
              </p>
            )}
            <a
              href="#documentation"
              className="text-primary mt-4 flex items-center justify-center gap-2 text-xs font-bold hover:underline"
            >
              <FileCheck2 size={16} /> View laboratory documentation{" "}
              <ArrowUpRight size={14} />
            </a>
            <Assurance product={product} />
            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-[#827789]">
              <LockKeyhole size={14} /> Checkout subject to{" "}
              <Link href="/terms" className="text-primary font-bold underline">
                terms of sale
              </Link>
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Documentation product={product} />
        <Information product={product} />
        <FAQs />
      </div>

      <Bestsellers currentProduct={product} />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EDE5EE] bg-white/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-8px_30px_rgba(40,0,45,0.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-[#756B78]">
              {variant?.label} · {totalBottles} bottles
            </p>
            <p className="font-heading text-primary text-xl font-extrabold">
              {money(totalPrice)}
            </p>
          </div>
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAddToCart}
            className="bg-primary flex h-12 items-center gap-2 rounded-full px-5 text-xs font-bold text-white disabled:opacity-50"
          >
            <ShoppingBag size={17} /> Add to Cart <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}

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
        <div className="relative h-[350px] w-full overflow-hidden rounded-[26px] sm:h-130 lg:h-[480px] xl:h-[510px]">
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
    </>
  );
}

function Strengths({ variants, index, setIndex }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-bold text-[#29232D]">
          Select Strength
        </span>

        <span className="text-primary text-[12px] font-semibold">
          {variants[index]?.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {variants.map((variant, i) => {
          const selected = i === index;
          const soldOut = variant.inStock === false;

          return (
            <button
              key={variant.id || i}
              type="button"
              disabled={soldOut}
              aria-pressed={selected}
              onClick={() => setIndex(i)}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-5 py-2 text-[13px] font-semibold transition-all duration-300 ${
                selected
                  ? "border-primary bg-primary text-white"
                  : "hover:border-primary hover:text-primary border-[#E8DCEA] bg-white text-[#514653]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {variant.label}
              {soldOut && (
                <span className="ml-1.5 text-[10px] font-normal">
                  (Sold out)
                </span>
              )}
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
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-secondary text-[11px] font-bold tracking-[0.12em] uppercase">
            More bottles. More savings.
          </p>
          <h2
            id="packs-title"
            className="font-heading mt-1 text-[22px] font-bold tracking-tight text-[#29232D]"
          >
            Bundle & Save
          </h2>
        </div>

        <span className="text-secondary rounded-full bg-[#FFF0E5] px-3 py-1.5 text-[11px] font-bold">
          UP TO 15% OFF
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {PACK_OPTIONS.map((pack) => {
          const selected = selectedPack === pack.quantity;
          const unavailable = pack.quantity > stock;

          const total = getPackPrice(
            price,
            pack.quantity,
            pack.discountPercent,
          );

          return (
            <button
              key={pack.quantity}
              type="button"
              disabled={unavailable}
              aria-pressed={selected}
              onClick={() => setSelectedPack(selected ? null : pack.quantity)}
              className={`group relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-all duration-300 sm:gap-4 sm:px-4 ${
                selected
                  ? "border-primary bg-[#F8EFF9] shadow-[0_6px_20px_rgba(85,32,95,0.06)]"
                  : "hover:border-primary/40 border-[#EAE3EB] bg-white hover:bg-[#FCF8FD]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  selected ? "border-primary" : "border-[#D8CBDC]"
                }`}
              >
                {selected && (
                  <span className="bg-primary size-2.5 rounded-full" />
                )}
              </span>

              <div className="flex h-[65px] w-[75px] shrink-0 items-center justify-center rounded-xl bg-[#F7F0F8] sm:w-[90px]">
                <div className="flex items-end justify-center">
                  {Array.from({
                    length: Math.min(pack.quantity, 3),
                  }).map((_, i) => (
                    <div
                      key={i}
                      style={{ zIndex: 3 - i }}
                      className={`relative h-[58px] w-[35px] shrink-0 ${
                        i > 0 ? "-ml-4" : ""
                      }`}
                    >
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="35px"
                          className="object-contain drop-shadow-[0_5px_5px_rgba(45,15,55,0.15)] transition-transform duration-300 group-hover:-translate-y-1"
                        />
                      ) : (
                        <FlaskConical
                          size={25}
                          className="text-primary/30 mt-4"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-primary text-[16px] font-semibold sm:text-[18px]">
                  {pack.label}
                </h3>

                <p className="mt-1 text-sm text-[#817586]">
                  {money(total / pack.quantity)} per bottle
                </p>

                {unavailable && (
                  <p className="mt-1 text-[11px] font-semibold text-red-500">
                    Out of stock
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    selected
                      ? "bg-primary text-white"
                      : "text-secondary bg-[#FFF0E5]"
                  }`}
                >
                  SAVE {pack.discountPercent}%
                </span>

                <strong className="font-heading text-[17px] font-semibold text-[#29232D] sm:text-lg">
                  {money(total)}
                </strong>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Quantity({ value, onChange, max }) {
  return (
    <div className="flex h-[52px] w-[118px] items-center justify-between rounded-full border border-[#E6DCE8] bg-white px-1 sm:w-[142px]">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="text-primary grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-[#F6E5F7] disabled:opacity-30"
      >
        <Minus size={17} />
      </button>

      <span className="font-heading text-primary text-[15px] font-bold">
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="text-primary grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-[#F6E5F7] disabled:opacity-30"
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
      aria-labelledby="documentation-title"
      className="scroll-mt-28 border-t border-[#EEE7EF] py-14 sm:py-20"
    >
      <p className="text-secondary mb-3 text-[11px] font-bold tracking-widest uppercase">
        Batch records
      </p>
      <h2 id="documentation-title" className="section-heading">
        Laboratory Documentation
      </h2>
      <p className="text-md mt-2 max-w-2xl text-[#756B78]">
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
        <p className="text-secondary mb-3 text-xs font-bold tracking-widest uppercase">
          The details
        </p>
        <h2 className="section-heading">
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

function FAQs() {
  const [open, setOpen] = useState(0);
  return (
    <section className="grid gap-8 border-t border-[#EEE7EF] pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div>
        <p className="text-secondary text-xs font-bold tracking-widest uppercase">
          Need to know
        </p>
        <h2 className="section-heading mt-3">
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
    <main className="min-h-screen">
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
            <h1 className="font-heading mt-4 text-[clamp(34px,4vw,54px)] leading-tight font-bold tracking-[-0.06em] text-[#29232D]">
              {product.name}
            </h1>
            <p className="max-w-xl text-[13px] leading-[1.8] text-[#756B78] sm:text-sm">
              {product.description ||
                `${product.name} is part of the Spectrum Biosciences collection for scientific and laboratory research.`}
            </p>
            <div className="text-left">
              <p className="font-heading text-primary mt-2 text-[32px] font-bold tracking-tight">
                {hasPrice ? money(totalPrice) : "Unavailable"}
              </p>
            </div>
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
            <div className="mt-7 flex w-full min-w-0 items-center gap-2 sm:gap-3">
              <div className="shrink-0">
                <Quantity
                  value={quantity}
                  onChange={setQuantity}
                  max={Math.max(1, maxPacks)}
                />
              </div>

              <button
                type="button"
                disabled={!canAdd}
                onClick={handleAddToCart}
                className="group bg-primary flex h-[52px] min-w-0 flex-1 items-center justify-between gap-2 rounded-full py-1 pr-1 pl-4 text-[12px] font-bold text-white shadow-[0_12px_30px_rgba(85,32,95,0.2)] transition-all hover:bg-[#35143E] disabled:cursor-not-allowed disabled:opacity-50 sm:pl-6 sm:text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                  <ShoppingBag size={17} className="hidden shrink-0 sm:block" />
                  {canAdd ? "Add to Cart" : "Unavailable"}
                </span>

                <span className="flex shrink-0 items-center gap-2">
                  {hasPrice && (
                    <span className="hidden whitespace-nowrap md:inline">
                      {money(totalPrice)}
                    </span>
                  )}

                  <span className="text-primary grid size-10 shrink-0 place-items-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </span>
                </span>
              </button>
            </div>
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
              <Link
                href="/terms-and-conditions"
                className="text-primary font-bold underline"
              >
                terms of sale
              </Link>
            </p>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Documentation product={product} />
          <Information product={product} />
          <FAQs />
        </div>
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

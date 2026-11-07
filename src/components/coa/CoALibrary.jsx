"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  FileCheck2,
  FileSearch,
  Search,
  FileText,
} from "lucide-react";

import { products } from "@/data/products";
import { coaRecords } from "@/data/coa-records";
import CustomSelect from "../CustomSelect";

function CoACard({ product }) {
  const [variantIndex, setVariantIndex] = useState(product.defaultVariant ?? 0);

  const variants = product.variants || [];
  const variant = variants[variantIndex] || variants[0];

  const realRecord =
    coaRecords[`${product.slug}:${variant?.id}`] ||
    coaRecords[variant?.id] ||
    null;

  const sampleNumber = Number(product.id) * 17 + variantIndex * 13;
  const samplePurity = (98.5 + (sampleNumber % 140) / 100).toFixed(2);

  const record = realRecord || {
    demo: true,
    purity: samplePurity,
    lot: `DEMO-${String(product.id).padStart(3, "0")}-${variantIndex + 1}`,
    accession: `SAMPLE-${String(sampleNumber).padStart(6, "0")}`,
    testDate: "Sample record · 2026",
    results: [
      { name: "Identity (LC-MS)", value: product.name, status: "Example" },
      {
        name: "Purity (HPLC-UV)",
        value: `${samplePurity}%`,
        status: "Example",
      },
      { name: "Net content", value: variant?.label, status: "Example" },
      { name: "Microbial (PCR)", value: "Not tested", status: "Sample only" },
      { name: "Laboratory", value: "Demo laboratory", status: "Sample only" },
    ],
  };

  return (
    <>
      <article className="group hover:border-primary/20 flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#EAE0EC] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(85,32,95,0.08)]">
        <div className="relative aspect-square overflow-hidden bg-[#F8F0FA]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-primary/40 flex h-full items-center justify-center text-sm">
              Image unavailable
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h2 className="font-heading text-primary group-hover/title:text-secondary text-[16px] leading-[1.35] font-semibold tracking-[-0.04em] transition-colors sm:text-[18px]">
            {product.name}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {variants.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setVariantIndex(index)}
                aria-pressed={variantIndex === index}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  variantIndex === index
                    ? "border-primary bg-primary text-white"
                    : "text-primary hover:border-primary border-[#E8DCEA] bg-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* <div className="mt-3 flex items-end justify-between gap-3 border-t border-[#EEE6EF] pt-4">
            <div>
              <strong className="font-heading text-primary group-hover/title:text-secondary text-[18px] leading-[1.35] font-semibold tracking-[-0.04em] transition-colors sm:text-[20px]">
                {record.purity != null
                  ? `${Number(record.purity).toFixed(2)}%`
                  : "—"}
              </strong>
            </div>
            <FileText size={23} strokeWidth={1.4} className="text-primary/30" />
          </div> */}

          {/* <div className="mt-4 flex items-center justify-between gap-3 text-xs">
            <span className="text-[#8A798E]">Lot</span>
            <span className="text-primary truncate font-semibold">
              {record.lot || "Not published"}
            </span>
          </div> */}

          <a
            href="/assets/certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#35143E]"
          >
            View COA
          </a>
        </div>
      </article>
    </>
  );
}

export default function CoALibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const catalog = useMemo(
    () =>
      products
        .filter((product) => product.active !== false)
        .flatMap((product) =>
          (product.variants || []).map((variant) => ({
            product,
            variant,
            record: coaRecords[`${product.slug}:${variant.id}`] || null,
          })),
        ),
    [],
  );
  const categories = useMemo(
    () => [
      ...new Set(
        catalog.map(({ product }) => product.category).filter(Boolean),
      ),
    ],
    [catalog],
  );
  const filtered = useMemo(
    () =>
      catalog.filter(({ product, variant, record }) => {
        if (filter === "available" && (record?.demo || !record?.pdfUrl))
          return false;
        if (filter === "pending" && !record?.demo && record?.pdfUrl)
          return false;
        if (category !== "all" && product.category !== category) return false;
        return `${product.name} ${product.slug} ${product.category || ""} ${variant.label} ${record?.lot || ""} ${record?.accession || ""}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      }),
    [catalog, query, filter, category],
  );
  const availableCount = catalog.filter(({ record }) =>
    Boolean(record?.pdfUrl && !record?.demo),
  ).length;

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-[#EEE6EF] px-4 py-6 sm:px-6 md:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-secondary mb-4 flex items-center gap-2 font-sans text-xs font-bold tracking-[0.15em] uppercase">
            Spectrum Biosciences
          </p>
          <h1 className="section-heading">
            Certificates of <span className="text-secondary">Analysis.</span>
          </h1>
          <p className="text-md mt-2 max-w-2xl text-[#817586]">
            Explore product-strength testing information. Hover over a card to
            view sample data and replace it with verified, batch-specific
            reports when available.
          </p>
        </div>
      </header>

      <section
        aria-label="Certificate of Analysis library"
        className="relative px-4 py-10 sm:px-6 sm:py-14 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex min-w-0 flex-col gap-3 border-b border-[#EEE6EF] pb-6 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative w-full min-w-0 sm:flex-1 lg:max-w-[390px]">
              <Search
                size={17}
                className="text-primary/60 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 sm:left-4"
              />
              <label htmlFor="coa-search" className="sr-only">
                Search products or batches
              </label>
              <input
                id="coa-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search compounds..."
                className="focus:border-primary h-11 w-full min-w-0 rounded-2xl border border-[#E8DCEA] bg-white pr-9 pl-9 text-[12px] text-[#29232D] outline-none placeholder:text-[#A69BA9] sm:h-12 sm:pl-11 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="text-primary absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full hover:bg-[#F6E5F7]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <CustomSelect
              id="coa-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Filter category"
              className="w-full sm:w-[190px] sm:shrink-0 lg:ml-auto"
              options={[
                { value: "all", label: "All categories" },
                ...categories.map((name) => ({
                  value: name,
                  label: name,
                })),
              ]}
            />
          </div>
          {filtered.length ? (
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from(
                new Map(
                  filtered.map((item) => [item.product.slug, item.product]),
                ).values(),
              ).map((product) => (
                <CoACard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <FileSearch size={33} className="text-primary/30" />
              <h2 className="font-heading text-primary mt-4 text-xl font-bold">
                No matching records
              </h2>
              <p className="mt-2 text-sm text-[#817586]">
                Try another compound, strength, or filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  setCategory("all");
                }}
                className="bg-primary mt-5 rounded-full px-5 py-3 text-xs font-semibold text-white"
              >
                Clear filters
              </button>
            </div>
          )}
          <p className="mt-12 flex items-start gap-2 border-t border-[#EEE6EF] pt-5 text-xs leading-6 text-[#817586]">
            <FileCheck2 size={17} className="text-primary mt-0.5 shrink-0" />
            Sample laboratory values are placeholders for UI testing only, not
            product certificates or evidence of testing. Display verified
            results and PDFs only after receiving actual batch documentation.
            Research use only.
          </p>
        </div>
      </section>
    </main>
  );
}

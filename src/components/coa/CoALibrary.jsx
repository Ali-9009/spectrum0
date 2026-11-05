"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { createPortal } from "react-dom";

import {
  ArrowUpRight,
  ChevronDown,
  FileCheck2,
  FileSearch,
  Search,
  X,
  FileText,
} from "lucide-react";
import { products } from "@/data/products";
import { coaRecords } from "@/data/coa-records";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value),
  );
const faceStyle = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

function CoACard({ product }) {
  const [variantIndex, setVariantIndex] = useState(product.defaultVariant ?? 0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const isDemo = Boolean(record.demo);
  const available = Boolean(record.pdfUrl && !isDemo);
  const results = Array.isArray(record.results) ? record.results : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") setModalOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modalOpen]);

  return (
    <>
      <article className="group hover:border-primary/20 flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#EAE0EC] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(85,32,95,0.08)]">
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

          <div className="mt-3 flex items-end justify-between gap-3 border-t border-[#EEE6EF] pt-4">
            <div>
              <strong className="font-heading text-primary group-hover/title:text-secondary text-[18px] leading-[1.35] font-semibold tracking-[-0.04em] transition-colors sm:text-[20px]">
                {record.purity != null
                  ? `${Number(record.purity).toFixed(2)}%`
                  : "—"}
              </strong>
            </div>
            <FileText size={23} strokeWidth={1.4} className="text-primary/30" />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs">
            <span className="text-[#8A798E]">Lot</span>
            <span className="text-primary truncate font-semibold">
              {record.lot || "Not published"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-primary mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#35143E]"
          >
            View COA
          </button>
        </div>
      </article>

      {mounted &&
        modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1B1020]/65 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setModalOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="coa-modal-title"
              className="relative max-h-[95dvh] w-full max-w-[1050px] overflow-y-auto rounded-[24px] bg-white shadow-2xl lg:overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close CoA details"
                className="text-primary hover:bg-primary absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-[#F6E5F7] transition-colors hover:text-white"
              >
                <X size={19} />
              </button>

              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-[#EEE6EF] p-5 sm:p-7 lg:border-r lg:border-b-0">
                  <div className="flex items-center justify-between gap-3 pr-10">
                    <span className="text-secondary text-[10px] font-bold tracking-[0.15em] uppercase">
                      {isDemo
                        ? "Sample Laboratory Report"
                        : "Certificate of Analysis"}
                    </span>
                    <span className="text-primary rounded-full bg-[#F6E5F7] px-3 py-1.5 text-[10px] font-semibold">
                      {isDemo
                        ? "Demo Data"
                        : available
                          ? "CoA Available"
                          : "Pending"}
                    </span>
                  </div>

                  <h2
                    id="coa-modal-title"
                    className="font-heading text-primary mt-3 text-[25px] font-bold tracking-[-0.05em] sm:text-[30px]"
                  >
                    {product.name}
                  </h2>

                  <p className="mt-1 text-xs text-[#817586]">
                    {variant?.label} · {record.testDate || "Date not published"}
                  </p>

                  <div className="mt-5 grid grid-cols-[110px_1fr] items-center gap-5 sm:grid-cols-[145px_1fr]">
                    <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[#F8F0FA]">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="145px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-[#8A798E]">
                        {isDemo ? "Sample Purity" : "Reported Purity"}
                      </p>
                      <p className="font-heading text-primary mt-2 text-[clamp(30px,3vw,43px)] leading-none font-bold tracking-[-0.06em]">
                        {record.purity != null
                          ? `${Number(record.purity).toFixed(2)}%`
                          : "—"}
                      </p>
                      <p className="mt-3 text-[11px] leading-5 text-[#817586]">
                        {isDemo
                          ? "Illustrative data. Not verified laboratory results."
                          : "Batch-specific analytical information."}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-5 divide-y divide-[#EEE6EF] rounded-[16px] border border-[#EEE6EF] px-4">
                    {[
                      ["Lot Number", record.lot],
                      ["Accession", record.accession],
                      ["Test Date", record.testDate],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 py-3 text-[11px]"
                      >
                        <dt className="shrink-0 text-[#8A798E]">{label}</dt>
                        <dd className="text-primary text-right font-semibold break-words">
                          {value || "Not published"}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => setModalOpen(false)}
                    className="text-primary mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#E8DCEA] text-[12px] font-semibold transition-colors hover:bg-[#F6E5F7]"
                  >
                    View Compound
                    <ArrowUpRight size={16} />
                  </Link>
                </div>

                <div className="flex flex-col p-5 sm:p-7">
                  <div className="pr-10">
                    <p className="text-secondary text-[10px] font-bold tracking-[0.15em] uppercase">
                      Laboratory Analysis
                    </p>
                    <h3 className="font-heading text-primary mt-2 text-[25px] font-bold tracking-[-0.04em]">
                      Analytical Results
                    </h3>
                    <p className="mt-1 text-xs text-[#817586]">
                      {product.name} · {variant?.label}
                    </p>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[16px] border border-[#EEE6EF]">
                    {results.length > 0 ? (
                      <dl className="divide-y divide-[#EEE6EF]">
                        {results.map((result, index) => (
                          <div
                            key={`${result.name}-${index}`}
                            className="flex items-center justify-between gap-4 px-4 py-3.5"
                          >
                            <div className="min-w-0">
                              <dt className="text-[12px] font-semibold text-[#493D4D]">
                                {result.name}
                              </dt>
                              {result.status && (
                                <p className="mt-1 text-[10px] text-[#938698]">
                                  {result.status}
                                </p>
                              )}
                            </div>
                            <dd className="text-primary max-w-[48%] text-right text-[12px] font-bold break-words">
                              {result.value || "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="p-5 text-sm text-[#817586]">
                        No testing information published.
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    {available ? (
                      <a
                        href={record.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-[12px] font-semibold text-white transition-colors hover:bg-[#35143E]"
                      >
                        Open CoA PDF
                        <ArrowUpRight size={16} />
                      </a>
                    ) : (
                      <div className="rounded-xl bg-[#F8F0FA] px-4 py-3 text-center text-[11px] text-[#817586]">
                        {isDemo
                          ? "Sample record — no verified CoA PDF"
                          : "CoA PDF not available"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>,
          document.body,
        )}
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
      <header className="border-b border-[#EEE6EF] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-secondary mb-3 text-[11px] font-bold tracking-[0.16em] uppercase">
            Spectrum Biosciences
          </p>
          <h1 className="section-heading">
            Certificates of <span className="text-secondary">Analysis.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-md text-[#817586]">
            Explore product-strength testing information. Hover over a card to
            view sample data and replace it with verified, batch-specific
            reports when available.
          </p>
        </div>
      </header>
      <section
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        aria-label="Certificate of Analysis library"
      >
        <div className="flex flex-col gap-4 border-b border-[#EEE6EF] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-[390px]">
            <Search
              size={18}
              className="text-primary/60 absolute top-1/2 left-4 -translate-y-1/2"
            />
            <label htmlFor="coa-search" className="sr-only">
              Search products or batches
            </label>
            <input
              id="coa-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search compounds, strengths, or lots..."
              className="focus:border-primary h-12 w-full rounded-full border border-[#E8DCEA] bg-white pr-11 pl-11 text-sm text-[#29232D] outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="text-primary absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-[#F6E5F7]"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#8A798E]">
              {filtered.length} records
            </span>
            <div className="relative">
              <label htmlFor="coa-category" className="sr-only">
                Filter category
              </label>
              <select
                id="coa-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="text-primary focus:border-primary h-11 max-w-[180px] appearance-none rounded-full border border-[#E8DCEA] bg-white pr-9 pl-4 text-xs font-semibold outline-none"
              >
                <option value="all">All categories</option>
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="text-primary pointer-events-none absolute top-3.5 right-3"
              />
            </div>
          </div>
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
          product certificates or evidence of testing. Display verified results
          and PDFs only after receiving actual batch documentation. Research use
          only.
        </p>
      </section>
    </main>
  );
}

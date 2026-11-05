"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { products } from "@/data/products";
import ShopHero from "../ShopHero";
import ProductCard from "../ProductCard";

import QuickView from "../QuickView";
import { useCart } from "@/context/CartContext";

const catalog = products.filter((item) => item.active !== false);
const categories = [
  "All Products",
  ...new Set(catalog.map((item) => item.category).filter(Boolean)),
];

export default function ShopClient({ initialSearch = "" }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addItem } = useCart();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("All Products");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = catalog.filter((product) => {
      if (category !== "All Products" && product.category !== category)
        return false;
      if (!term) return true;
      const text = [
        product.name,
        product.slug,
        product.category,
        product.description,
        ...(product.variants || []).map((item) => item.label),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(term);
    });
    if (sort === "name") matches.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-low" || sort === "price-high") {
      const price = (product) =>
        Number(
          product.variants?.[product.defaultVariant ?? 0]?.price ?? Infinity,
        );
      matches.sort((a, b) =>
        sort === "price-low" ? price(a) - price(b) : price(b) - price(a),
      );
    }
    return matches;
  }, [search, category, sort]);

  return (
    <main className="min-h-screen">
      <header>
        <ShopHero />
      </header>

      <section
        id="shop-products"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        aria-label="Shop products"
      >
        <div className="flex flex-col gap-4 border-b border-[#EEE6EF] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-[380px]">
            <Search
              size={18}
              className="text-primary/60 absolute top-1/2 left-4 -translate-y-1/2"
            />
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <input
              id="shop-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products or strengths..."
              className="focus:border-primary h-12 w-full rounded-full border border-[#E8DCEA] bg-white pr-11 pl-11 text-sm text-[#29232D] transition-colors outline-none placeholder:text-[#A69BA9] [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="text-primary absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-[#F6E5F7]"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              aria-expanded={filtersOpen}
              aria-controls="shop-category-filters"
              className="text-primary inline-flex h-11 items-center gap-2 rounded-full border border-[#E8DCEA] px-4 text-xs font-semibold lg:hidden"
            >
              <SlidersHorizontal size={16} /> Categories
            </button>
            <span className="text-sm text-[#817586]">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </span>
            <div className="relative">
              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="text-primary focus:border-primary h-11 appearance-none rounded-full border border-[#E8DCEA] bg-white pr-9 pl-4 text-sm font-semibold outline-none"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A–Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                size={14}
                className="text-primary pointer-events-none absolute top-3.5 right-3"
              />
            </div>
          </div>
        </div>

        {filtered.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center text-center">
            <Search size={30} className="text-primary/35" />
            <h2 className="font-heading text-primary mt-4 text-xl font-bold">
              No matching products
            </h2>
            <p className="mt-2 text-sm text-[#817586]">
              Try another search or category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All Products");
              }}
              className="bg-primary mt-5 rounded-full px-5 py-3 text-xs font-semibold text-white"
            >
              Clear filters
            </button>
          </div>
        )}
        <p className="mt-12 border-t border-[#EEE6EF] pt-5 text-xs text-[#817586]">
          All products are intended for scientific and laboratory research only.
          Not for human or veterinary use.
        </p>
      </section>
      {quickViewProduct && (
  <QuickView
    product={quickViewProduct}
    onClose={() => setQuickViewProduct(null)}
  />
)}
    </main>
  );
}

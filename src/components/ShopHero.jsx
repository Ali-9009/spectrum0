"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  Dna,
  FlaskConical,
} from "lucide-react";

const heroProducts = [
  { id: 1, name: "BPC-157", image: "/assets/cta-1.png" },
  { id: 2, name: "BPC + KPV", image: "/assets/cta-2.png" },
  { id: 3, name: "Cagrilintide", image: "/assets/cta-3.png" },
  { id: 4, name: "5-Amino 1-MQ", image: "/assets/cta-4.png" },
  { id: 5, name: "5-Amino 1-MQ", image: "/assets/cta-5.png" },
];

const positions = [
  { x: "0%", y: "0%", scale: 1, opacity: 1, zIndex: 5 },
  { x: "55%", y: "4%", scale: 0.76, opacity: 0.85, zIndex: 3 },
  { x: "30%", y: "-15%", scale: 0.55, opacity: 0.45, zIndex: 1 },
  { x: "-30%", y: "-15%", scale: 0.55, opacity: 0.45, zIndex: 1 },
  { x: "-55%", y: "4%", scale: 0.76, opacity: 0.85, zIndex: 3 },
];

export default function ShopHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () =>
    setActive((current) => (current + 1) % heroProducts.length);
  const previous = () =>
    setActive(
      (current) => (current - 1 + heroProducts.length) % heroProducts.length,
    );

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 3500);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section className="relative isolate w-full overflow-hidden bg-[linear-gradient(115deg,#FCF8FD_0%,#F5E8F8_45%,#E7CCEE_100%)]">
      <FlaskConical
        aria-hidden="true"
        strokeWidth={0.6}
        className="text-primary/10 pointer-events-none absolute top-4 right-4 z-0 size-[180px] rotate-[-25deg] sm:top-0 sm:right-8 sm:size-[260px] lg:-top-12 lg:right-4 lg:size-[380px] xl:size-[440px]"
      />

      <div className="relative z-10 mx-auto grid min-h-[500px] max-w-7xl items-center lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-20 flex flex-col justify-center px-5 pt-12 pb-6 sm:px-8 lg:py-16 lg:pl-10">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs text-[#8A748F]"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">Shop</span>
          </nav>

          <p className="text-secondary mb-4 flex items-center gap-2 font-sans text-xs font-bold tracking-[0.15em] uppercase">
            Spectrum Biosciences
          </p>

          <h1 className="section-heading">
            Explore Our
            <br />
            <span className="text-secondary">Collection.</span>
          </h1>

          <p className="mt-5 max-w-[420px] font-sans text-[15px] leading-[1.8] text-[#76677B]">
            Discover our research collection, explore available strengths, and
            find the compounds that fit your laboratory requirements.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#shop-products"
              className="group bg-primary inline-flex items-center gap-5 rounded-full p-1.5 pl-6 font-sans text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#35143E]"
            >
              Explore Products
              <span className="text-primary flex size-10 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={19} />
              </span>
            </a>
          </div>

          <div className="border-primary/10 mt-10 flex items-center gap-4 border-t pt-5 lg:max-w-[350px]">
            <span className="font-heading text-primary text-[30px] font-bold">
              {String(heroProducts.length).padStart(2, "0")}
            </span>
            <div className="bg-primary/15 h-8 w-px" />
            <p className="font-sans text-xs leading-5 text-[#88748C]">
              Featured compounds from our research collection
            </p>
          </div>
        </div>

        <div
          className="relative flex h-[390px] items-center justify-center overflow-hidden sm:h-[470px] lg:h-[540px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setPaused(false);
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.2)_45%,transparent_72%)]" />

          <div className="pointer-events-none absolute top-[10%] left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full border border-white/40 sm:h-[430px] sm:w-[430px]" />

          <div className="pointer-events-none absolute top-[16%] left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full border border-white/30 sm:h-[350px] sm:w-[350px]" />

          <div className="absolute bottom-[15%] left-1/2 h-[45px] w-[66%] -translate-x-1/2 rounded-[50%] bg-[#55205F]/15 blur-[25px]" />

          <div className="absolute bottom-[17%] left-1/2 h-[62px] w-[67%] -translate-x-1/2 rounded-[50%] bg-[linear-gradient(180deg,#FDF8FF_0%,#DAB8E4_100%)] shadow-[0_22px_35px_rgba(85,32,95,0.15)]">
            <div className="absolute inset-x-0 top-0 h-[25px] rounded-[50%] border border-white bg-[linear-gradient(180deg,#FFFFFF_0%,#E9D4EE_100%)]" />
          </div>

          <div className="relative z-10 mb-5 h-[300px] w-[300px] sm:h-[370px] sm:w-[370px] lg:h-[390px] lg:w-[390px]">
            {heroProducts.map((product, index) => {
              const position =
                (index - active + heroProducts.length) % heroProducts.length;
              const current = positions[position];

              return (
                <motion.div
                  key={product.id}
                  initial={false}
                  animate={current}
                  transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: current.zIndex }}
                >
                  <div className="relative h-[260px] w-[200px] sm:h-[320px] sm:w-[245px] lg:h-[350px] lg:w-[270px]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 200px, (max-width: 1024px) 245px, 270px"
                      className="object-contain drop-shadow-[0_20px_18px_rgba(55,20,65,0.18)]"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="absolute right-5 bottom-5 left-5 z-20 flex items-end justify-between gap-4 sm:right-8 sm:left-8">
            <div>
              <p className="font-sans text-[10px] font-bold tracking-[0.14em] text-[#94749A] uppercase">
                Featured Research
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-heading text-primary mt-1 text-[19px] font-bold"
                >
                  {heroProducts[active].name}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous product"
                className="border-primary/15 text-primary hover:bg-primary flex size-10 items-center justify-center rounded-full border bg-white/70 transition-colors hover:text-white"
              >
                <ChevronLeft size={19} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next product"
                className="bg-primary flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-[#35143E]"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";

const heroProducts = [
  { id: 1, name: "BPC-157", image: "/assets/cta-1.png" },
  { id: 2, name: "BPC + KPV", image: "/assets/cta-2.png" },
  { id: 3, name: "Cagrilintide", image: "/assets/cta-3.png" },
  { id: 4, name: "5-Amino 1-MQ", image: "/assets/cta-4.png" },
];

const positions = [
  { x: "0%", y: "8%", scale: 1, rotateY: 0, opacity: 1, zIndex: 4 },
  { x: "48%", y: "-2%", scale: 0.68, rotateY: -18, opacity: 0.8, zIndex: 2 },
  { x: "0%", y: "-10%", scale: 0.48, rotateY: 0, opacity: 0.3, zIndex: 1 },
  { x: "-48%", y: "-2%", scale: 0.68, rotateY: 18, opacity: 0.8, zIndex: 2 },
];

export default function ShopHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % heroProducts.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full overflow-hidden bg-[linear-gradient(115deg,#FBF7FC_0%,#F1E0F5_55%,#DFC3E8_100%)]">
      <div className="mx-auto grid w-full max-w-7xl items-center lg:min-h-[540px] lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center px-5 pt-14 pb-8 sm:px-8 lg:px-12 lg:py-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-9 flex items-center gap-2 text-xs text-[#8A748F]"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">Shop</span>
          </nav>

          <p className="text-secondary mb-3 font-sans text-[11px] font-bold tracking-[0.16em] uppercase">
            Spectrum Biosciences
          </p>

          <h1 className="section-heading">
            Explore Our <span className="text-secondary">Collection.</span>
          </h1>

          <p className="mt-3 max-w-md font-sans text-md text-[#76677B]">
            Discover our research collection, explore available strengths, and
            find the compounds that fit your laboratory requirements.
          </p>

          <div className="mt-8">
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
        </div>

        <div className="relative flex h-[370px] items-center justify-center overflow-hidden sm:h-[440px] lg:h-[540px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(255,255,255,0.65),transparent_70%)]" />

          <div className="absolute bottom-[17%] left-1/2 h-[42px] w-[55%] -translate-x-1/2 rounded-[50%] bg-[#6B3975]/15 blur-[18px]" />

         
          <div className="relative z-10 mb-5 h-[270px] w-[270px] sm:h-[330px] sm:w-[330px] lg:h-[355px] lg:w-[355px]">
            {heroProducts.map((product, index) => {
              const position =
                (index - active + heroProducts.length) % heroProducts.length;
              const current = positions[position];

              return (
                <motion.div
                  key={product.id}
                  initial={false}
                  animate={current}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: current.zIndex, perspective: 1000 }}
                >
                  <div className="relative h-[250px] w-[195px] sm:h-[310px] sm:w-[240px] lg:h-[330px] lg:w-[255px]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 195px, (max-width: 1024px) 240px, 255px"
                      className="object-contain drop-shadow-[0_18px_15px_rgba(55,20,65,0.16)]"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="absolute right-5 bottom-5 left-5 z-20 flex items-end justify-between sm:right-8 sm:left-8 lg:bottom-7">
            <div>
              <p className="font-sans text-[10px] font-bold tracking-[0.14em] text-[#987AA0] uppercase">
                Featured Research
              </p>
              <p className="font-heading text-primary mt-1 text-lg font-semibold">
                {heroProducts[active].name}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {heroProducts.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show ${product.name}`}
                  aria-pressed={active === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active === index ? "bg-primary w-7" : "bg-primary/25 w-1.5"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

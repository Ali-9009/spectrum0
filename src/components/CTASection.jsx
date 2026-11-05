import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";

const featuredProducts = [
  { id: 1, image: "/assets/cta-1.png", name: "cta 1" },
  { id: 2, image: "/assets/cta-2.png", name: "cta 2" },
  { id: 3, image: "/assets/cta-3.png", name: "cta 3" },
  { id: 4, image: "/assets/cta-4.png", name: "cta 4" },
  { id: 5, image: "/assets/cta-5.png", name: "cta 5" },
];

function ProductShowcase() {
  const positions = [
    "left-[6%] top-[28%] z-10 w-[29%] -rotate-[20deg] sm:left-[8%] sm:top-[25%] lg:left-[12%] lg:w-[22%]",
    "left-[19%] top-[13%] z-20 w-[32%] -rotate-[10deg] sm:left-[22%] sm:top-[12%] lg:left-[24%] lg:w-[25%]",
    "left-1/2 top-0 z-30 w-[38%] -translate-x-1/2 sm:w-[35%] lg:w-[29%]",
    "right-[19%] top-[13%] z-20 w-[32%] rotate-[10deg] sm:right-[22%] sm:top-[12%] lg:right-[24%] lg:w-[25%]",
    "right-[6%] top-[28%] z-10 w-[29%] rotate-[20deg] sm:right-[8%] sm:top-[25%] lg:right-[12%] lg:w-[22%]",
  ];

  return (
    <div className="relative mx-auto mt-10 h-[250px] w-full max-w-[1100px] overflow-hidden sm:mt-12 sm:h-[350px] md:h-[420px] lg:mt-14 lg:h-[470px]">
      {featuredProducts.slice(0, 5).map((product, index) => (
        <div
          key={product.id}
          className={`group absolute aspect-[3/4] transition-transform duration-500 hover:-translate-y-2 ${positions[index]}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 35vw, 320px"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}

export default function CTASection() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative w-full overflow-hidden bg-[#FCF6F0] px-4 pt-18 sm:px-6 lg:px-10"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F6E5F7]/60 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative z-40 mx-auto max-w-[720px] text-center">
          <span className="border-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-[10px] font-bold tracking-[0.18em] uppercase">
            <Sparkles size={14} className="text-secondary" />
            Explore Spectrum
          </span>

          <h2
            id="cta-title"
            className="font-heading text-primary text-[clamp(35px,5.5vw,70px)] leading-[1.08] font-extrabold tracking-[-0.065em]"
          >
            Your Next Discovery.
            <br />
            <span className="text-secondary">Starts Here.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-[480px] font-sans text-[13px] leading-[1.8] text-[#625765] sm:text-[15px]">
            Explore research-focused compounds from Spectrum Biosciences and
            discover the products that fit your laboratory needs.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="group bg-primary hover:bg-primary-dark inline-flex items-center gap-3 rounded-full px-6 py-3.5 font-sans text-[12px] font-semibold text-white transition-all duration-300 hover:shadow-[0_12px_30px_rgba(85,32,95,0.2)] sm:text-[13px]"
            >
              Explore Collection
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </Link>

            <Link
              href="/contact"
              className="group border-primary/15 text-primary hover:border-primary/40 inline-flex items-center gap-3 rounded-full border bg-white/70 px-6 py-3.5 font-sans text-[12px] font-semibold transition-all duration-300 hover:bg-white sm:text-[13px]"
            >
              Get in Touch
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <ProductShowcase />
      </div>
    </section>
  );
}

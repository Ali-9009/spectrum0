import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  FlaskConical,
  FileCheck2,
  Microscope,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "About Us | Spectrum Biosciences",
  description:
    "Discover Spectrum Biosciences and our approach to research products, product information, and laboratory documentation.",
};

const images = {
  bpc: "/products/BPC-157.webp",
  ghk: "/products/ghk-cu.webp",
  tesamorelin: "/products/tesamorelin.webp",
  blend: "/products/glow-blend.webp",
  tb: "/products/tb-500.webp",
};

const principles = [
  {
    number: "01",
    icon: Microscope,
    title: "Research-Focused",
    description:
      "Our collection is organized around compounds intended for scientific investigation and analytical laboratory applications.",
  },
  {
    number: "02",
    icon: FileCheck2,
    title: "Information Matters",
    description:
      "We believe researchers should be able to review clear product specifications and available batch-specific documentation.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Responsible Research",
    description:
      "Our products are presented for laboratory research purposes, with clear distinctions between research materials and medical products.",
  },
];

const collection = [
  {
    number: "01",
    title: "Research Peptides",
    description:
      "Explore individual peptide compounds for laboratory-based scientific research.",
    image: images.bpc,
    category: "Research Peptides",
  },
  {
    number: "02",
    title: "Research Blends",
    description:
      "Discover multi-component formulations intended for controlled research environments.",
    image: images.blend,
    category: "Research Blends",
  },
  {
    number: "03",
    title: "Research Solutions",
    description:
      "Explore laboratory solutions and supporting research materials.",
    image: "/products/Acetic-Acid.webp",
    category: "Research Solutions",
  },
];

function SectionLabel({ children }) {
  return (
    <span className="text-secondary inline-flex items-center gap-2 font-sans text-[11px] font-bold tracking-[0.16em] uppercase">
      <span className="bg-secondary size-1.5 rounded-full" />
      {children}
    </span>
  );
}

function ImagePanel({ src, alt, className = "", sizes = "50vw" }) {
  return (
    <div className={`relative overflow-hidden bg-[#F6EAF8] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
}

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-[#F2E2F5]">
          <div className="relative w-full overflow-hidden">
            <Image
              src="/assets/about-2.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="hidden object-cover object-center lg:block"
            />
            <Image
              src="/assets/about-mobile-1.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 1280px"
              className="object-cover object-bottom lg:hidden"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F9ECFC]/45 via-transparent to-transparent lg:hidden" />

            <div className="relative z-10 flex w-full flex-col items-start px-5 pt-8 pb-70 sm:px-10 sm:pt-12 sm:pb-[440px] md:px-12 md:pt-14 md:pb-110 lg:min-h-130 lg:justify-center lg:px-16 lg:py-12">
              <div className="w-full max-w-[420px]">
                <span className="text-primary/70 mb-3 inline-block font-sans text-[10px] font-bold tracking-[0.16em] uppercase sm:text-[11px]">
                  Our Story
                </span>

                <h2 className="section-heading">
                  A Different Perspective on Big{" "}
                  <span className="text-secondary">Research.</span>
                </h2>

                <p className="text-md mt-4 max-w-[340px] font-sans leading-[1.7] text-[#4E3D52]">
                  Spectrum Biosciences brings together research compounds,
                  thoughtful product presentation, and accessible information in
                  one focused collection.
                </p>

                <Link
                  href="/shop"
                  className="group bg-primary hover:bg-primary-dark mt-6 inline-flex items-center gap-3 rounded-full px-5 py-3 font-sans text-sm font-semibold text-white transition-all duration-300 sm:px-6 sm:py-3.5"
                >
                  Explore Collection
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:rotate-45"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <SectionLabel>01 / Who We Are</SectionLabel>
            <h2 className="font-heading text-primary mt-5 text-[clamp(34px,4vw,52px)] leading-[1.1] font-bold tracking-[-0.055em]">
              Built Around
              <br />
              <span className="text-secondary">Curiosity.</span>
            </h2>
          </div>

          <div className="border-l-2 border-[#E9D4ED] pl-6 sm:pl-9">
            <p className="font-heading text-[clamp(20px,2.5vw,31px)] leading-[1.45] font-medium tracking-[-0.035em] text-[#49374E]">
              Scientific progress begins with questions, careful observation,
              and the resources needed to investigate new possibilities.
            </p>
            <p className="mt-6 max-w-2xl text-[14px] leading-[1.95] text-[#817586]">
              At Spectrum Biosciences, our focus is on presenting research
              compounds in a clear, accessible way. From individual peptides to
              specialized blends and laboratory solutions, our collection is
              designed to help researchers explore available materials, compare
              strengths, and access relevant product information.
            </p>
            <p className="mt-4 max-w-2xl text-[14px] leading-[1.95] text-[#817586]">
              We believe the research purchasing experience should be
              straightforward, informative, and consistent from product
              discovery through documentation review.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FCF9FC] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-11 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>02 / Our Approach</SectionLabel>
              <h2 className="font-heading text-primary mt-4 text-[clamp(34px,4vw,52px)] leading-tight font-bold tracking-[-0.055em]">
                What Guides Us<span className="text-secondary">.</span>
              </h2>
            </div>
            <p className="max-w-[370px] text-[14px] leading-7 text-[#817586]">
              A focused approach to how research products are presented,
              understood, and explored.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  className="group hover:border-primary/20 relative flex min-h-[285px] flex-col overflow-hidden rounded-[22px] border border-[#EBE0ED] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(85,32,95,0.06)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-primary flex size-12 items-center justify-center rounded-[14px] bg-[#F6E5F7]">
                      <Icon size={23} strokeWidth={1.6} />
                    </span>
                    <span className="font-heading text-[35px] font-medium tracking-[-0.06em] text-[#E6D5E9]">
                      {item.number}
                    </span>
                  </div>

                  <div className="mt-auto pt-10">
                    <h3 className="font-heading text-primary text-[23px] font-bold tracking-[-0.04em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-7 text-[#817586]">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="grid h-[430px] grid-cols-[0.9fr_1.1fr] gap-3 sm:h-[540px] sm:gap-4">
            <ImagePanel
              src={images.tb}
              alt="TB-500 research product"
              className="mt-14 rounded-[22px]"
            />
            <div className="grid grid-rows-[1.1fr_0.9fr] gap-3 sm:gap-4">
              <ImagePanel
                src={images.blend}
                alt="GLOW research blend"
                className="rounded-[22px]"
              />
              <div className="bg-primary flex flex-col justify-between rounded-[22px] p-6 text-white sm:p-8">
                <FlaskConical
                  size={29}
                  strokeWidth={1.5}
                  className="text-white/70"
                />
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.13em] text-white/60 uppercase">
                    Our Philosophy
                  </span>
                  <p className="font-heading mt-3 text-[clamp(19px,2.5vw,29px)] leading-tight font-semibold tracking-[-0.04em]">
                    Clarity in every detail.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>03 / The Details Matter</SectionLabel>
            <h2 className="font-heading text-primary mt-5 max-w-[520px] text-[clamp(36px,4.5vw,58px)] leading-[1.1] font-bold tracking-[-0.06em]">
              More Than
              <br />
              Just a <span className="text-secondary">Product.</span>
            </h2>
            <p className="mt-6 max-w-[470px] text-[14px] leading-[1.9] text-[#817586]">
              Understanding a research compound involves more than its name.
              Strength, formulation, intended laboratory context, and available
              documentation all play a role in making an informed purchasing
              decision.
            </p>
            <p className="mt-4 max-w-[470px] text-[14px] leading-[1.9] text-[#817586]">
              That's why we prioritize an organized collection with clear
              product information and a dedicated place to explore
              batch-specific analytical records where available.
            </p>
            <Link
              href="/coa"
              className="group border-primary text-primary hover:border-secondary hover:text-secondary mt-8 inline-flex items-center gap-3 border-b pb-2 text-[13px] font-bold transition-colors"
            >
              Explore CoA Documentation
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:rotate-45"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#EEE6EF] bg-[#FCF9FC] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-11 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <SectionLabel>04 / Our Collection</SectionLabel>
              <h2 className="font-heading text-primary mt-4 text-[clamp(34px,4vw,52px)] leading-tight font-bold tracking-[-0.055em]">
                Explore the Spectrum<span className="text-secondary">.</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="group text-primary hover:text-secondary inline-flex items-center gap-2 text-[13px] font-semibold"
            >
              Shop All Products
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:rotate-45"
              />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {collection.map((item) => (
              <article
                key={item.number}
                className="group overflow-hidden rounded-[22px] border border-[#EEE5EF] bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F7EDF9]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="text-primary absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold">
                    {item.number} / 03
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-heading text-primary text-[24px] font-bold tracking-[-0.045em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 min-h-[56px] text-[13px] leading-7 text-[#817586]">
                    {item.description}
                  </p>
                  <Link
                    href={`/shop?category=${encodeURIComponent(item.category)}`}
                    className="text-primary hover:text-secondary mt-5 flex items-center justify-between border-t border-[#EEE6EF] pt-4 text-[12px] font-semibold transition-colors"
                  >
                    Explore Collection
                    <span className="group-hover:bg-primary flex size-9 items-center justify-center rounded-full bg-[#F6E5F7] transition-colors group-hover:text-white">
                      <ArrowUpRight size={17} />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 rounded-[26px] bg-[linear-gradient(115deg,#35143E_0%,#55205F_60%,#843C83_100%)] px-7 py-12 text-white sm:px-12 sm:py-16 lg:flex-row lg:px-16">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.16em] text-[#F6B37D] uppercase">
              Continue Exploring
            </span>
            <h2 className="font-heading mt-4 max-w-[650px] text-[clamp(32px,4vw,52px)] leading-[1.1] font-bold tracking-[-0.055em]">
              Your Next Discovery
              <br />
              Starts Here.
            </h2>
            <p className="mt-5 max-w-lg text-[14px] leading-7 text-white/70">
              Explore our collection or get in touch with questions about
              research products and available documentation.
            </p>
          </div>

          <Link
            href="/shop"
            className="group text-primary inline-flex shrink-0 items-center gap-6 rounded-full bg-white p-1.5 pl-6 text-[13px] font-bold transition-all hover:bg-[#F8EAF9]"
          >
            Browse Products
            <span className="bg-primary flex size-11 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={19} />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

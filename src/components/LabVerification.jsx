"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Fingerprint,
  Activity,
  Scale,
  ShieldCheck,
  ScanSearch,
  CheckCheck,
  ArrowUpRight,
  FileCheck2,
} from "lucide-react";

const checks = [
  {
    id: "01",
    icon: Fingerprint,
    title: "Identification",
    detail: "HPLC + LC-MS",
    position: "lg:left-[5%] lg:top-[4%]",
    rotate: "-7deg",
    delay: 0,
  },
  {
    id: "02",
    icon: Activity,
    title: "Purity",
    detail: "Chromatographic analysis",
    position: "lg:right-[3%] lg:top-[13%]",
    rotate: "6deg",
    delay: 120,
  },
  {
    id: "03",
    icon: Scale,
    title: "Net Content",
    detail: "Measured mass per vial",
    position: "lg:left-[1%] lg:top-[43%]",
    rotate: "4deg",
    delay: 210,
  },
  {
    id: "04",
    icon: ShieldCheck,
    title: "Endotoxins",
    detail: "Bacterial endotoxin screen",
    position: "lg:right-[6%] lg:top-[48%]",
    rotate: "-5deg",
    delay: 60,
  },
  {
    id: "05",
    icon: ScanSearch,
    title: "Sterility",
    detail: "PCR screen",
    position: "lg:left-[9%] lg:top-[77%]",
    rotate: "-4deg",
    delay: 160,
  },
  {
    id: "06",
    icon: FileCheck2,
    title: "Lot Traceability",
    detail: "Batch certificate matching",
    position: "lg:right-[1%] lg:top-[79%]",
    rotate: "7deg",
    delay: 90,
  },
];
function VerificationCard({ item, visible }) {
  const Icon = item.icon;

  return (
    <div
      className={`relative min-w-0 lg:absolute lg:w-[235px] xl:w-[265px] ${item.position}`}
      style={{
        "--card-rotate": item.rotate,
        "--pop-delay": `${item.delay}ms`,
      }}
    >
      <article
        className={`lab-pop-card group hover:border-primary/30 relative flex min-w-0 items-center gap-3 rounded-[18px] border border-[#EEE3F0] bg-white/95 p-3.5 shadow-[0_15px_45px_rgba(85,32,95,0.09)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:shadow-[0_20px_50px_rgba(85,32,95,0.16)] sm:p-4 ${
          visible ? "lab-card-visible" : "lab-card-hidden"
        }`}
      >
        <div className="text-primary group-hover:bg-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#F4E7F6] transition-colors duration-300 group-hover:text-white sm:h-12 sm:w-12">
          <Icon size={22} strokeWidth={1.7} />
        </div>

        <div className="min-w-0">
          <h3 className="font-heading text-primary text-[14px] font-bold tracking-[-0.035em] sm:text-[16px]">
            {item.title}
          </h3>

          <p className="text-muted mt-1 font-sans text-[11px] leading-[1.5] sm:text-[12px]">
            {item.detail}
          </p>
        </div>

        <div className="bg-secondary absolute right-5 bottom-0 left-5 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
      </article>
    </div>
  );
}

export default function LabVerification() {
  const sectionRef = useRef(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    const target = animationRef.current;
    if (!target) return;

    let triggered = false;

    const handleScroll = () => {
      if (triggered) return;

      const rect = target.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.65;
      const bottleCenter = rect.top + rect.height / 2;

      if (bottleCenter <= triggerPoint && bottleCenter >= 0) {
        triggered = true;
        setCardsVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="lab-verification"
      aria-labelledby="verification-title"
      className="relative overflow-hidden px-4 py-18 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="border-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border bg-[#F9F1FA] px-4 py-2 font-sans text-[11px] font-bold tracking-[0.17em] uppercase">
            <span className="bg-secondary h-2 w-2 rounded-full" />
            Laboratory Documentation
          </span>

          <h2 id="verification-title" className="section-heading">
            Five Checks.
            <br />
            <span className="text-secondary">One Clearer Record.</span>
          </h2>

          <p className="text-muted mx-auto mt-5 max-w-lg font-sans text-[14px] leading-[1.8] sm:text-[15px]">
            Explore the laboratory checks that help document the identity,
            composition, and quality of research compounds.
          </p>
        </header>

        <div className="relative mt-12 lg:mt-10">
          <div className="border-primary/[0.07] pointer-events-none absolute top-1/2 left-1/2 hidden h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full border lg:block" />

          <div className="border-primary/[0.08] pointer-events-none absolute top-1/2 left-1/2 hidden h-[570px] w-[570px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed lg:block" />

          <div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F6E8F8] blur-[80px] lg:block" />

          <div className="relative flex flex-col items-center lg:h-[460px]">
            <div className="relative z-10 flex w-full flex-col items-center lg:absolute lg:top-1/2 lg:left-1/2 lg:w-[270px] lg:-translate-x-1/2 lg:-translate-y-1/2">
              <div
                ref={animationRef}
                className="relative flex h-[240px] w-[185px] items-center justify-center sm:h-[290px] sm:w-[220px] lg:h-[340px] lg:w-[250px]"
              >
                <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                  <div className="absolute h-[260px] w-[320px] sm:h-[330px] sm:w-[450px] lg:h-[400px] lg:w-[580px]">
                    <Image
                      src="/assets/spectrum-logo.png"
                      alt=""
                      fill
                      sizes="(max-width: 640px) 320px, (max-width: 1024px) 450px, 580px"
                      className="object-contain opacity-[0.12]"
                    />
                  </div>
                </div>

                <div className="absolute inset-8 z-0 rounded-full bg-[#F2DDF5]/60 blur-[55px]" />

                <div
                  className={`relative z-10 h-full w-full ${
                    cardsVisible ? "lab-bottle" : ""
                  }`}
                >
                  <Image
                    src="/assets/5-amino-hero.png"
                    alt="Spectrum Biosciences research vial"
                    fill
                    sizes="(max-width: 640px) 185px, (max-width: 1024px) 220px, 250px"
                    className="object-contain drop-shadow-[0_25px_25px_rgba(85,32,95,0.18)]"
                  />
                </div>

                <span className="bg-primary/15 pointer-events-none absolute bottom-4 left-1/2 z-0 h-5 w-36 -translate-x-1/2 rounded-full blur-xl" />
              </div>

              <div className="border-primary/10 relative z-20 mt-1 flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm lg:mt-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="bg-secondary/40 absolute inline-flex h-full w-full animate-ping rounded-full" />
                  <span className="bg-secondary relative inline-flex h-2.5 w-2.5 rounded-full" />
                </span>

                <span className="text-primary font-sans text-[11px] font-semibold tracking-[0.1em] uppercase">
                  Spectrum Biosciences
                </span>
              </div>
            </div>

            <div className="relative z-20 mt-8 grid w-full grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:mt-0 lg:block lg:h-full">
              {checks.map((item) => (
                <VerificationCard
                  key={item.id}
                  item={item}
                  visible={cardsVisible}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-12 max-w-2xl text-center lg:mt-0">
          <h3 className="font-heading text-primary text-[23px] font-bold tracking-[-0.04em] sm:text-[27px]">
            Follow the Lot. Verify the Record.
          </h3>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spectrum-bottle-float {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-14px) rotate(2deg);
          }
        }

        @keyframes spectrum-card-pop {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.55) rotate(0deg);
            filter: blur(8px);
          }

          55% {
            opacity: 1;
            transform: translateY(-12px) scale(1.09)
              rotate(calc(var(--card-rotate) * 1.2));
            filter: blur(0);
          }

          78% {
            transform: translateY(4px) scale(0.97)
              rotate(calc(var(--card-rotate) * 0.95));
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(var(--card-rotate));
            filter: blur(0);
          }
        }

        .lab-bottle {
          animation: spectrum-bottle-float 5s ease-in-out infinite;
        }

        .lab-pop-card {
          transform-origin: center;
          will-change: transform, opacity;
        }

        .lab-card-hidden {
          opacity: 0;
          transform: translateY(30px) scale(0.6);
          pointer-events: none;
        }

        .lab-card-visible {
          animation: spectrum-card-pop 750ms cubic-bezier(0.22, 1, 0.36, 1)
            var(--pop-delay) both;
        }

        @media (max-width: 1023px) {
          .lab-card-visible {
            animation-name: spectrum-card-pop-mobile;
          }

          @keyframes spectrum-card-pop-mobile {
            0% {
              opacity: 0;
              transform: translateY(25px) scale(0.7);
            }

            65% {
              opacity: 1;
              transform: translateY(-5px) scale(1.03);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lab-bottle,
          .lab-card-visible {
            animation: none;
          }

          .lab-card-visible {
            opacity: 1;
            transform: none;
            filter: none;
          }
        }
      `}</style>
    </section>
  );
}

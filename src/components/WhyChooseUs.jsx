"use client";

import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Microscope,
  Truck,
  Droplets,
  Headset,
  FlaskConical,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const features = [
  {
    number: "01",
    icon: BadgeCheck,
    title: "Lab-Tested Every Batch",
    description: "Independently tested for quality and purity.",
  },
  {
    number: "02",
    icon: Microscope,
    title: "High Purity Peptides",
    description: "Premium purity backed by lab analysis.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Fast EU Shipping",
    description: "Quick and reliable delivery across Europe.",
  },
  {
    number: "04",
    icon: Droplets,
    title: "Free Bac Water",
    description: "Complimentary Bac Water with every order.",
  },
  {
    number: "05",
    icon: Headset,
    title: "Support 08:00 – 20:00",
    description: "Friendly support whenever you need help.",
  },
  {
    number: "06",
    icon: FlaskConical,
    title: "Research Use Only",
    description: "Strictly for laboratory research purposes.",
  },
];

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);
  const Icon = feature.icon;

  const handleMouseMove = (event) => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-5px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
  };

  return (
    <article
      ref={cardRef}
      data-aos="fade-up"
      data-aos-delay={index * 80}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group hover:border-primary/30 relative flex flex-col overflow-hidden rounded-[26px] border border-[#E9DFEB] bg-white p-7 transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out hover:bg-[#FCF6FD] hover:shadow-[0_25px_55px_rgba(85,32,95,0.1)] sm:p-8"
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="text-primary group-hover:border-primary group-hover:bg-primary flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#E7D1EA] bg-[#F7ECF9] shadow-[0_5px_15px_rgba(85,32,95,0.05)] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:text-white">
          <Icon size={27} strokeWidth={1.6} />
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <h3 className="font-heading text-primary max-w-[270px] text-[21px] leading-[1.25] font-bold tracking-[-0.045em] sm:text-[23px]">
          {feature.title}
        </h3>

        <p className="text-muted mt-3 max-w-[310px] font-sans text-[13px] leading-[1.8] sm:text-[14px]">
          {feature.description}
        </p>
      </div>

      <Icon
        size={135}
        strokeWidth={0.8}
        aria-hidden="true"
        className="pointer-events-none absolute -right-9 -bottom-9 rotate-[-18deg] text-[#E8C9ED]/50 transition-all duration-700 group-hover:-translate-x-3 group-hover:-translate-y-3 group-hover:rotate-0 group-hover:text-[#D9A4E2]/70"
      />

      <span className="bg-primary absolute right-5 bottom-5 z-10 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight size={18} />
      </span>
    </article>
  );
}

export default function WhyChooseUs() {
  useEffect(() => {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);

  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="relative overflow-hidden bg-[#FAF8FB] px-4 py-18 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-8 lg:flex-row lg:items-end">
          <div data-aos="fade-up">
            <span className="text-secondary inline-flex items-center gap-2 font-sans text-[11px] font-bold tracking-[0.2em] uppercase">
              <span className="bg-secondary h-2 w-2 rounded-full" />
              The Spectrum Difference
            </span>

            <h2 id="why-title" className="section-heading mt-2">
              Why Choose
              <br />
              Spectrum?
            </h2>
          </div>

          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-muted max-w-[390px] font-sans text-[14px] leading-[1.8] sm:text-[15px]"
          >
            Discover what sets Spectrum Biosciences apart, from independent
            laboratory testing to reliable service and research-focused
            standards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

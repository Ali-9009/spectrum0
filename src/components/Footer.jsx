"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, FlaskConical, Mail } from "lucide-react";
import "remixicon/fonts/remixicon.css";

const footerLinks = {
  explore: [
    { name: "Shop All", href: "/shop" },
    { name: "Research Peptides", href: "/collections/peptides" },
    { name: "About Spectrum", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ],
  support: [
    { name: "Track Your Order", href: "/track-order" },
    { name: "Shipping Information", href: "/shipping" },
    { name: "Frequently Asked Questions", href: "/faq" },
    { name: "Contact Support", href: "/contact" },
  ],
  policies: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Research Disclaimer", href: "/research-disclaimer" },
  ],
};

const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: "ri-instagram-line",
  },
  { name: "Facebook", href: "https://facebook.com", icon: "ri-facebook-fill" },
  { name: "X", href: "https://x.com", icon: "ri-twitter-x-line" },
];

function FooterColumn({ title, links }) {
  return (
    <nav aria-label={title}>
      <h3 className="font-heading text-primary mb-5 text-[14px] font-bold">
        {title}
      </h3>

      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="group hover:text-primary inline-flex items-center gap-1.5 font-sans text-[13px] text-[#786E7B] transition-colors duration-300"
            >
              <span>{link.name}</span>
              <ArrowUpRight
                size={12}
                className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    // Connect this form to your newsletter API.
  };

  return (
    <footer className="relative overflow-hidden bg-[#FCF6F0] text-[#29232D]">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="border-primary/10 grid gap-10 border-b py-14 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.3fr_0.8fr_0.9fr_0.9fr] lg:py-20">
          <div className="max-w-[320px]">
            <Link href="/" aria-label="Spectrum Biosciences home">
              <Image
                src="/assets/spectrum-logo.png"
                alt="Spectrum Biosciences"
                width={200}
                height={70}
                className="h-[60px] w-auto object-contain"
              />
            </Link>

            <p className="mt-5 font-sans text-[13px] leading-[1.9] text-[#786E7B]">
              Spectrum Biosciences brings together a curated range of
              research-focused compounds for laboratory applications and
              scientific exploration.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="border-primary/10 text-primary hover:border-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-all duration-300 hover:-translate-y-1 hover:text-white"
                >
                  <i
                    className={`${social.icon} text-[17px]`}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Explore" links={footerLinks.explore} />

          <FooterColumn title="Customer Care" links={footerLinks.support} />

          <FooterColumn title="Information" links={footerLinks.policies} />
        </div>

        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[11px] text-[#8B7E8E] sm:text-[12px]">
            © {new Date().getFullYear()} Spectrum Biosciences. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="hover:text-primary font-sans text-[11px] text-[#8B7E8E] transition-colors"
            >
              Privacy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="hover:text-primary font-sans text-[11px] text-[#8B7E8E] transition-colors"
            >
              Terms
            </Link>

            <span className="text-primary inline-flex items-center gap-2 font-sans text-[11px] font-semibold">
              <FlaskConical size={14} className="text-secondary" />
              Research Use Only
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none overflow-hidden select-none"
        >
          <span className="font-heading block translate-y-[22%] text-center text-[clamp(70px,16vw,240px)] leading-none font-extrabold tracking-[-0.095em] text-[#E8D8EB]">
            SPECTRUM
          </span>
        </div>
      </div>
    </footer>
  );
}

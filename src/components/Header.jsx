"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  UserRound,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  FlaskConical,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import HeaderSearch from "./HeaderSearch";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "COA", href: "/coa" },
  { name: "About", href: "/about" },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact", href: "/contact" },
  { name: "Partner Program", href: "/partner-program" },
  { name: "Track Order", href: "/track-order" },
];

const announcements = [
  {
    label: "SPECTRUM EXCLUSIVE",
    highlight: "SAVE 15%",
    text: "on selected research bundles",
  },
  {
    label: "EXPLORE MORE",
    highlight: "BUNDLE & SAVE",
    text: "discover the Spectrum collection",
  },
  {
    label: "RESEARCH ESSENTIALS",
    highlight: "SHOP THE COLLECTION",
    text: "find your next research essential",
  },
];

function AnnouncementBar() {
  return (
    <div className="relative isolate overflow-hidden bg-[#F0E1F4] py-2.5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#F7EAF9,#EAD6F0,#F7EAF9)]" />

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="announcement-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
            >
              {announcements.map((item, index) => (
                <div
                  key={`${copy}-${index}`}
                  className="flex shrink-0 items-center gap-4 sm:gap-6"
                >
                  <span className="border-primary/15 text-primary inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1.5 font-sans text-[9px] font-extrabold tracking-[0.13em] uppercase shadow-sm sm:text-[10px]">
                    <span className="relative flex h-2 w-2">
                      <span className="bg-secondary/40 absolute inset-0 animate-ping rounded-full" />
                      <span className="bg-secondary relative h-2 w-2 rounded-full" />
                    </span>
                    {item.label}
                  </span>

                  <span className="font-heading text-primary text-[20px] font-extrabold tracking-[-0.055em] whitespace-nowrap sm:text-[25px]">
                    {item.highlight}
                  </span>

                  <span className="font-heading text-primary/65 text-[15px] font-semibold whitespace-nowrap italic sm:text-[18px]">
                    {item.text}
                  </span>

                  <Link
                    href="/shop"
                    tabIndex={copy === 1 ? -1 : undefined}
                    aria-hidden={copy === 1}
                    className="group bg-primary hover:bg-secondary inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-sans text-[11px] font-bold text-white transition-all duration-300 sm:px-5 sm:text-[12px]"
                  >
                    Shop Now
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  </Link>

                  <Sparkles size={18} className="text-secondary shrink-0" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spectrum-announcement-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .announcement-track {
          animation: spectrum-announcement-scroll 38s linear infinite;
          will-change: transform;
        }

        .announcement-track:hover,
        .announcement-track:focus-within {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .announcement-track {
            animation-duration: 30s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function MobileSidebar({ open, onClose, pathname }) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] lg:hidden ${
        open ? "visible" : "invisible delay-300"
      }`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#18071D]/65 backdrop-blur-[4px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-[min(380px,90vw)] flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-primary/10 flex items-center justify-between border-b px-6 py-5">
          <Link href="/" onClick={onClose} aria-label="Spectrum home">
            <Image
              src="/assets/spectrum-logo.png"
              alt="Spectrum Biosciences"
              width={170}
              height={60}
              className="h-11 w-auto object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full bg-[#F6E5F7] transition-colors hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <nav
          aria-label="Sidebar navigation"
          className="flex-1 overflow-y-auto px-6 py-8"
        >
          <span className="text-secondary mb-5 block font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
            Explore Spectrum
          </span>

          {navLinks.map((link, index) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group border-primary/10 font-heading flex items-center justify-between border-b py-5 text-[25px] font-semibold tracking-[-0.05em] transition-colors ${
                  active
                    ? "text-secondary"
                    : "text-primary hover:text-secondary"
                }`}
              >
                <span className="flex items-center gap-4">
                  <span className="text-primary/35 font-sans text-[11px] tracking-normal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {link.name}
                </span>

                <ArrowUpRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            );
          })}

          <Link
            href="/account"
            onClick={onClose}
            className="text-primary mt-7 flex items-center gap-3 rounded-2xl bg-[#F6E5F7] px-5 py-4 font-sans text-[14px] font-semibold"
          >
            <UserRound size={19} />
            My Account
            <ArrowRight size={17} className="ml-auto" />
          </Link>

          <div className="relative mt-7 overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#55205F,#872B95)] p-6 text-white">
            <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full border border-white/15" />

            <span className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold tracking-wider text-white/70 uppercase">
              <Sparkles size={14} className="text-[#FFB178]" />
              Discover Spectrum
            </span>

            <h3 className="font-heading mt-4 text-[26px] leading-tight font-bold tracking-[-0.05em]">
              More Research.
              <br />
              More Discovery.
            </h3>

            <p className="mt-3 font-sans text-[12px] leading-relaxed text-white/75">
              Explore our research-focused collection.
            </p>

            <Link
              href="/shop"
              onClick={onClose}
              className="text-primary mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-sans text-[12px] font-bold"
            >
              Explore Collection
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>

        <div className="border-primary/10 border-t px-6 py-5">
          <p className="text-primary/60 flex items-center gap-2 font-sans text-[11px]">
            <FlaskConical size={16} />
            For laboratory research use only
          </p>
        </div>
      </aside>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openCart, itemCount, hydrated } = useCart();

  const cartCount = hydrated ? itemCount : 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <AnnouncementBar />

      <header
        className={`border-primary/10 sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl transition-shadow duration-500 ${
          scrolled ? "shadow-[0_8px_30px_rgba(45,0,50,0.08)]" : ""
        }`}
      >
        <div
          className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 transition-[padding] duration-300 ease-in-out sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-0 ${
            scrolled ? "py-2" : "py-4"
          }`}
        >
          <Link
            href="/"
            aria-label="Spectrum Biosciences home"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/assets/spectrum-logo.png"
              alt="Spectrum Biosciences"
              width={200}
              height={65}
              priority
              className={`w-auto origin-left object-contain transition-[height] duration-300 ease-in-out ${
                scrolled
                  ? "h-[44px] sm:h-[47px] lg:h-[48px]"
                  : "h-[48px] sm:h-[51px] lg:h-[54px]"
              }`}
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center justify-center gap-7 lg:flex xl:gap-10"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative font-sans font-medium whitespace-nowrap transition-colors duration-300 text-md ${
                    active
                      ? "text-primary"
                      : "hover:text-primary text-[#514654]"
                  }`}
                >
                  {link.name}

                  <span
                    className={`bg-secondary absolute -bottom-2 left-0 h-[2px] rounded-full transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button
              type="button"
              data-header-search-trigger
              onClick={() => {
                setSearchOpen((current) => !current);
                setMenuOpen(false);
              }}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              className="text-primary relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F6E5F7] sm:h-11 sm:w-11"
            >
              {searchOpen ? <X size={21} /> : <Search size={21} />}
            </button>

            <Link
              href="/account"
              aria-label="My account"
              className="text-primary hidden h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F6E5F7] lg:flex"
            >
              <UserRound size={21} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open shopping cart, ${cartCount} items`}
              className="text-primary relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F6E5F7] sm:h-11 sm:w-11"
            >
              <ShoppingBag size={21} strokeWidth={1.8} />

              {cartCount > 0 && (
                <span className="bg-secondary absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 font-sans text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(true);
                setSearchOpen(false);
              }}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="text-primary flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F6E5F7] sm:h-11 sm:w-11 lg:hidden"
            >
              <Menu size={24} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <HeaderSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      <MobileSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />

      <style jsx global>{`
        @keyframes spectrum-announcement-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .announcement-track {
          animation: spectrum-announcement-scroll 45s linear infinite;
          will-change: transform;
        }

        @media (max-width: 640px) {
          .announcement-track {
            animation-duration: 35s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-track {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { name: "Shop All", href: "/shop" },
  { name: "Peptides", href: "/collections/peptides" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function AnnouncementBar({ hidden }) {
  return (
    <div
      aria-hidden={hidden}
      className={`overflow-hidden bg-[linear-gradient(100deg,#42104F,#711A80,#42104F)] text-white transition-[max-height,opacity,transform,padding] duration-500 ease-in-out ${
        hidden
          ? "max-h-0 -translate-y-3 py-0 opacity-0"
          : "max-h-16 translate-y-0 py-2.5 opacity-100"
      }`}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-3 sm:gap-3">
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#B5FF78]/30 bg-[#B5FF78]/10">
          <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#B5FF78]/30" />
          <span className="relative h-2 w-2 rounded-full bg-[#B5FF78] shadow-[0_0_12px_#B5FF78]" />
        </span>

        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.04em] sm:text-[13px] lg:text-[15px]">
          <span className="hidden sm:inline">
            THE SPECTRUM ADVANTAGE:
          </span>
          <span className="sm:hidden">BUNDLE & SAVE:</span>
          <span className="ml-2 text-[#FFBF72] sm:ml-3">
            SAVE UP TO 15%
          </span>
        </p>

        <Link
          href="/shop"
          tabIndex={hidden ? -1 : undefined}
          className="group hidden items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1.5 font-sans text-[11px] font-bold uppercase text-white transition-colors hover:bg-white/20 sm:inline-flex"
        >
          Shop Now
          <ArrowUpRight size={15} />
        </Link>

        <Link
          href="/shop"
          tabIndex={hidden ? -1 : undefined}
          aria-label="Shop bundle offers"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 sm:hidden"
        >
          <ArrowUpRight size={15} />
        </Link>
      </div>
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
        className={`absolute inset-0 bg-[#18071D]/65 backdrop-blur-[5px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        id="spectrum-mobile-menu"
        aria-label="Mobile menu"
        inert={!open}
        className={`absolute inset-y-0 left-0 flex w-[min(400px,88vw)] flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-primary/10 flex items-center justify-between border-b px-6 py-5">
          <Link
            href="/"
            onClick={onClose}
            aria-label="Spectrum Biosciences home"
          >
            <Image
              src="/assets/spectrum-logo.png"
              alt="Spectrum Biosciences"
              width={165}
              height={55}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="bg-accent-light text-primary hover:bg-primary flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-7">
          <span className="text-secondary font-sans text-[11px] font-bold tracking-[0.2em] uppercase">
            Explore Spectrum
          </span>
          <nav aria-label="Mobile navigation" className="mt-5">
            {navLinks.map((link, index) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`group border-primary/10 font-heading flex items-center justify-between border-b py-4 text-[clamp(23px,5vw,30px)] font-semibold tracking-[-0.05em] transition-colors ${
                    active
                      ? "text-secondary"
                      : "text-primary hover:text-secondary"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-primary/35 font-sans text-[11px] font-bold tracking-normal">
                      0{index + 1}
                    </span>
                    {link.name}
                  </span>
                  <ArrowUpRight
                    size={21}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              );
            })}
          </nav>

          <Link
            href="/account"
            onClick={onClose}
            className="border-primary/10 bg-accent-light text-primary mt-7 flex items-center gap-3 rounded-2xl border px-5 py-4 font-sans text-[14px] font-semibold"
          >
            <UserRound size={19} />
            My Account
            <ChevronRight size={18} className="ml-auto" />
          </Link>

          <div className="relative mt-7 overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#55205F,#872B95)] p-6 text-white">
            <div className="pointer-events-none absolute -top-14 -right-14 h-48 w-48 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute -top-7 -right-7 h-36 w-36 rounded-full border border-white/10" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 font-sans text-[10px] font-semibold tracking-wider uppercase">
                <Sparkles size={13} className="text-[#FFBF72]" />
                Bundle & Save
              </span>
              <h3 className="font-heading mt-4 text-[25px] leading-tight font-bold tracking-[-0.05em]">
                More Research.
                <br />
                More Savings.
              </h3>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-white/75">
                Save up to 15% with selected multi-bottle bundles.
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
          </div>
        </div>

        <div className="border-primary/10 border-t px-6 py-5">
          <div className="text-primary/60 flex items-center gap-2">
            <FlaskConical size={17} />
            <p className="font-sans text-[11px] font-medium">
              For laboratory research only
            </p>
          </div>
          <p className="text-muted mt-2 font-sans text-[11px]">
            © {new Date().getFullYear()} Spectrum Biosciences
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = 0;

  useEffect(() => {
  let ticking = false;
  let isHidden = window.scrollY > 120;

  const updateScroll = () => {
    const scrollY = window.scrollY;

    if (!isHidden && scrollY > 120) {
      isHidden = true;
      setScrolled(true);
    } else if (isHidden && scrollY < 20) {
      isHidden = false;
      setScrolled(false);
    }

    ticking = false;
  };

  const handleScroll = () => {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(updateScroll);
  };

  updateScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <AnnouncementBar hidden={scrolled} />
        <div className="border-primary/10 relative border-b bg-white/95 backdrop-blur-xl">
          <div
            className={`relative mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 transition-[padding] duration-500 ease-in-out sm:px-6 lg:px-8 ${
              scrolled ? "py-2 sm:py-2 lg:py-2" : "py-4 sm:py-4 lg:py-5"
            }`}
          >
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-5 lg:flex xl:gap-8"
            >
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative font-sans text-[13px] font-semibold whitespace-nowrap transition-colors xl:text-[14px] ${
                      active ? "text-primary" : "text-text hover:text-primary"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`bg-secondary absolute -bottom-1 left-0 h-[2px] transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(true);
                setSearchOpen(false);
              }}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="spectrum-mobile-menu"
              className="text-primary hover:bg-primary/5 flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            >
              <Menu size={24} strokeWidth={1.8} />
            </button>

            <Link
              href="/"
              aria-label="Spectrum Biosciences home"
              className="relative z-10 justify-self-center"
            >
              <Image
                src="/assets/spectrum-logo.png"
                alt="Spectrum Biosciences"
                width={210}
                height={65}
                priority
                className="h-[40px] w-auto object-contain sm:h-[47px] lg:h-[55px]"
              />
            </Link>

            <div className="flex items-center justify-end gap-0.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((current) => !current);
                  setMobileOpen(false);
                }}
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
                aria-controls="spectrum-search"
                className="text-primary hover:bg-primary/5 flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:h-11 sm:w-11"
              >
                {searchOpen ? <X size={21} /> : <Search size={21} />}
              </button>
              <Link
                href="/account"
                aria-label="My account"
                className="text-primary hover:bg-primary/5 hidden h-11 w-11 items-center justify-center rounded-full transition-colors sm:flex"
              >
                <UserRound size={21} />
              </Link>
              <Link
                href="/cart"
                aria-label={`Shopping cart, ${cartCount} items`}
                className="text-primary hover:bg-primary/5 relative flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:h-11 sm:w-11"
              >
                <ShoppingBag size={21} />
                {cartCount > 0 && (
                  <span className="bg-secondary absolute top-0 right-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-1 font-sans text-[9px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div
            id="spectrum-search"
            inert={!searchOpen}
            aria-hidden={!searchOpen}
            className={`border-primary/10 absolute top-full right-0 left-0 border-b bg-white shadow-xl transition-all duration-300 ${
              searchOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-3 opacity-0"
            }`}
          >
            <form
              onSubmit={handleSearch}
              role="search"
              className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-6 sm:px-8"
            >
              <Search size={21} className="text-primary shrink-0" />
              <label htmlFor="header-search" className="sr-only">
                Search products
              </label>
              <input
                id="header-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search research products..."
                className="text-text placeholder:text-muted min-w-0 flex-1 bg-transparent font-sans text-[15px] outline-none sm:text-[17px]"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                aria-label="Submit search"
                className="bg-primary hover:bg-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors disabled:opacity-40"
              >
                <ArrowRight size={19} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

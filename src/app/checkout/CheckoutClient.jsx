"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  LockKeyhole,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { CART_SETTINGS, formatCartMoney, useCart } from "@/context/CartContext";
import FreeShippingProgress from "@/components/cart/FreeShippingProgress";

const STANDARD_SHIPPING_ESTIMATE = 10; // Replace with your actual shipping estimate.
const US_STATES =
  "AL:Alabama,AK:Alaska,AZ:Arizona,AR:Arkansas,CA:California,CO:Colorado,CT:Connecticut,DE:Delaware,FL:Florida,GA:Georgia,HI:Hawaii,ID:Idaho,IL:Illinois,IN:Indiana,IA:Iowa,KS:Kansas,KY:Kentucky,LA:Louisiana,ME:Maine,MD:Maryland,MA:Massachusetts,MI:Michigan,MN:Minnesota,MS:Mississippi,MO:Missouri,MT:Montana,NE:Nebraska,NV:Nevada,NH:New Hampshire,NJ:New Jersey,NM:New Mexico,NY:New York,NC:North Carolina,ND:North Dakota,OH:Ohio,OK:Oklahoma,OR:Oregon,PA:Pennsylvania,RI:Rhode Island,SC:South Carolina,SD:South Dakota,TN:Tennessee,TX:Texas,UT:Utah,VT:Vermont,VA:Virginia,WA:Washington,WV:West Virginia,WI:Wisconsin,WY:Wyoming,DC:District of Columbia"
    .split(",")
    .map((item) => item.split(":"));
const fieldClass =
  "h-12 w-full rounded-xl border border-[#E9E0EA] bg-white px-4 text-sm text-[#29232D] outline-none transition-colors placeholder:text-[#A79BA9] focus:border-primary focus:ring-2 focus:ring-primary/10";

function Field({
  label,
  name,
  value,
  onChange,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#514653]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${fieldClass} ${error ? "border-red-400" : ""}`}
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SectionHeading({ icon: Icon, step, title, subtitle }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="text-primary grid size-10 shrink-0 place-items-center rounded-xl bg-[#F6E5F7]">
        <Icon size={19} strokeWidth={1.8} />
      </span>
      <div>
        <h2 className="font-heading mt-0.5 text-xl font-semibold tracking-[-0.04em] text-[#29232D] sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-[#817586]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CheckoutClient() {
  const { items, hydrated, subtotal, itemCount, qualifiesForFreeShipping } =
    useCart();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    country: "US",
  });
  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const shippingEstimate = qualifiesForFreeShipping
    ? 0
    : STANDARD_SHIPPING_ESTIMATE;
  const estimatedTotal = subtotal + shippingEstimate;
  const update = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setReviewed(false);
  };
  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    for (const key of ["firstName", "lastName", "address", "city", "state"]) {
      if (!form[key].trim()) next[key] = "This field is required.";
    }
    if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim()))
      next.zip = "Enter a valid US ZIP code.";
    if (form.phone && !/^[\d\s()+.-]{7,20}$/.test(form.phone))
      next.phone = "Enter a valid phone number.";
    if (!consent)
      next.consent = "Please confirm the research-use acknowledgement.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      setReviewed(false);
      return;
    }
    setReviewed(true);
  };

  return (
    <main className="min-h-svh bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-2 text-xs text-[#96899A]"
        >
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/cart" className="hover:text-primary">
            Cart
          </Link>
          <ChevronRight size={14} />
          <span className="text-primary font-semibold">Checkout</span>
        </nav>

        <header className="mb-9 flex flex-col justify-between gap-5 border-b border-[#EEE6EF] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-secondary mb-3 text-[11px] font-semibold tracking-[0.14em] uppercase">
              Spectrum Biosciences
            </p>
            <h1 className="section-heading">
              Checkout<span className="text-secondary">.</span>
            </h1>
            <p className="mt-2 text-sm text-[#817586]">
              Review your research selection and enter delivery details.
            </p>
          </div>
          <Link
            href="/cart"
            className="group border-primary/20 text-primary hover:border-primary hover:bg-primary inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-xs font-semibold transition-colors hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />{" "}
            Return to cart
          </Link>
        </header>
        {!hydrated ? (
          <div
            role="status"
            className="rounded-2xl border border-[#EEE6EF] p-10 text-center text-sm text-[#817586]"
          >
            Loading your cart...
          </div>
        ) : items.length === 0 ? (
          <section className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#EEE6EF] px-6 text-center">
            <span className="text-primary grid size-16 place-items-center rounded-2xl bg-[#F6E5F7]">
              <ShoppingBag size={29} />
            </span>
            <h2 className="font-heading mt-5 text-2xl font-bold text-[#29232D]">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-[#817586]">
              Add research products before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="bg-primary mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#35143E]"
            >
              Explore products <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-9">
            <div className="space-y-5">
              <section
                aria-labelledby="contact-title"
                className="rounded-[22px] border border-[#EEE6EF] p-5 sm:p-7"
              >
                <SectionHeading
                  icon={Mail}
                  step="01"
                  title="Contact information"
                  subtitle="We'll use this to contact you about your order."
                />
                <h3 id="contact-title" className="sr-only">
                  Contact information
                </h3>
                <Field
                  name="email"
                  label="Email address *"
                  type="email"
                  value={form.email}
                  onChange={update}
                  autoComplete="email"
                  placeholder="you@example.com"
                  error={errors.email}
                  required
                />
              </section>
              <section
                aria-label="Shipping address"
                className="rounded-[22px] border border-[#EEE6EF] p-5 sm:p-7"
              >
                <SectionHeading
                  icon={MapPin}
                  step="02"
                  title="Shipping address"
                  subtitle="Currently set up for US shipping addresses."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="firstName"
                    label="First name *"
                    value={form.firstName}
                    onChange={update}
                    autoComplete="given-name"
                    error={errors.firstName}
                    required
                  />
                  <Field
                    name="lastName"
                    label="Last name *"
                    value={form.lastName}
                    onChange={update}
                    autoComplete="family-name"
                    error={errors.lastName}
                    required
                  />
                  <Field
                    name="company"
                    label="Company / laboratory (optional)"
                    value={form.company}
                    onChange={update}
                    autoComplete="organization"
                    className="sm:col-span-2"
                  />
                  <Field
                    name="address"
                    label="Street address *"
                    value={form.address}
                    onChange={update}
                    autoComplete="address-line1"
                    error={errors.address}
                    className="sm:col-span-2"
                    required
                  />
                  <Field
                    name="apartment"
                    label="Apartment, suite, etc. (optional)"
                    value={form.apartment}
                    onChange={update}
                    autoComplete="address-line2"
                    className="sm:col-span-2"
                  />
                  <Field
                    name="city"
                    label="City *"
                    value={form.city}
                    onChange={update}
                    autoComplete="address-level2"
                    error={errors.city}
                    required
                  />
                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-xs font-semibold text-[#514653]"
                    >
                      State *
                    </label>
                    <div className="relative">
                      <select
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={update}
                        autoComplete="address-level1"
                        aria-invalid={Boolean(errors.state)}
                        aria-describedby={
                          errors.state ? "state-error" : undefined
                        }
                        required
                        className={`${fieldClass} appearance-none pr-10 ${errors.state ? "border-red-400" : ""}`}
                      >
                        <option value="">Select state</option>
                        {US_STATES.map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute top-4 right-4 text-[#817586]"
                      />
                    </div>
                    {errors.state && (
                      <p
                        id="state-error"
                        className="mt-1.5 text-xs text-red-600"
                      >
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <Field
                    name="zip"
                    label="ZIP code *"
                    value={form.zip}
                    onChange={update}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    error={errors.zip}
                    required
                  />
                  <Field
                    name="phone"
                    label="Phone (optional)"
                    type="tel"
                    value={form.phone}
                    onChange={update}
                    autoComplete="tel"
                    error={errors.phone}
                  />
                </div>
              </section>
              <section
                aria-label="Shipping method"
                className="rounded-[22px] border border-[#EEE6EF] p-5 sm:p-7"
              >
                <SectionHeading
                  icon={Truck}
                  step="03"
                  title="Delivery method"
                  subtitle="Shipping is an estimate until carrier rates are connected."
                />
                <div className="border-primary/30 flex items-center gap-4 rounded-2xl border bg-[#FCF9FC] p-4">
                  <span className="text-primary grid size-10 shrink-0 place-items-center rounded-xl bg-[#F6E5F7]">
                    <Package size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#29232D]">
                      Standard tracked shipping
                    </p>
                    <p className="mt-1 text-xs text-[#817586]">
                      US delivery · estimated rate
                    </p>
                  </div>
                  <strong className="text-primary text-sm">
                    {qualifiesForFreeShipping
                      ? "FREE"
                      : formatCartMoney(shippingEstimate)}
                  </strong>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#817586]">
                  Free shipping applies at{" "}
                  {formatCartMoney(CART_SETTINGS.freeShippingThreshold)}{" "}
                  merchandise subtotal. Taxes and final shipping rates are not
                  calculated yet.
                </p>
              </section>
              <section
                aria-label="Research acknowledgement"
                className="rounded-[22px] border border-[#EEE6EF] p-5 sm:p-7"
              >
                <div className="flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setErrors((old) => ({ ...old, consent: undefined }));
                      setReviewed(false);
                    }}
                    className="mt-1 size-4 accent-[#55205F]"
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm leading-relaxed text-[#514653]"
                  >
                    I understand that these products are intended for laboratory
                    research use only and are not for human or veterinary use.
                  </label>
                </div>
                {errors.consent && (
                  <p className="mt-2 text-xs text-red-600">{errors.consent}</p>
                )}
                <button
                  type="button"
                  onClick={validate}
                  className="bg-primary mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-colors hover:bg-[#35143E]"
                >
                  Review checkout details <ArrowRight size={17} />
                </button>
                {reviewed && (
                  <p
                    role="status"
                    className="mt-4 flex items-start gap-2 rounded-xl border border-[#CBE5D3] bg-[#F1FAF3] p-3 text-xs leading-relaxed text-[#246B43]"
                  >
                    <Check size={16} className="shrink-0" /> Details validated
                    locally. Payment and order submission are not connected yet.
                  </p>
                )}
              </section>
            </div>
            <aside
              aria-label="Order summary"
              className="overflow-hidden rounded-[22px] border border-[#EEE6EF] bg-white lg:sticky lg:top-[105px]"
            >
              <div className="flex items-center justify-between border-b border-[#EEE6EF] px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-[#29232D]">
                    Order summary
                  </h2>
                  <p className="mt-1 text-sm text-[#817586]">
                    Review products before payment
                  </p>
                </div>
                <span className="text-primary rounded-full bg-[#F6E5F7] px-3 py-1 text-xs font-semibold">
                  {itemCount} bottles
                </span>
              </div>
              <div className="max-h-[350px] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                {items.map((item) => (
                  <article key={item.key} className="flex items-center gap-3">
                    <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-[#F6E5F7]">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-heading hover:text-primary text-sm font-bold text-[#29232D]"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-[#817586]">
                        {item.variantLabel}
                      </p>
                      <p className="mt-1 text-[11px] text-[#96899A]">
                        {item.quantity} × {formatCartMoney(item.price)}
                      </p>
                    </div>
                    <strong className="text-primary shrink-0 text-xs">
                      {formatCartMoney(item.price * item.quantity)}
                    </strong>
                  </article>
                ))}
              </div>
              <div className="space-y-5 border-t border-[#EEE6EF] px-5 py-5 sm:px-6">
                <FreeShippingProgress compact />
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#817586]">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-[#29232D]">
                      {formatCartMoney(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-[#817586]">
                    <dt>Estimated shipping</dt>
                    <dd className="font-semibold text-[#29232D]">
                      {qualifiesForFreeShipping
                        ? "FREE"
                        : formatCartMoney(shippingEstimate)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-[#817586]">
                    <dt>Taxes</dt>
                    <dd>Not calculated</dd>
                  </div>
                </dl>
                <div className="flex items-center justify-between border-t border-[#EEE6EF] pt-5">
                  <div>
                    <p className="font-heading text-base font-semibold text-[#29232D]">
                      Estimated total
                    </p>
                  </div>
                  <strong className="font-heading text-primary text-2xl font-bold tracking-[-0.04em]">
                    {formatCartMoney(estimatedTotal)}
                  </strong>
                </div>
                <button
                  type="button"
                  disabled
                  className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#D4CBD6] text-sm font-semibold text-white"
                >
                  <LockKeyhole size={16} /> Continue to secure payment
                </button>
                <p className="flex items-center justify-center gap-2 text-sm text-[#96899A]">
                  <ShieldCheck size={14} /> No payment is collected on this page
                </p>
              </div>
            </aside>
          </div>
        )}
        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-[#96899A]">
          <FlaskConical size={15} /> For laboratory research use only
        </p>
      </div>
    </main>
  );
}

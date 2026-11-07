"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Mail,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";
import Image from "next/image";

const DEMO_ORDERS = [
  {
    id: "ORD-1042",
    email: "demo@yourshop.com",
    status: "out_for_delivery",
    carrier: "Demo carrier",
    eta: "Not available",
    items: [{ name: "BPC-157", qty: 1 }],
  },
  {
    id: "ORD-1033",
    email: "sara@example.com",
    status: "shipped",
    carrier: "Demo carrier",
    eta: "Not available",
    items: [{ name: "TB-500", qty: 1 }],
  },
  {
    id: "ORD-1001",
    email: "ali@example.com",
    status: "delivered",
    carrier: "Demo carrier",
    eta: "Delivered (demo)",
    items: [{ name: "GHK-Cu", qty: 1 }],
  },
];

const STEPS = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "packed", label: "Packed", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: Check },
];

const statusLabels = {
  placed: "Order Placed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export default function OrderTracker() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [phase, setPhase] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;

    setPhase("loading");
    setOrder(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const number = orderNumber.trim().replace(/^#/, "").toLowerCase();
    const billingEmail = email.trim().toLowerCase();

    const found = DEMO_ORDERS.find(
      (item) =>
        (item.id.toLowerCase() === number ||
          item.id.toLowerCase().replace("ord-", "") === number) &&
        item.email.toLowerCase() === billingEmail,
    );

    setOrder(found || null);
    setPhase(found ? "found" : "missing");
  }

  const currentStep = order
    ? STEPS.findIndex((step) => step.key === order.status)
    : -1;

  return (
    <main className="">
      <section className="px-4 py-6 sm:px-6 lg:px-10 md:py-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="min-w-0">
            <h1 className="section-heading">
              Track your order, <span className="text-primary">live.</span>
            </h1>

            <p className="mt-5 max-w-[620px] text-sm text-[#687087]">
              Enter your order number and the email you used at checkout. We'll
              show the information available in our order system.
            </p>

            <div className="mt-8 rounded-[22px] border border-[#E3E3EC] bg-white p-5 shadow-[0_20px_45px_rgba(25,30,55,0.07)] sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-primary flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#F1E5F4]">
                  <Package size={23} strokeWidth={1.7} />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#29232D]">
                    Find your order
                  </h2>
                  <p className="mt-1 text-sm text-[#777079]">
                    Both details must match the same order.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="order-number"
                      className="mb-2 block text-sm font-semibold text-[#29232D]"
                    >
                      Order number
                    </label>
                    <div className="relative">
                      <Search
                        size={18}
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#8B8290]"
                      />
                      <input
                        id="order-number"
                        type="text"
                        required
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="e.g. ORD-1042"
                        autoComplete="off"
                        className="focus:border-primary h-13 w-full rounded-xl border border-[#E5DCE8] bg-white pr-4 pl-11 text-sm text-[#29232D] transition-colors outline-none placeholder:text-[#A19AA5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="billing-email"
                      className="mb-2 block text-sm font-semibold text-[#29232D]"
                    >
                      Billing email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#8B8290]"
                      />
                      <input
                        id="billing-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@lab.com"
                        autoComplete="email"
                        className="focus:border-primary h-13 w-full rounded-xl border border-[#E5DCE8] bg-white pr-4 pl-11 text-sm text-[#29232D] transition-colors outline-none placeholder:text-[#A19AA5]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={phase === "loading"}
                  className="bg-primary mt-5 flex h-13 w-full items-center justify-center gap-3 rounded-full px-6 text-sm font-bold text-white transition-colors hover:bg-[#35143E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {phase === "loading"
                    ? "Finding your order..."
                    : "Track my order"}
                  <ArrowRight size={18} />
                </button>

                {phase === "missing" && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    No matching demo order was found. Check both details and try
                    again.
                  </p>
                )}

                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#777079]">
                  <LockKeyhole size={15} className="mt-0.5 shrink-0" />
                  We only show an order when both details match.
                  <Link
                    href="/account"
                    className="text-primary font-semibold underline"
                  >
                    See your orders
                  </Link>
                </p>
              </form>
            </div>

            <p className="mt-4 text-xs leading-6 text-[#817586]">
              Demo only: Try <strong>ORD-1042</strong> with{" "}
              <strong>demo@yourshop.com</strong>.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[380px]">
            <div className="relative overflow-hidden rounded-[48px] border-2 border-[#A577B0] bg-[#FBFCFF] p-2.5 shadow-[0_25px_70px_rgba(85,32,95,0.1)]">
              <div className="flex min-h-130 flex-col overflow-hidden rounded-[39px] border border-[#E4DEEB] bg-white">
                <div className="bg-[#F2E8F5] px-6 pt-4 pb-6">
                  <div className="mx-auto mb-5 h-5 w-23 rounded-full border border-[#E6D9EA] bg-white/60" />

                  <div className="relative h-12 w-45">
                    <Image
                      src="/assets/spectrum-logo.png"
                      alt="Spectrum Biosciences"
                      fill
                      priority
                      sizes="190px"
                      className="object-contain object-left"
                    />
                  </div>

                  <p className="text-primary mt-3 flex items-center gap-2 text-xs font-medium">
                    Your order, connected.
                    <LockKeyhole size={13} />
                  </p>
                </div>

                <div className="flex flex-1 flex-col px-5 py-8">
                  {phase === "idle" && (
                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                      <span className="bg-primary flex size-15 items-center justify-center rounded-full text-white">
                        <Search size={24} />
                      </span>
                      <h3 className="font-heading mt-5 text-2xl font-bold text-[#29232D]">
                        Ready to track
                      </h3>
                      <p className="mt-3 max-w-[230px] text-sm leading-7 text-[#687087]">
                        Enter your order number and billing email to see your
                        order here.
                      </p>
                    </div>
                  )}

                  {phase === "loading" && (
                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                      <div className="border-t-primary size-12 animate-spin rounded-full border-[3px] border-[#EEDCF1]" />
                      <p className="text-primary mt-5 text-sm font-semibold">
                        Looking up your order...
                      </p>
                    </div>
                  )}

                  {phase === "missing" && (
                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                      <span className="text-primary flex size-15 items-center justify-center rounded-full bg-[#F9EDF9]">
                        <Search size={24} />
                      </span>
                      <h3 className="font-heading mt-5 text-xl font-bold text-[#29232D]">
                        Order not found
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#687087]">
                        Please check your order number and billing email.
                      </p>
                    </div>
                  )}

                  {phase === "found" && order && (
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#817586]">
                          Order #{order.id}
                        </span>
                        <span className="rounded-full bg-[#EAF8F1] px-3 py-1 text-[10px] font-bold text-emerald-700">
                          Demo order
                        </span>
                      </div>

                      <h3 className="font-heading text-primary mt-3 text-2xl font-bold">
                        {statusLabels[order.status]}
                      </h3>
                      <p className="mt-2 text-sm text-[#817586]">
                        {order.carrier} · {order.eta}
                      </p>

                      <div className="mt-7 space-y-0">
                        {STEPS.map((step, index) => {
                          const Icon = step.icon;
                          const completed = index <= currentStep;
                          const last = index === STEPS.length - 1;

                          return (
                            <div key={step.key} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <span
                                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${
                                    completed
                                      ? "border-primary bg-primary text-white"
                                      : "border-[#E9E1E9] bg-white text-[#B0A4B3]"
                                  }`}
                                >
                                  <Icon size={16} />
                                </span>
                                {!last && (
                                  <div
                                    className={`h-10 w-0.5 ${index < currentStep ? "bg-primary" : "bg-[#E9E1E9]"}`}
                                  />
                                )}
                              </div>
                              <div className="pt-2">
                                <p
                                  className={`text-sm font-semibold ${completed ? "text-[#29232D]" : "text-[#A49AA7]"}`}
                                >
                                  {step.label}
                                </p>
                                {index === currentStep && (
                                  <p className="text-primary mt-1 text-xs">
                                    Current status
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 rounded-xl bg-[#FAF7FA] p-4">
                        <p className="text-primary mb-2 text-xs font-bold">
                          Order items
                        </p>
                        {order.items.map((item) => (
                          <p key={item.name} className="text-sm text-[#777079]">
                            {item.qty} × {item.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

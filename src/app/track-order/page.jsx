"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";
import usa from "@/data/us-map-data.json";

const STAGES = [
  {
    key: "placed",
    label: "Order placed",
    detail: "Order received",
    progress: 0,
  },
  {
    key: "packed",
    label: "Packed",
    detail: "Prepared for shipment",
    progress: 0.08,
  },
  {
    key: "shipped",
    label: "Shipped",
    detail: "Shipment is in transit",
    progress: 0.48,
  },
  {
    key: "out_for_delivery",
    label: "Out for delivery",
    detail: "Final delivery stage",
    progress: 0.86,
  },
  {
    key: "delivered",
    label: "Delivered",
    detail: "Shipment delivered",
    progress: 1,
  },
];

const DEMO_ORDERS = [
  {
    id: "ORD-1042",
    email: "demo@yourshop.com",
    status: "out_for_delivery",
    eta: "Delivery date unavailable",
    carrier: "Demo carrier",
    items: [{ name: "BPC-157", qty: 1 }],
    times: {
      placed: "Mon, 9:12 AM",
      packed: "Mon, 2:40 PM",
      shipped: "Tue, 8:05 AM",
      out_for_delivery: "Wed, 10:18 AM",
    },
  },
  {
    id: "ORD-1033",
    email: "sara@example.com",
    status: "shipped",
    eta: "Delivery date unavailable",
    carrier: "Demo carrier",
    items: [{ name: "TB-500", qty: 1 }],
    times: {
      placed: "Tue, 11:30 AM",
      packed: "Tue, 5:10 PM",
      shipped: "Wed, 7:45 AM",
    },
  },
  {
    id: "ORD-1001",
    email: "ali@example.com",
    status: "delivered",
    eta: "Delivered (demo)",
    carrier: "Demo carrier",
    items: [{ name: "GHK-Cu", qty: 1 }],
    times: {
      placed: "Fri, 10:00 AM",
      packed: "Fri, 3:20 PM",
      shipped: "Sat, 9:00 AM",
      out_for_delivery: "Mon, 11:15 AM",
      delivered: "Mon, 3:02 PM",
    },
  },
];

const p = usa.cities;
const route = `M${p["Los Angeles"].join(",")} C195,275 255,235 ${p.Denver.join(",")} S410,240 ${p["Kansas City"].join(",")} S530,203 ${p.Chicago.join(",")} S675,170 ${p["New York"].join(",")}`;

async function fetchDemoOrder(query) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const value = query.trim().toLowerCase().replace(/^#/, "");
  return (
    DEMO_ORDERS.find(
      (order) =>
        order.id.toLowerCase() === value ||
        order.id.toLowerCase().replace("ord-", "") === value ||
        order.email.toLowerCase() === value,
    ) || null
  );
}

function TrackingMap({ order }) {
  const pathRef = useRef(null);
  const progressRef = useRef(null);
  const markerRef = useRef(null);
  const frameRef = useRef(0);
  const activeRef = useRef(0);
  const progress = order
    ? (order.progress ??
      STAGES.find((stage) => stage.key === order.status)?.progress ??
      0)
    : null;
  const delivered = order?.status === "delivered";

  const paint = useCallback((value) => {
    const path = pathRef.current;
    if (!path || !progressRef.current || !markerRef.current) return;
    const length = path.getTotalLength();
    const at = path.getPointAtLength(length * value);
    progressRef.current.style.strokeDasharray = `${length * value} ${length}`;
    markerRef.current.setAttribute("transform", `translate(${at.x} ${at.y})`);
  }, []);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    if (progress == null) {
      activeRef.current = 0;
      return;
    }
    const from = activeRef.current;
    const to = Math.max(0, Math.min(1, progress));
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : 2600;
    const start = performance.now();
    const animate = (time) => {
      const t = duration ? Math.min(1, (time - start) / duration) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + (to - from) * eased;
      paint(value);
      activeRef.current = value;
      if (t < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [progress, paint]);

  return (
    <section
      aria-label="United States shipment map"
      className="relative overflow-hidden rounded-[22px] border border-[#E9DDEA] bg-[#F9F5FA]"
    >
      <div className="text-primary absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-[#EADDEB] bg-white/95 px-3 py-2 text-[11px] font-semibold shadow-sm">
        <MapPin size={14} /> United States{" "}
        {order ? "· Demo route" : "· Map preview"}
      </div>
      <svg
        viewBox="0 0 900 540"
        role="img"
        aria-label={
          order
            ? `Illustrative US route for ${order.id}`
            : "Map of the continental United States"
        }
        className="block h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={usa.outline}
          fill="#F1E4F3"
          stroke="#C9B2D0"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {usa.states.map((state) => (
          <path
            key={state.id}
            d={state.d}
            fill="none"
            stroke="#CCB9D0"
            strokeWidth="0.85"
            strokeLinejoin="round"
          />
        ))}
        {order && (
          <>
            <path
              d={route}
              stroke="#FFFFFF"
              strokeWidth="13"
              fill="none"
              strokeLinecap="round"
            />
            <path
              ref={pathRef}
              d={route}
              stroke="#C7B1CC"
              strokeWidth="5"
              strokeDasharray="3 11"
              fill="none"
              strokeLinecap="round"
            />
            <path
              ref={progressRef}
              d={route}
              stroke={delivered ? "#239A6D" : "#55205F"}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              style={{ strokeDasharray: "0 2000" }}
            />
            <circle
              cx={p["Los Angeles"][0]}
              cy={p["Los Angeles"][1]}
              r="10"
              fill="white"
              stroke="#55205F"
              strokeWidth="4"
            />
            <circle
              cx={p["New York"][0]}
              cy={p["New York"][1]}
              r="10"
              fill="white"
              stroke="#F47735"
              strokeWidth="4"
            />
            <g ref={markerRef}>
              <circle r="17" fill="#55205F" fillOpacity="0.16" />
              <circle
                r="9"
                fill={delivered ? "#239A6D" : "#55205F"}
                stroke="white"
                strokeWidth="3"
              />
            </g>
          </>
        )}
      </svg>
      {order ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E9DDEA] bg-white px-4 py-3 text-xs sm:px-5">
          <span className="text-primary font-semibold">
            Los Angeles, CA <span className="mx-2 text-[#A691AB]">→</span> New
            York, NY
          </span>
          <span className="text-[#86758B]">
            Illustrative route · Not live GPS
          </span>
        </div>
      ) : (
        <div className="border-t border-[#E9DDEA] bg-white px-4 py-3 text-xs text-[#86758B] sm:px-5">
          Enter an order number to see the animated route.
        </div>
      )}
    </section>
  );
}

function Timeline({ order }) {
  const current = STAGES.findIndex((stage) => stage.key === order.status);
  return (
    <ol className="mt-6">
      {STAGES.map((stage, index) => {
        const done = index <= current;
        return (
          <li key={stage.key} className="relative flex gap-4 pb-6 last:pb-0">
            {index !== STAGES.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute top-5 left-[9px] h-full w-px ${index < current ? "bg-primary" : "bg-[#E7DCE9]"}`}
              />
            )}
            <span
              className={`relative z-10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${done ? "border-primary bg-primary text-white" : "border-[#D9C8DC] bg-white"}`}
            >
              {done && <Check size={12} strokeWidth={3} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <p
                  className={`text-sm font-semibold ${done ? "text-primary" : "text-[#96889A]"}`}
                >
                  {stage.label}
                </p>
                {done && order.times?.[stage.key] && (
                  <span className="text-[11px] text-[#918397]">
                    {order.times[stage.key]}
                  </span>
                )}
              </div>
              {done && (
                <p className="mt-1 text-xs text-[#817586]">{stage.detail}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function OrderTracker() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("idle");
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setPhase("loading");
    setOrder(null);
    setSearched(value);
    try {
      const found = await fetchDemoOrder(value);
      setOrder(found);
      setPhase(found ? "found" : "missing");
    } catch {
      setPhase("missing");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-[#EEE6EF] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-2 text-xs text-[#95879A]"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">Track Order</span>
          </nav>
          <p className="text-secondary mb-3 text-[11px] font-bold tracking-[0.15em] uppercase">
            Spectrum Biosciences
          </p>
          <h1 className="section-heading">
            Track Your <span className="text-secondary">Order.</span>
          </h1>
          <p className="mt-3 max-w-lg text-md text-[#817586]">
            Enter an order number to check shipment progress and view its route
            across the United States.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="track-query" className="sr-only">
              Order number
            </label>
            <div className="relative flex-1">
              <Search
                size={18}
                className="text-primary/55 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
              />
              <input
                id="track-query"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Enter order number (e.g. ORD-1042)"
                className="text-primary focus:border-primary h-12 w-full rounded-full border border-[#E8DCEA] bg-white pr-4 pl-11 text-sm outline-none placeholder:text-[#A99CAB]"
              />
            </div>
            <button
              type="submit"
              disabled={phase === "loading" || !query.trim()}
              className="bg-primary flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition-colors hover:bg-[#35143E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {phase === "loading" ? "Searching..." : "Track Order"}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="mt-3 text-[11px] text-[#918397]">
            Demo IDs:{" "}
            {DEMO_ORDERS.map((item, index) => (
              <span key={item.id}>
                {index > 0 && " · "}
                <button
                  type="button"
                  className="text-primary font-semibold underline underline-offset-2"
                  onClick={() => setQuery(item.id)}
                >
                  {item.id}
                </button>
              </span>
            ))}
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl items-start gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div
          aria-live="polite"
          className="rounded-[22px] border border-[#EEE6EF] bg-white p-5 sm:p-7"
        >
          {phase === "idle" && (
            <div>
              <Package size={25} className="text-primary" />
              <h2 className="font-heading text-primary mt-4 text-2xl font-semibold">
                Your shipment details
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#817586]">
                Search above to see order milestones and delivery information.
              </p>
            </div>
          )}
          {phase === "loading" && (
            <div
              role="status"
              className="flex items-center gap-3 text-sm text-[#817586]"
            >
              <span className="border-t-primary size-4 animate-spin rounded-full border-2 border-[#E4D5E8]" />
              Finding your order...
            </div>
          )}
          {phase === "missing" && (
            <div role="alert">
              <h2 className="font-heading text-primary text-xl font-semibold">
                Order not found
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#817586]">
                No demo order matches “{searched}”. Check the order number and
                try again.
              </p>
            </div>
          )}
          {phase === "found" && order && (
            <div>
              <p className="text-secondary text-xs font-semibold tracking-widest uppercase">
                {order.id}
              </p>
              <h2 className="font-heading text-primary mt-2 text-[26px] font-bold tracking-tight">
                {STAGES.find((stage) => stage.key === order.status)?.label}
              </h2>
              <dl className="mt-5 grid grid-cols-2 gap-4 rounded-[16px] bg-[#FAF7FB] p-4 text-xs">
                <div>
                  <dt className="text-[#817586]">Estimated arrival</dt>
                  <dd className="text-primary mt-1 font-semibold">
                    {order.eta}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#817586]">Carrier</dt>
                  <dd className="text-primary mt-1 font-semibold">
                    {order.carrier}
                  </dd>
                </div>
              </dl>
              <Timeline order={order} />
              <div className="mt-6 border-t border-[#EEE6EF] pt-5">
                <p className="text-primary mb-3 text-xs font-semibold">
                  Items in your order
                </p>
                {order.items.map((item) => (
                  <p
                    key={item.name}
                    className="flex justify-between gap-3 py-1 text-sm text-[#817586]"
                  >
                    <span>{item.name}</span>
                    <span>×{item.qty}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-24">
          <TrackingMap order={order} />
          <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-[#817586]">
            <Truck size={15} className="text-primary mt-1 shrink-0" />
            This is a visual demo with sample orders and illustrative routes.
            Live carrier tracking requires your order and shipping API.
          </p>
        </div>
      </section>
    </main>
  );
}

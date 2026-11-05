"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin, Truck } from "lucide-react";
import usa from "@/data/us-map-data.json";

const hub = { x: 445.7, y: 379.2 };

const destinations = [
  { name: "Seattle", x: 124.3, y: 51.6 },
  { name: "Los Angeles", x: 115.5, y: 314.8 },
  { name: "Denver", x: 328.9, y: 240.9 },
  { name: "Minneapolis", x: 546, y: 163 },
  { name: "Chicago", x: 575.2, y: 201.2 },
  { name: "Nashville", x: 614, y: 321 },
  { name: "New York", x: 768.3, y: 192.4 },
];

const stateNames = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const highlighted = new Set(["TX", "OK", "NM", "AR", "LA", "IA"]);

function curvedRoute(city) {
  const dx = city.x - hub.x;
  const dy = city.y - hub.y;
  const distance = Math.hypot(dx, dy);
  const bend = Math.min(68, distance * 0.18);
  const mx = (hub.x + city.x) / 2;
  const my = (hub.y + city.y) / 2;

  return `M ${hub.x} ${hub.y} Q ${mx - (dy / distance) * bend} ${my + (dx / distance) * bend} ${city.x} ${city.y}`;
}

export default function USShippingCoverage() {
  const [activeState, setActiveState] = useState("IA");
  const [hoveredState, setHoveredState] = useState(null);
  const [activeCity, setActiveCity] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const mapRef = useRef(null);

  const selectedState = hoveredState || activeState;
  const selectedCity = hoveredCity || activeCity;
  const currentName = stateNames[selectedState] || selectedState;

  useEffect(() => {
    const map = mapRef.current;
    if (!map || window.innerWidth >= 640) return;
    map.scrollLeft = Math.max(0, (map.scrollWidth - map.clientWidth) / 2);
  }, []);

  return (
    <section
      aria-labelledby="shipping-coverage-title"
      className="bg-white px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-secondary mb-3 text-[11px] font-bold tracking-[0.16em] uppercase">
              Shipping Coverage
            </p>
            <h2 id="shipping-coverage-title" className="section-heading">
              Across the United States.
            </h2>
            <p className="text-md mt-3 max-w-xl text-[#817586]">
              Explore our illustrated domestic shipping network. Select a state
              or destination to learn more.
            </p>
          </div>

          <span className="text-primary inline-flex w-fit items-center gap-2 rounded-full border border-[#EADDEB] px-4 py-2 text-xs font-semibold">
            <Truck size={15} />
            Domestic Shipping
          </span>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-[#E8DCEA] bg-[#FAF6FC]">
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain sm:overflow-visible"
              aria-label="Scrollable United States shipping map"
            >
              <svg
                viewBox="0 0 900 540"
                role="img"
                aria-label="Interactive United States shipping map with routes from Dallas"
                className="block h-auto w-[680px] max-w-none sm:w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="shipping-land"
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#DCC4E6" />
                    <stop offset="100%" stopColor="#EEDFF3" />
                  </linearGradient>
                </defs>

                <path d={usa.outline} fill="url(#shipping-land)" />

                {usa.states.map((state) => {
                  const selected = selectedState === state.id;
                  const name = stateNames[state.id] || state.name || state.id;

                  return (
                    <path
                      key={state.id}
                      d={state.d}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${name}`}
                      aria-pressed={activeState === state.id}
                      fill={
                        selected
                          ? "#7F3889"
                          : highlighted.has(state.id)
                            ? "#B687C6"
                            : "#D8BEE2"
                      }
                      stroke="#FFFFFF"
                      strokeWidth={selected ? 2 : 1.25}
                      strokeLinejoin="round"
                      className="cursor-pointer transition-colors duration-300 outline-none focus:stroke-[#F47735]"
                      onMouseEnter={() => setHoveredState(state.id)}
                      onMouseLeave={() => setHoveredState(null)}
                      onFocus={() => setHoveredState(state.id)}
                      onBlur={() => setHoveredState(null)}
                      onClick={() => {
                        setActiveState(state.id);
                        setActiveCity(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setActiveState(state.id);
                          setActiveCity(null);
                        }
                      }}
                    >
                      <title>{name}</title>
                    </path>
                  );
                })}

                {destinations.map((city, index) => {
                  const active = selectedCity === city.name;
                  const route = curvedRoute(city);

                  return (
                    <g key={city.name}>
                      <path
                        d={route}
                        fill="none"
                        stroke={active ? "#F47735" : "#6B2777"}
                        strokeWidth={active ? 2.8 : 1.5}
                        strokeDasharray="6 8"
                        strokeLinecap="round"
                        opacity={selectedCity && !active ? 0.25 : 0.8}
                        className="shipping-route pointer-events-none"
                      />

                      <circle
                        r={active ? 4.5 : 3}
                        fill={active ? "#F47735" : "#8E429B"}
                        opacity={selectedCity && !active ? 0.2 : 0.9}
                        className="pointer-events-none motion-reduce:hidden"
                      >
                        <animateMotion
                          dur={`${5 + index * 0.65}s`}
                          path={route}
                          repeatCount="indefinite"
                        />
                      </circle>

                      <g
                        role="button"
                        tabIndex={0}
                        aria-label={`Highlight route to ${city.name}`}
                        aria-pressed={activeCity === city.name}
                        className="cursor-pointer outline-none"
                        onMouseEnter={() => setHoveredCity(city.name)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onFocus={() => setHoveredCity(city.name)}
                        onBlur={() => setHoveredCity(null)}
                        onClick={() => setActiveCity(city.name)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setActiveCity(city.name);
                          }
                        }}
                      >
                        <circle
                          cx={city.x}
                          cy={city.y}
                          r="15"
                          fill="transparent"
                        />
                        {active && (
                          <circle
                            cx={city.x}
                            cy={city.y}
                            r="9"
                            fill="#F47735"
                            opacity="0.18"
                            className="motion-safe:animate-pulse"
                          />
                        )}
                        <circle
                          cx={city.x}
                          cy={city.y}
                          r={active ? 5.5 : 4}
                          fill={active ? "#F47735" : "white"}
                          stroke={active ? "#F47735" : "#55205F"}
                          strokeWidth="2"
                        />
                        <text
                          x={city.x + 9}
                          y={city.y - 8}
                          fontSize="12"
                          fontWeight="650"
                          fill={active ? "#F47735" : "#3E2145"}
                          stroke="#FFFFFF"
                          strokeWidth="3.5"
                          paintOrder="stroke"
                          fontFamily="Arial, sans-serif"
                          className="pointer-events-none"
                        >
                          {city.name}
                        </text>
                      </g>
                    </g>
                  );
                })}

                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r="18"
                  fill="#55205F"
                  opacity="0.14"
                  className="motion-safe:animate-pulse"
                />
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r="9"
                  fill="#55205F"
                  stroke="white"
                  strokeWidth="3"
                />
              </svg>
            </div>

            <div className="pointer-events-none absolute bottom-[13%] left-1/2 hidden -translate-x-1/2 rounded-lg bg-[#35143E] px-3 py-2 text-white shadow-lg lg:block">
              <p className="text-[11px] font-bold">Dallas, Texas</p>
              <p className="text-[9px] text-white/70">
                Illustrative dispatch point
              </p>
            </div>

            <aside className="relative mx-3 mb-3 rounded-[18px] border border-[#E8DCEA] bg-white p-5 shadow-sm sm:mx-5 sm:mb-5 lg:absolute lg:top-5 lg:right-5 lg:mx-0 lg:mb-0 lg:w-[235px] lg:p-5">
              <p className="text-secondary text-[10px] font-bold tracking-[0.16em] uppercase">
                Shipping Overview
              </p>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-heading text-primary text-4xl font-bold tracking-[-0.06em]">
                  US
                </span>
                <span className="text-primary text-[11px] font-semibold">
                  Domestic Delivery
                </span>
              </div>

              <div className="mt-4 border-t border-[#EEE6EF] pt-4">
                <h3 className="font-heading text-primary text-lg font-bold">
                  {selectedCity || currentName}
                </h3>
                <p className="mt-2 text-xs leading-6 text-[#817586]">
                  {selectedCity
                    ? `Illustrative shipping route from Dallas to ${selectedCity}. Actual routing and delivery times depend on the carrier.`
                    : `Explore shipping coverage for ${currentName}. Availability and delivery estimates are confirmed at checkout.`}
                </p>
              </div>

              <div className="mt-4 space-y-3 border-t border-[#EEE6EF] pt-4 text-[11px]">
                <div className="flex justify-between gap-3">
                  <span className="text-[#817586]">Service</span>
                  <strong className="text-primary text-right">
                    Tracked shipping*
                  </strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#817586]">Coverage</span>
                  <strong className="text-primary text-right">
                    United States
                  </strong>
                </div>
              </div>

              {activeCity && (
                <button
                  type="button"
                  onClick={() => setActiveCity(null)}
                  className="text-secondary hover:text-primary mt-4 inline-flex items-center gap-1 text-[11px] font-semibold"
                >
                  Show all routes <ArrowUpRight size={13} />
                </button>
              )}
            </aside>
          </div>

          <div className="flex items-start gap-2 border-t border-[#E8DCEA] bg-white px-4 py-3 text-[11px] leading-5 text-[#817586]">
            <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
            <span>
              Tap a state or city to explore. Swipe the map horizontally on
              mobile. Routes are illustrative, not live tracking. Confirm
              carrier services before publishing.
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shipping-route {
          animation: shipping-flow 16s linear infinite;
        }
        @keyframes shipping-flow {
          to {
            stroke-dashoffset: -140;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .shipping-route {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

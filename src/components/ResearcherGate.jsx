"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STORAGE_KEY = "spectrum-researcher-verified-v1";

export default function ResearcherGate() {
  const [phase, setPhase] = useState("checking");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [researchConfirmed, setResearchConfirmed] = useState(false);
  const firstCheckboxRef = useRef(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "accepted") {
        setPhase("accepted");
        return;
      }
    } catch {}

    setPhase("waiting");
    const timer = setTimeout(() => setPhase("prompt"), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "waiting" && phase !== "prompt") return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [phase]);

  const handleContinue = () => {
    if (!ageConfirmed || !researchConfirmed) return;

    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {}

    setPhase("accepted");
  };

  if (phase === "accepted" || phase === "checking") return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center px-4 py-6 sm:px-6 ${
        phase === "prompt"
          ? "bg-[#211126]/70 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      {phase === "prompt" && (
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="verification-title"
          aria-describedby="verification-description"
          className="w-full max-w-[540px] rounded-[24px] border border-[#EADDEC] bg-white p-6 shadow-[0_30px_90px_rgba(30,10,40,0.25)] sm:p-9"
        >
          <div className="mb-6 flex justify-center">
            <Image
              src="/assets/spectrum-logo.png"
              alt="Spectrum Biosciences"
              width={200}
              height={70}
              priority
              className="h-auto w-[170px] object-contain sm:w-[190px]"
            />
          </div>
          <h2
            id="verification-title"
            className="font-heading text-primary mt-3 text-[30px] leading-tight font-semibold tracking-[-0.045em] sm:text-[36px]"
          >
            Researcher Verification
          </h2>

          <p
            id="verification-description"
            className="mt-3 text-sm text-[#756B78]"
          >
            Our products are intended exclusively for qualified researchers and
            laboratory use. Please confirm the following before entering our
            website.
          </p>

          <div className="mt-7 space-y-3">
            <label className="hover:border-primary/40 flex cursor-pointer items-start gap-4 rounded-[14px] border border-[#E8DCEA] p-4 transition-colors">
              <input
                ref={firstCheckboxRef}
                type="checkbox"
                checked={ageConfirmed}
                onChange={(event) => setAgeConfirmed(event.target.checked)}
                className="mt-1 size-5 shrink-0 accent-[#55205F]"
              />

              <span className="text-[14px] leading-6 text-[#443849] sm:text-[15px]">
                I confirm that I am at least{" "}
                <strong className="text-primary font-bold">
                  21 years of age.
                </strong>
              </span>
            </label>

            <label className="hover:border-primary/40 flex cursor-pointer items-start gap-4 rounded-[14px] border border-[#E8DCEA] p-4 transition-colors">
              <input
                type="checkbox"
                checked={researchConfirmed}
                onChange={(event) => setResearchConfirmed(event.target.checked)}
                className="mt-1 size-5 shrink-0 accent-[#55205F]"
              />

              <span className="text-[14px] leading-6 text-[#443849] sm:text-[15px]">
                I confirm that I am a{" "}
                <strong className="text-primary font-bold">
                  qualified researcher
                </strong>{" "}
                purchasing for{" "}
                <strong className="text-primary font-bold">
                  in vitro or laboratory research only
                </strong>
                , not for human or veterinary use.
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!ageConfirmed || !researchConfirmed}
            className="bg-primary mt-6 flex h-13 w-full items-center justify-center gap-3 rounded-full text-[14px] font-bold text-white transition-all duration-300 hover:bg-[#35143E] disabled:cursor-not-allowed disabled:bg-[#DDD3E0] disabled:text-[#8E8292]"
          >
            Enter Spectrum
            <ArrowRight size={19} />
          </button>

          <p className="mt-6 text-[12px] leading-6 text-[#8A7D8F]">
            By continuing, you confirm that these statements are accurate.
            Products are not intended for human consumption, veterinary use, or
            diagnostic procedures.
          </p>

          <p className="mt-3 text-[12px] leading-6 text-[#8A7D8F]">
            Read our{" "}
            <Link
              href="/research-disclaimer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary font-semibold underline underline-offset-4"
            >
              Research Disclaimer
            </Link>{" "}
            for additional information.
          </p>
        </section>
      )}
    </div>
  );
}

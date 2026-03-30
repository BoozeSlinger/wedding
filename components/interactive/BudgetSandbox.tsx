"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  venue: "rustic" | "speakeasy";
}

const CATERING_TIERS = [
  { name: "Ranch Classic", multiplier: 85, desc: "BBQ stations, farm-fresh sides" },
  { name: "Curated Feast", multiplier: 120, desc: "Chef-carved mains, artisan starters" },
  { name: "The Full Spread", multiplier: 165, desc: "5-course, plated, sommelier curated" },
];

const BAR_PACKAGES = [
  { name: "Beer & Wine", per: 28, desc: "Craft selections, full evening" },
  { name: "Signature Bar", per: 55, desc: "3 signature cocktails + beer/wine" },
  { name: "Full Premium Bar", per: 85, desc: "Open bar, top-shelf, custom menu" },
];

const VENUE_FEE = { rustic: 4500, speakeasy: 6000 };

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    cancelAnimationFrame(rafRef.current);

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{displayed.toLocaleString()}</>;
}

export default function BudgetSandbox({ venue }: Props) {
  const accent = venue === "rustic" ? "var(--rustic-primary)" : "var(--speak-amber)";
  const accentDim = venue === "rustic" ? "rgba(196,146,42,0.15)" : "rgba(212,160,23,0.15)";

  const [guests, setGuests] = useState(100);
  const [cateringTier, setCateringTier] = useState(1);
  const [barPackage, setBarPackage] = useState(1);

  const [isCheckout, setIsCheckout] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const venueFee = VENUE_FEE[venue];
  const cateringCost = guests * CATERING_TIERS[cateringTier].multiplier;
  const barCost = guests * BAR_PACKAGES[barPackage].per;
  const florals = Math.round(guests * 18);
  const total = venueFee + cateringCost + barCost + florals;
  const perGuest = Math.round(total / guests);

  const handleSubmit = async () => {
    if (!name || !email) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "budget_sandbox",
          venue,
          name,
          email,
          details: {
            guests,
            cateringTier: CATERING_TIERS[cateringTier].name,
            barPackage: BAR_PACKAGES[barPackage].name,
            estimatedTotal: total,
            perGuest,
          },
        }),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sliderStyle = (val: number, min: number, max: number) => ({
    background: `linear-gradient(to right, ${accent} ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((val - min) / (max - min)) * 100}%)`,
  });

  return (
    <div
      className="glass-card p-10 md:p-16 mx-auto w-full max-w-4xl"
      style={{
        background:
          venue === "rustic"
            ? "rgba(28,18,9,0.85)"
            : "rgba(13,10,14,0.9)",
        border: `1.5px solid ${accentDim}`,
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Total Display */}
      <div className="text-center mb-16">
        <div
          className="font-ui text-sm mb-3"
          style={{
            color: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.6)`,
            letterSpacing: "0.5em",
          }}
        >
          ESTIMATED INVESTMENT
        </div>
        <div
          className="font-editorial"
          style={{
            fontSize: "clamp(4.5rem, 10vw, 8.5rem)",
            color: accent,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          $<AnimatedNumber value={total} />
        </div>
        <div
          className="font-ui text-base mt-4"
          style={{
            color: `rgba(${venue === "rustic" ? "212,184,150" : "201,168,76"},0.6)`,
            letterSpacing: "0.2em",
          }}
        >
          ${perGuest.toLocaleString()} per guest · {guests} guests
        </div>
      </div>

      {/* Guest Slider */}
      <div className="mb-14">
        <div className="flex justify-between items-center mb-5">
          <label
            className="font-ui text-lg tracking-[0.3em]"
            style={{ color: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.8)` }}
          >
            GUEST COUNT
          </label>
          <span
            className="font-editorial text-5xl"
            style={{ color: accent, letterSpacing: "0.05em" }}
          >
            {guests}
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min={20}
            max={350}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="budget-slider w-full h-3 appearance-none rounded-full"
            style={{ ...sliderStyle(guests, 20, 350), cursor: "pointer", outline: "none" }}
          />
        </div>
        <div className="flex justify-between mt-4">
          <span className="font-ui text-sm" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.25em" }}>20 GUESTS</span>
          <span className="font-ui text-sm" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.25em" }}>350 GUESTS</span>
        </div>
      </div>

      {/* Catering Tier */}
      <div className="mb-14">
        <div
          className="font-ui text-lg tracking-[0.3em] mb-6"
          style={{ color: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.8)` }}
        >
          CATERING TIER
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CATERING_TIERS.map((tier, i) => (
            <button
              key={tier.name}
              onClick={() => setCateringTier(i)}
              className="cursor-trigger text-left p-6 transition-all duration-300"
              style={{
                border: `1px solid ${cateringTier === i ? accent : "rgba(255,255,255,0.1)"}`,
                borderRadius: "4px",
                background:
                  cateringTier === i
                    ? `${accentDim}`
                    : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                transform: cateringTier === i ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div
                className="font-ui text-xl font-bold mb-3"
                style={{
                  color: cateringTier === i ? accent : "rgba(255,255,255,0.7)",
                  letterSpacing: "0.15em",
                }}
              >
                {tier.name}
              </div>
              <div
                className="font-body text-base mb-6"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.5,
                }}
              >
                {tier.desc}
              </div>
              <div
                className="font-editorial text-4xl"
                style={{ color: cateringTier === i ? accent : "rgba(255,255,255,0.5)" }}
              >
                ${tier.multiplier}<span className="text-lg opacity-60 ml-1">/pp</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bar Package */}
      <div className="mb-14">
        <div
          className="font-ui text-lg tracking-[0.3em] mb-6"
          style={{ color: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.8)` }}
        >
          BAR PACKAGE
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {BAR_PACKAGES.map((pkg, i) => (
            <button
              key={pkg.name}
              onClick={() => setBarPackage(i)}
              className="cursor-trigger text-left p-6 transition-all duration-300"
              style={{
                border: `1px solid ${barPackage === i ? accent : "rgba(255,255,255,0.1)"}`,
                borderRadius: "4px",
                background:
                  barPackage === i ? accentDim : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                transform: barPackage === i ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div
                className="font-ui text-xl font-bold mb-3"
                style={{
                  color: barPackage === i ? accent : "rgba(255,255,255,0.7)",
                  letterSpacing: "0.15em",
                }}
              >
                {pkg.name}
              </div>
              <div
                className="font-body text-base mb-6"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.5,
                }}
              >
                {pkg.desc}
              </div>
              <div
                className="font-editorial text-4xl"
                style={{ color: barPackage === i ? accent : "rgba(255,255,255,0.5)" }}
              >
                ${pkg.per}<span className="text-lg opacity-60 ml-1">/pp</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div
        className="space-y-4 mb-12 p-8"
        style={{
          background: "rgba(0,0,0,0.4)",
          borderRadius: "4px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {[
          { label: "Venue Infrastructure", val: venueFee },
          { label: `Catering: ${CATERING_TIERS[cateringTier].name}`, val: cateringCost },
          { label: `Beverage: ${BAR_PACKAGES[barPackage].name}`, val: barCost },
          { label: "Floral & Design Credit (est.)", val: florals },
        ].map(({ label, val }) => (
          <div key={label} className="flex justify-between items-center">
            <span
              className="font-ui text-lg"
              style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}
            >
              {label}
            </span>
            <span
              className="font-editorial text-3xl"
              style={{ color: "rgba(255,255,255,0.95)", letterSpacing: "0.02em" }}
            >
              $<AnimatedNumber value={val} />
            </span>
          </div>
        ))}
        <div
          style={{
            height: "1px",
            background: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.3)`,
            margin: "12px 0",
          }}
        />
        <div className="flex justify-between items-center pt-2">
          <span
            className="font-ui text-xl font-bold"
            style={{ color: accent, letterSpacing: "0.3em" }}
          >
            TOTAL ESTIMATED INVESTMENT
          </span>
          <span
            className="font-editorial text-5xl"
            style={{ color: accent, letterSpacing: "0.02em" }}
          >
            $<AnimatedNumber value={total} />
          </span>
        </div>
      </div>

      {/* CTA */}
      {!isCheckout && !isSuccess ? (
        <button
          onClick={() => setIsCheckout(true)}
          className="cursor-trigger w-full py-6 text-center transition-all hover:bg-white/5"
          style={{
            border: `1.5px solid ${accent}`,
            color: accent,
            borderRadius: "2px",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <span
            className="font-ui text-base tracking-[0.4em] font-bold"
          >
            RESERVE THE DATE
          </span>
        </button>
      ) : isSuccess ? (
        <div className="py-10 text-center" style={{ border: `1.5px solid ${accentDim}`, borderRadius: "4px", background: "rgba(255,255,255,0.02)" }}>
          <div className="font-editorial text-4xl mb-4" style={{ color: accent }}>Inquiry Received.</div>
          <div className="font-ui text-sm" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em" }}>WE WILL REACH OUT TO {name.toUpperCase()} SHORTLY.</div>
        </div>
      ) : (
        <div className="space-y-6 p-10" style={{ background: "rgba(0,0,0,0.5)", borderRadius: "4px", border: `1px solid ${accentDim}` }}>
          <div className="flex flex-col md:flex-row gap-6">
            <input
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b outline-none font-ui text-base py-3"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "0.1em"
              }}
            />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b outline-none font-ui text-base py-3"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "0.1em"
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !name || !email}
            className="cursor-trigger w-full py-5 mt-6 text-center transition-all"
            style={{
              background: accent,
              color: venue === "rustic" ? "#000" : "#fff",
              borderRadius: "2px",
              cursor: isSubmitting || !name || !email ? "not-allowed" : "pointer",
              opacity: isSubmitting || !name || !email ? 0.4 : 1
            }}
          >
            <span
              className="font-ui text-base tracking-[0.3em] font-black"
            >
              {isSubmitting ? "PROCESSING..." : "GET DETAILED CATALOGUE"}
            </span>
          </button>
        </div>
      )}
      <p
        className="font-ui text-xs text-center mt-6"
        style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", letterSpacing: "0.05em" }}
      >
        * Our pricing is fully transparent. All service fees and taxes included in this estimate.
      </p>
    </div>
  );
}

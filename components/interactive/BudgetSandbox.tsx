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
      className="glass-card p-8 md:p-12"
      style={{
        background:
          venue === "rustic"
            ? "rgba(28,18,9,0.8)"
            : "rgba(13,10,14,0.85)",
        border: `1px solid ${accentDim}`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Total Display */}
      <div className="text-center mb-12">
        <div
          className="font-ui text-xs mb-2"
          style={{
            color: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.5)`,
            letterSpacing: "0.4em",
          }}
        >
          ESTIMATED INVESTMENT
        </div>
        <div
          className="font-editorial"
          style={{
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            color: accent,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          $<AnimatedNumber value={total} />
        </div>
        <div
          className="font-ui text-sm mt-2"
          style={{
            color: `rgba(${venue === "rustic" ? "212,184,150" : "201,168,76"},0.5)`,
            letterSpacing: "0.15em",
          }}
        >
          ${perGuest.toLocaleString()} per guest · {guests} guests
        </div>
      </div>

      {/* Guest Slider */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <label
            className="font-ui text-xs tracking-widest"
            style={{ color: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.7)` }}
          >
            GUEST COUNT
          </label>
          <span
            className="font-editorial text-2xl"
            style={{ color: accent }}
          >
            {guests}
          </span>
        </div>
        <input
          type="range"
          min={20}
          max={350}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="budget-slider w-full"
          style={{ ...sliderStyle(guests, 20, 350), cursor: "pointer" }}
        />
        <div className="flex justify-between mt-1">
          <span className="font-ui" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em" }}>20</span>
          <span className="font-ui" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em" }}>350</span>
        </div>
      </div>

      {/* Catering Tier */}
      <div className="mb-10">
        <div
          className="font-ui text-xs tracking-widest mb-4"
          style={{ color: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.7)` }}
        >
          CATERING TIER
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {CATERING_TIERS.map((tier, i) => (
            <button
              key={tier.name}
              onClick={() => setCateringTier(i)}
              className="cursor-trigger text-left p-4 transition-all duration-300"
              style={{
                border: `1px solid ${cateringTier === i ? accent : "rgba(255,255,255,0.08)"}`,
                borderRadius: "4px",
                background:
                  cateringTier === i
                    ? `${accentDim}`
                    : "rgba(255,255,255,0.02)",
                cursor: "pointer",
              }}
            >
              <div
                className="font-ui text-xs font-medium mb-1"
                style={{
                  color: cateringTier === i ? accent : "rgba(255,255,255,0.6)",
                  letterSpacing: "0.1em",
                }}
              >
                {tier.name}
              </div>
              <div
                className="font-body text-xs"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.8rem",
                  maxWidth: "none",
                }}
              >
                {tier.desc}
              </div>
              <div
                className="font-editorial text-lg mt-2"
                style={{ color: cateringTier === i ? accent : "rgba(255,255,255,0.4)" }}
              >
                ${tier.multiplier}/pp
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bar Package */}
      <div className="mb-10">
        <div
          className="font-ui text-xs tracking-widest mb-4"
          style={{ color: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.7)` }}
        >
          BAR PACKAGE
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {BAR_PACKAGES.map((pkg, i) => (
            <button
              key={pkg.name}
              onClick={() => setBarPackage(i)}
              className="cursor-trigger text-left p-4 transition-all duration-300"
              style={{
                border: `1px solid ${barPackage === i ? accent : "rgba(255,255,255,0.08)"}`,
                borderRadius: "4px",
                background:
                  barPackage === i ? accentDim : "rgba(255,255,255,0.02)",
                cursor: "pointer",
              }}
            >
              <div
                className="font-ui text-xs font-medium mb-1"
                style={{
                  color: barPackage === i ? accent : "rgba(255,255,255,0.6)",
                  letterSpacing: "0.1em",
                }}
              >
                {pkg.name}
              </div>
              <div
                className="font-body"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.8rem",
                  maxWidth: "none",
                }}
              >
                {pkg.desc}
              </div>
              <div
                className="font-editorial text-lg mt-2"
                style={{ color: barPackage === i ? accent : "rgba(255,255,255,0.4)" }}
              >
                ${pkg.per}/pp
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div
        className="space-y-3 mb-8 p-6"
        style={{
          background: "rgba(0,0,0,0.3)",
          borderRadius: "4px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {[
          { label: "Venue Fee", val: venueFee },
          { label: `Catering (${CATERING_TIERS[cateringTier].name})`, val: cateringCost },
          { label: `Bar (${BAR_PACKAGES[barPackage].name})`, val: barCost },
          { label: "Florals & Décor (est.)", val: florals },
        ].map(({ label, val }) => (
          <div key={label} className="flex justify-between">
            <span
              className="font-ui text-xs"
              style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}
            >
              {label}
            </span>
            <span
              className="font-editorial"
              style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}
            >
              $<AnimatedNumber value={val} />
            </span>
          </div>
        ))}
        <div
          style={{
            height: "1px",
            background: `rgba(${venue === "rustic" ? "196,146,42" : "212,160,23"},0.2)`,
            margin: "8px 0",
          }}
        />
        <div className="flex justify-between">
          <span
            className="font-ui text-xs font-semibold"
            style={{ color: accent, letterSpacing: "0.15em" }}
          >
            TOTAL ESTIMATE
          </span>
          <span
            className="font-editorial text-xl"
            style={{ color: accent }}
          >
            $<AnimatedNumber value={total} />
          </span>
        </div>
      </div>

      {/* CTA */}
      {!isCheckout && !isSuccess ? (
        <button
          onClick={() => setIsCheckout(true)}
          className="cursor-trigger w-full py-4 btn-primary text-center"
          style={{
            borderColor: accent,
            color: accent,
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          <span
            className="font-ui text-sm tracking-widest"
            style={{ letterSpacing: "0.2em" }}
          >
            GET MY CUSTOM PROPOSAL
          </span>
        </button>
      ) : isSuccess ? (
        <div className="py-6 text-center" style={{ border: `1px solid ${accentDim}`, borderRadius: "4px" }}>
          <div className="font-editorial text-2xl mb-2" style={{ color: accent }}>Proposal Requested</div>
          <div className="font-ui text-xs" style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>WE&apos;LL CONTACT {name.toUpperCase()} SHORTLY</div>
        </div>
      ) : (
        <div className="space-y-4 p-6" style={{ background: "rgba(0,0,0,0.4)", borderRadius: "4px", border: `1px solid ${accentDim}` }}>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b outline-none font-ui text-sm"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.9)",
                padding: "8px 0"
              }}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b outline-none font-ui text-sm"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.9)",
                padding: "8px 0"
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !name || !email}
            className="cursor-trigger w-full py-3 mt-4 text-center transition-opacity"
            style={{
              background: accent,
              color: venue === "rustic" ? "#000" : "#fff",
              borderRadius: "2px",
              cursor: isSubmitting || !name || !email ? "not-allowed" : "pointer",
              opacity: isSubmitting || !name || !email ? 0.5 : 1
            }}
          >
            <span
              className="font-ui text-sm tracking-widest font-bold"
              style={{ letterSpacing: "0.2em" }}
            >
              {isSubmitting ? "SENDING..." : "SEND PROPOSAL"}
            </span>
          </button>
        </div>
      )}
      <p
        className="font-ui text-xs text-center mt-3"
        style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}
      >
        * Estimates are illustrative. A detailed, itemized proposal is sent within 24 hours of your inquiry.
      </p>
    </div>
  );
}

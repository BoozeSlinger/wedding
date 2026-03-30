"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  venue: "rustic" | "speakeasy";
}

interface Message {
  role: "bot" | "user";
  text: string;
}

const RUSTIC_FLOW = [
  {
    question: "Let's start with the feeling. What does your ideal wedding day look like?",
    options: [
      "Wildflower bohemian — barefoot, golden, and completely free",
      "Elevated country — cowboy boots and black tie that belong together",
      "Rugged ranch romance — fire pits, fairy lights, and stars above",
      "Honestly? I'm still figuring that out",
    ],
  },
  {
    question: "How many people do you want celebrating with you?",
    options: [
      "Under 50 — intimate and intentional, the people who matter most",
      "50–100 — close circle, big energy",
      "100–200 — the whole crew, a proper party",
      "200+ — the full Last Call experience, everyone's invited",
    ],
  },
  {
    question: "What's the bar situation?",
    options: [
      "Craft beer and Texas wine — keep it local",
      "Signature cocktails only — something they'll remember",
      "Open bar, top shelf — absolutely no limits tonight",
      "Dry wedding (phenomenal mocktails, we promise)",
    ],
  },
  {
    question: "When's the big day?",
    options: [
      "Spring 2026 — wildflowers in full bloom",
      "Summer 2026 — golden hour that never ends",
      "Fall 2026 — the most beautiful light of the year",
      "2027 & beyond — we believe in planning ahead",
    ],
  },
];

const SPEAKEASY_FLOW = [
  {
    question: "What feeling do you want your guests to have the moment they walk in?",
    options: [
      "Transported — like stepping into another era entirely",
      "Glamorous and cinematic — old Hollywood magic, new city energy",
      "Warm and intimate — jazz, velvet, and conversations that last all night",
      "Theatrically unforgettable — an experience no one saw coming",
    ],
  },
  {
    question: "How many guests will be joining you in The Vault?",
    options: [
      "Under 40 — curated, exclusive, exactly the way we like it",
      "40–80 — the inner circle, full-evening takeover",
      "80–150 — a real event, every corner alive",
      "150–200 — maximum atmosphere, every seat filled",
    ],
  },
  {
    question: "Tell us about your bar program.",
    options: [
      "Prohibition-era cocktails — rye, bitters, and a century of history",
      "Champagne tower ceremony, curated wine list for dinner",
      "Fully custom cocktail menu, built just for us with your mixologist",
      "Surprise us — we trust the bar completely",
    ],
  },
  {
    question: "When do you want your legend to begin?",
    options: [
      "Spring 2026 — the city wakes up and so do we",
      "Summer 2026 — late nights, heat, and unforgettable evenings",
      "Fall 2026 — the golden season, the best light",
      "2027 & beyond — great things take time to plan",
    ],
  },
];

export default function ConciergeChatWidget({ venue }: Props) {
  const accent = venue === "rustic" ? "var(--rustic-primary)" : "var(--speak-amber)";
  const accentRGB = venue === "rustic" ? "196,146,42" : "212,160,23";
  const flow = venue === "rustic" ? RUSTIC_FLOW : SPEAKEASY_FLOW;

  const [step, setStep] = useState(-1); // -1 = not started
  const [messages, setMessages] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const addBotMessage = (text: string) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: "bot", text }]);
        resolve();
      }, 900 + Math.random() * 400);
    });
  };

  const handleStart = async () => {
    setStep(0);
    await addBotMessage(
      `Welcome. I'm your personal Last Call concierge — here to help you figure out if this is the one. Let's make this easy. ${flow[0].question}`
    );
  };

  const handleOption = async (option: string) => {
    setMessages((prev) => [...prev, { role: "user", text: option }]);
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    const nextStep = step + 1;

    if (nextStep < flow.length) {
      setStep(nextStep);
      await addBotMessage(flow[nextStep].question);
    } else {
      setStep(flow.length);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: `Perfect. Based on what you've told me, I have everything I need to put together a tailored proposal for your exact date and vision. To send it directly to you, I just need a name and an email.`,
          },
        ]);
        setIsDone(true);
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    if (!nameInput || !emailInput) return;
    setSubmitted(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `${nameInput} · ${emailInput}` },
    ]);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "concierge",
          venue,
          name: nameInput,
          email: emailInput,
          details: { preferences: answers },
        }),
      });
    } catch (err) {
      console.error("Failed to submit lead", err);
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `You're in good hands, ${nameInput.split(" ")[0]}. Your personalized proposal is being prepared now — we'll have something beautiful in your inbox within 24 hours. No spam, just your dream day on paper. 🥂`,
        },
      ]);
    }, 1000);
  };

  const currentOptions = step >= 0 && step < flow.length && !isDone ? flow[step].options : [];

  return (
    <div
      className="glass-card overflow-hidden"
      style={{
        background: venue === "rustic" ? "rgba(28,18,9,0.9)" : "rgba(13,10,14,0.92)",
        border: `1px solid rgba(${accentRGB},0.15)`,
        borderRadius: "8px",
      }}
    >
      {/* Chat header */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{
          borderBottom: `1px solid rgba(${accentRGB},0.1)`,
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${accentRGB},0.4) 0%, rgba(${accentRGB},0.1) 100%)`,
            border: `1px solid rgba(${accentRGB},0.3)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={accent}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div>
          <div
            className="font-ui text-xs font-medium"
            style={{ color: accent, letterSpacing: "0.1em" }}
          >
            LAST CALL CONCIERGE
          </div>
          <div
            className="font-ui"
            style={{ fontSize: "0.65rem", color: `rgba(${accentRGB},0.4)`, letterSpacing: "0.15em" }}
          >
            {step === -1 ? "READY TO HELP" : step >= flow.length ? "PROPOSAL IN PROGRESS" : `STEP ${step + 1} OF ${flow.length}`}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: i <= step ? accent : `rgba(${accentRGB},0.2)`,
                transition: "background 0.4s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div
        className="p-6 space-y-4 overflow-y-auto"
        style={{ minHeight: "300px", maxHeight: "400px" }}
      >
        {step === -1 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div
              className="font-display mb-3"
              style={{ fontSize: "2rem", color: accent }}
            >
              {venue === "rustic" ? "Your Day Starts Here." : "The Vault Is Ready For You."}
            </div>
            <p
              className="font-body text-sm mb-8"
              style={{ color: `rgba(${accentRGB},0.5)`, maxWidth: "35ch", fontStyle: "italic" }}
            >
              {venue === "rustic"
                ? "Answer a few quick questions and we'll send you a custom proposal. No commitment, no pressure."
                : "Tell us about your vision. We'll build a bespoke evening around it — and send the details straight to you."}
            </p>
            <button
              onClick={handleStart}
              className="cursor-trigger"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.8rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "14px 40px",
                border: `1px solid ${accent}`,
                color: accent,
                background: "transparent",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = `rgba(${accentRGB},0.12)`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              Start My Proposal
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: msg.role === "bot" ? "2px 14px 14px 14px" : "14px 2px 14px 14px",
                    background:
                      msg.role === "bot"
                        ? "rgba(255,255,255,0.05)"
                        : `rgba(${accentRGB},0.15)`,
                    border:
                      msg.role === "bot"
                        ? "1px solid rgba(255,255,255,0.06)"
                        : `1px solid rgba(${accentRGB},0.3)`,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    color:
                      msg.role === "bot"
                        ? "rgba(245,240,232,0.85)"
                        : accent,
                    lineHeight: 1.6,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div
                  style={{
                    padding: "12px 18px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "2px 14px 14px 14px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: accent,
                        animation: `ember-pulse 1.2s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Options / Input area */}
      {step >= 0 && (
        <div
          className="p-6 pt-4"
          style={{ borderTop: `1px solid rgba(${accentRGB},0.08)` }}
        >
          {!isDone && currentOptions.length > 0 && !isTyping && (
            <div className="grid gap-2">
              {currentOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOption(opt)}
                  className="cursor-trigger text-left px-4 py-3 transition-all duration-250"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid rgba(${accentRGB},0.15)`,
                    borderRadius: "4px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    color: "rgba(245,240,232,0.7)",
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: 1.5,
                    maxWidth: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = accent;
                    el.style.color = "rgba(245,240,232,0.95)";
                    el.style.background = `rgba(${accentRGB},0.06)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `rgba(${accentRGB},0.15)`;
                    el.style.color = "rgba(245,240,232,0.7)";
                    el.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {isDone && !submitted && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your full name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid rgba(${accentRGB},0.2)`,
                  borderRadius: "4px",
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.9rem",
                  color: "rgba(245,240,232,0.9)",
                  outline: "none",
                }}
              />
              <input
                type="email"
                placeholder="Your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid rgba(${accentRGB},0.2)`,
                  borderRadius: "4px",
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.9rem",
                  color: "rgba(245,240,232,0.9)",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!nameInput || !emailInput}
                className="cursor-trigger w-full py-3"
                style={{
                  background: nameInput && emailInput ? accent : "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "4px",
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: nameInput && emailInput ? "var(--color-obsidian)" : "rgba(255,255,255,0.3)",
                  cursor: nameInput && emailInput ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  fontWeight: 600,
                }}
              >
                Send My Proposal →
              </button>
            </div>
          )}

          {submitted && (
            <div
              className="text-center py-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                color: accent,
              }}
            >
              You&apos;re all set. We&apos;ll be in touch within 24 hours. ✓
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const TYPEWRITER_PHRASES = [
  "Answer every call, 24/7.",
  "Never miss a booking again.",
  "Your AI front desk is ready.",
  "Guests served. Revenue recovered.",
];

function TypewriterText() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIdx];
    if (!deleting && displayed.length < phrase.length) {
      timeout.current = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === phrase.length) {
      timeout.current = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % TYPEWRITER_PHRASES.length);
    }
    return () => clearTimeout(timeout.current);
  }, [displayed, deleting, phraseIdx]);

  return (
    <span className="text-amber-400">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

const CALL_DEMO_MESSAGES = [
  { from: "caller", text: "Hi, I'd like to book a room for this weekend — two nights." },
  { from: "ai", text: "Of course! Welcome to The Arbor House. I'd love to help. Are you thinking of arriving this Friday?" },
  { from: "caller", text: "Yes, Friday to Sunday. For two people." },
  { from: "ai", text: "Perfect. Our Garden Suite is available — king bed, private balcony, complimentary breakfast. It's $289/night. Shall I send you a secure booking link via text?" },
  { from: "caller", text: "That sounds amazing, yes please!" },
  { from: "ai", text: "Done! I've sent a link to your number. Your dates are held for 30 minutes. Is there anything else I can help you with?" },
];

function CallDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);

  const startDemo = () => {
    setVisibleCount(0);
    setActive(true);
  };

  useEffect(() => {
    if (active && visibleCount < CALL_DEMO_MESSAGES.length) {
      timerRef.current = setTimeout(() => setVisibleCount((c) => c + 1), visibleCount === 0 ? 400 : 1500);
    } else if (visibleCount === CALL_DEMO_MESSAGES.length) {
      setActive(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [active, visibleCount]);

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-700 overflow-hidden shadow-2xl max-w-md w-full">
      <div className="bg-stone-800 px-4 py-3 flex items-center gap-3 border-b border-stone-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-stone-300 text-xs font-medium">Live Call — The Arbor House</span>
        </div>
        <span className="ml-auto text-stone-500 text-xs">AI Receptionist</span>
      </div>
      <div className="p-5 space-y-3 min-h-[280px]">
        {CALL_DEMO_MESSAGES.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "ai" ? "justify-start" : "justify-end"} animate-fade-in`}
          >
            {msg.from === "ai" && (
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">A</span>
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                msg.from === "ai"
                  ? "bg-stone-700 text-stone-100 rounded-tl-sm"
                  : "bg-amber-500 text-white rounded-tr-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {visibleCount === CALL_DEMO_MESSAGES.length && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-green-400 text-xs">✓ Booking link sent via SMS</span>
          </div>
        )}
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={startDemo}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold transition-colors duration-200"
        >
          {active ? "Playing demo..." : visibleCount > 0 ? "▶ Replay Demo" : "▶ Play Live Demo"}
        </button>
      </div>
    </div>
  );
}

const STATS = [
  { value: "94%", label: "of calls answered" },
  { value: "3.2×", label: "more bookings captured" },
  { value: "$0", label: "additional staff cost" },
  { value: "24/7", label: "always on duty" },
];

const FEATURES = [
  {
    icon: "📞",
    title: "Answers Every Call",
    desc: "Never let a booking opportunity ring out. Your AI receptionist picks up in seconds, day or night, even during peak hours.",
  },
  {
    icon: "🗓️",
    title: "Captures Reservations",
    desc: "Collects arrival dates, room preferences, and guest details — then sends a secure booking link via SMS, instantly.",
  },
  {
    icon: "🧠",
    title: "Knows Your Hotel",
    desc: "Train the AI on your policies, menus, pricing, and FAQs. It answers accurately, with the warmth of a seasoned concierge.",
  },
  {
    icon: "🌐",
    title: "Multilingual by Default",
    desc: "Serve guests in English, Spanish, French, and more — automatically detecting the caller's language.",
  },
  {
    icon: "🔁",
    title: "Smart Escalation",
    desc: "When things get complex or emotional, the AI smoothly transfers to your team — no dead ends, no frustrated guests.",
  },
  {
    icon: "📊",
    title: "Call Intelligence",
    desc: "Every conversation is transcribed, summarized, and analyzed. Know your missed opportunities before you lose them.",
  },
];

const TESTIMONIALS = [
  {
    name: "Elena Marsh",
    role: "Owner, The Cliffside Inn",
    photo: "EM",
    color: "bg-rose-500",
    text: "We were losing at least 4–5 bookings a week after hours. StayFlow AI recovered $12,000 in revenue in our first month. It's the best thing I've added to this property.",
  },
  {
    name: "Marcus Reid",
    role: "GM, Latitude Boutique Hotel",
    photo: "MR",
    color: "bg-blue-500",
    text: "The AI handles 80% of our inbound calls without any staff involvement. Our front desk team is finally focused on the guests in front of them.",
  },
  {
    name: "Priya Nair",
    role: "Operations, The Palmwood Collection",
    photo: "PN",
    color: "bg-emerald-500",
    text: "Multilingual support was the game-changer for us. We serve a lot of international guests and the AI handles Spanish and French calls flawlessly.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$149",
    period: "/mo",
    description: "Perfect for small independents",
    features: [
      "200 AI minutes/month",
      "1 phone number",
      "FAQ & booking capture",
      "SMS follow-up",
      "Call transcripts",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$349",
    period: "/mo",
    description: "For serious boutique hotels",
    features: [
      "500 AI minutes/month",
      "3 phone numbers",
      "Knowledge base (RAG)",
      "Multilingual AI",
      "Live transfer",
      "Analytics dashboard",
      "Slack/SMS alerts",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Multi-Property",
    price: "$799",
    period: "/mo",
    description: "For hotel groups & portfolios",
    features: [
      "Unlimited AI minutes",
      "Unlimited properties",
      "Custom AI voice/persona",
      "PMS integrations",
      "Dedicated account manager",
      "SLA & uptime guarantee",
      "White-label option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function LandingPage() {
  const [roiRooms, setRoiRooms] = useState(20);
  const [roiRate, setRoiRate] = useState(180);
  const roiRecovery = Math.round(roiRooms * 0.18 * roiRate * 12);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">StayFlow <span className="text-amber-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-stone-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-stone-400 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                Now in beta — join 40+ independent hotels
              </div>
              <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4 text-white">
                Never Miss Another<br />Hotel Booking Call
              </h1>
              <div className="text-2xl font-medium mb-6 h-9">
                <TypewriterText />
              </div>
              <p className="text-stone-400 text-lg leading-relaxed mb-8 max-w-lg">
                StayFlow AI is your 24/7 AI front desk. It answers calls, handles FAQs, captures reservations, and sends booking links — all without hiring an extra receptionist.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  to="/dashboard"
                  className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 text-center"
                >
                  Start Free Trial →
                </Link>
                <button
                  onClick={() => document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold px-8 py-4 rounded-xl text-base transition-colors duration-200"
                >
                  ▶ Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <span>✓ No credit card required</span>
                <span className="text-stone-700">·</span>
                <span>✓ 14-day free trial</span>
                <span className="text-stone-700">·</span>
                <span>✓ Cancel anytime</span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end" id="demo-section">
              <CallDemo />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-stone-800 bg-stone-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-amber-400 mb-1">{s.value}</div>
                <div className="text-stone-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Everything your front desk needs</h2>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">
              Purpose-built for independent and boutique hotels — not a generic chatbot.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/40 hover:bg-stone-900/80 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="py-20 px-6 bg-stone-900/40 border-y border-stone-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3">Calculate your revenue recovery</h2>
          <p className="text-stone-400 mb-10">Missed calls cost hotels more than they realize. Here's your potential.</p>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="text-stone-300 text-sm font-medium block mb-3">
                  Avg. rooms available: <span className="text-amber-400 font-bold">{roiRooms}</span>
                </label>
                <input
                  type="range" min="5" max="100" value={roiRooms}
                  onChange={(e) => setRoiRooms(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
              <div>
                <label className="text-stone-300 text-sm font-medium block mb-3">
                  Avg. nightly rate: <span className="text-amber-400 font-bold">${roiRate}</span>
                </label>
                <input
                  type="range" min="80" max="500" step="10" value={roiRate}
                  onChange={(e) => setRoiRate(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
              <p className="text-stone-300 text-sm mb-1">Estimated annual revenue recovery</p>
              <p className="text-5xl font-black text-amber-400">${roiRecovery.toLocaleString()}</p>
              <p className="text-stone-500 text-xs mt-2">Based on ~18% of calls being after-hours booking inquiries</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-white text-center mb-4">Loved by hoteliers</h2>
          <p className="text-stone-400 text-center mb-14">Real results from independent hotel owners and GMs.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <p className="text-stone-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">{t.photo}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-stone-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-stone-900/30 border-t border-stone-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">Simple, usage-based pricing</h2>
            <p className="text-stone-400">Start free. Pay as you grow. No long-term contracts.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-7 ${
                  p.highlighted
                    ? "bg-amber-500 text-white border-2 border-amber-400 scale-105"
                    : "bg-stone-900 border border-stone-800 text-stone-100"
                }`}
              >
                {p.highlighted && (
                  <div className="text-xs font-bold bg-white/20 inline-block px-2 py-0.5 rounded-full mb-3">
                    MOST POPULAR
                  </div>
                )}
                <div className={`text-lg font-bold mb-1 ${p.highlighted ? "text-white" : "text-white"}`}>{p.name}</div>
                <div className={`text-sm mb-4 ${p.highlighted ? "text-amber-100" : "text-stone-400"}`}>{p.description}</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black">{p.price}</span>
                  <span className={`text-sm mb-1 ${p.highlighted ? "text-amber-100" : "text-stone-400"}`}>{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className={`text-sm flex items-start gap-2 ${p.highlighted ? "text-white" : "text-stone-300"}`}>
                      <span className="mt-0.5 flex-shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/dashboard"
                  className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-colors duration-200 ${
                    p.highlighted
                      ? "bg-white text-amber-600 hover:bg-amber-50"
                      : "bg-stone-800 hover:bg-stone-700 text-white"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Your guests are calling.<br />
            <span className="text-amber-400">Is anyone answering?</span>
          </h2>
          <p className="text-stone-400 mb-8 text-lg">
            Join hundreds of independent hotels already using StayFlow AI to recover lost revenue and delight guests at every hour.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors duration-200"
          >
            Start Your Free Trial Today →
          </Link>
          <p className="text-stone-600 text-xs mt-4">No credit card required · Setup in under 10 minutes</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
            <span className="font-bold text-stone-300">StayFlow AI</span>
          </div>
          <p className="text-stone-600 text-sm">© 2026 StayFlow AI. All rights reserved.</p>
          <div className="flex gap-6 text-stone-500 text-sm">
            <a href="#" className="hover:text-stone-300">Privacy</a>
            <a href="#" className="hover:text-stone-300">Terms</a>
            <a href="#" className="hover:text-stone-300">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

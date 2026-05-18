import { useState, useEffect } from "react";
import { Hotel } from "@/api/entities";

const VOICES = [
  { id: "nova", label: "Nova", desc: "Warm, friendly feminine voice", emoji: "🌟" },
  { id: "alloy", label: "Alloy", desc: "Balanced, neutral & professional", emoji: "⚡" },
  { id: "shimmer", label: "Shimmer", desc: "Soft, calm & reassuring", emoji: "✨" },
  { id: "echo", label: "Echo", desc: "Clear, articulate & confident", emoji: "🔊" },
  { id: "fable", label: "Fable", desc: "Storytelling, expressive & warm", emoji: "📖" },
  { id: "onyx", label: "Onyx", desc: "Deep, authoritative & professional", emoji: "💎" },
];

const TONES = [
  { id: "warm", label: "Warm & Friendly", desc: "Approachable, conversational, caring", color: "text-amber-400" },
  { id: "professional", label: "Professional", desc: "Formal, precise, business-focused", color: "text-blue-400" },
  { id: "casual", label: "Casual & Relaxed", desc: "Easygoing, natural, modern", color: "text-green-400" },
  { id: "luxury", label: "Luxury Concierge", desc: "Refined, elegant, bespoke", color: "text-purple-400" },
];

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷" },
  { code: "zh", label: "Mandarin", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ar", label: "Arabic", flag: "🇦🇪" },
];

function Section({ title, description, children }) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-5">
      <div className="mb-5">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        {description && <p className="text-stone-400 text-sm mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange, label, desc }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-stone-200 text-sm font-medium">{label}</div>
        {desc && <div className="text-stone-500 text-xs mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-amber-500" : "bg-stone-700"}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function AIConfig() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [voice, setVoice] = useState("nova");
  const [tone, setTone] = useState("warm");
  const [greeting, setGreeting] = useState("");
  const [hoursStart, setHoursStart] = useState("08:00");
  const [hoursEnd, setHoursEnd] = useState("22:00");
  const [langs, setLangs] = useState(["en"]);
  const [escalationPhone, setEscalationPhone] = useState("");
  const [escalationEmail, setEscalationEmail] = useState("");
  const [afterHours, setAfterHours] = useState(true);
  const [callRecording, setCallRecording] = useState(true);
  const [smsFollowUp, setSmsFollowUp] = useState(true);
  const [upsellEnabled, setUpsellEnabled] = useState(false);
  const [reviewCollection, setReviewCollection] = useState(false);

  useEffect(() => {
    Hotel.list().then((hotels) => {
      if (hotels.length > 0) {
        const h = hotels[0];
        setHotel(h);
        setVoice(h.ai_voice || "nova");
        setTone(h.ai_tone || "warm");
        setGreeting(h.greeting_message || "Thank you for calling. How may I assist you?");
        setHoursStart(h.business_hours_start || "08:00");
        setHoursEnd(h.business_hours_end || "22:00");
        setLangs(h.languages || ["en"]);
        setEscalationPhone(h.escalation_phone || "");
        setEscalationEmail(h.escalation_email || "");
      }
    }).finally(() => setLoading(false));
  }, []);

  const toggleLang = (code) => {
    setLangs((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (hotel) {
        await Hotel.update(hotel.id, {
          ai_voice: voice,
          ai_tone: tone,
          greeting_message: greeting,
          business_hours_start: hoursStart,
          business_hours_end: hoursEnd,
          languages: langs,
          escalation_phone: escalationPhone,
          escalation_email: escalationEmail,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const previewGreeting = greeting.replace("{hotel_name}", hotel?.name || "your hotel");

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-400">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          Loading AI configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">AI Configuration</h1>
            <p className="text-stone-400">Customize your AI receptionist's voice, personality, and behavior.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              saved
                ? "bg-green-500 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-white"
            }`}
          >
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Voice Preview */}
        <div className="bg-gradient-to-r from-amber-500/10 to-stone-900 border border-amber-500/30 rounded-2xl p-5 mb-6">
          <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-2">Live Preview</p>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div className="bg-stone-800 rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
              <p className="text-stone-200 text-sm italic">"{previewGreeting}"</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 pl-12 text-xs text-stone-500">
            <span>Voice: <span className="text-amber-400 font-medium capitalize">{voice}</span></span>
            <span>·</span>
            <span>Tone: <span className="text-amber-400 font-medium capitalize">{tone}</span></span>
            <span>·</span>
            <span>Languages: <span className="text-amber-400 font-medium">{langs.length}</span></span>
          </div>
        </div>

        {/* Voice Selection */}
        <Section title="AI Voice" description="Choose the voice that best represents your hotel's personality.">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VOICES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVoice(v.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  voice === v.id
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-stone-700 bg-stone-800/50 hover:border-stone-600"
                }`}
              >
                <div className="text-xl mb-2">{v.emoji}</div>
                <div className={`font-bold text-sm ${voice === v.id ? "text-amber-400" : "text-white"}`}>{v.label}</div>
                <div className="text-stone-400 text-xs mt-0.5">{v.desc}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Tone */}
        <Section title="Personality Tone" description="How should your AI receptionist speak and engage with guests?">
          <div className="grid grid-cols-2 gap-3">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  tone === t.id
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-stone-700 bg-stone-800/50 hover:border-stone-600"
                }`}
              >
                <div className={`font-bold text-sm mb-1 ${tone === t.id ? "text-amber-400" : "text-white"}`}>{t.label}</div>
                <div className="text-stone-400 text-xs">{t.desc}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Greeting */}
        <Section title="Greeting Message" description="The first thing guests hear when they call. Use {hotel_name} as a placeholder.">
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            rows={3}
            className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-3 rounded-xl outline-none focus:border-amber-500/50 resize-none transition-colors"
            placeholder="Thank you for calling {hotel_name}. How may I assist you today?"
          />
          <p className="text-stone-500 text-xs mt-2">
            Characters: {greeting.length} · Recommended: 10–30 words for natural cadence
          </p>
        </Section>

        {/* Business Hours */}
        <Section title="Business Hours" description="The AI operates 24/7 but can flag after-hours calls specially.">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-stone-400 text-xs font-medium block mb-2">Opening Time</label>
              <input
                type="time"
                value={hoursStart}
                onChange={(e) => setHoursStart(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="text-stone-400 text-xs font-medium block mb-2">Closing Time</label>
              <input
                type="time"
                value={hoursEnd}
                onChange={(e) => setHoursEnd(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
          <Toggle
            value={afterHours}
            onChange={setAfterHours}
            label="After-hours mode"
            desc="AI will mention that the front desk is closed but still assist fully"
          />
        </Section>

        {/* Languages */}
        <Section title="Supported Languages" description="The AI will automatically detect and respond in the caller's language.">
          <div className="grid grid-cols-4 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => l.code !== "en" && toggleLang(l.code)}
                className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                  langs.includes(l.code)
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-stone-700 bg-stone-800/50 hover:border-stone-600"
                } ${l.code === "en" ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="text-2xl mb-1">{l.flag}</div>
                <div className={`text-xs font-medium ${langs.includes(l.code) ? "text-amber-400" : "text-stone-300"}`}>{l.label}</div>
              </button>
            ))}
          </div>
          <p className="text-stone-500 text-xs mt-3">English is always active. Add languages based on your guest demographic.</p>
        </Section>

        {/* Escalation */}
        <Section title="Human Escalation" description="When should the AI transfer the call to a real person?">
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-stone-400 text-xs font-medium block mb-2">Escalation Phone Number</label>
              <input
                type="tel"
                value={escalationPhone}
                onChange={(e) => setEscalationPhone(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50"
                placeholder="+1-555-0100"
              />
            </div>
            <div>
              <label className="text-stone-400 text-xs font-medium block mb-2">Alert Email</label>
              <input
                type="email"
                value={escalationEmail}
                onChange={(e) => setEscalationEmail(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50"
                placeholder="frontdesk@yourhotel.com"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Toggle value={true} onChange={() => {}} label="Escalate on complaints" desc="Transfer immediately when negative sentiment is detected" />
            <Toggle value={true} onChange={() => {}} label="Escalate emergency requests" desc="Medical, fire, or security-related calls" />
            <Toggle value={false} onChange={() => {}} label="Escalate complex group bookings" desc="10+ rooms or event inquiries route to sales" />
          </div>
        </Section>

        {/* Features */}
        <Section title="Features & Automation" description="Control what the AI does automatically after calls.">
          <div className="space-y-4">
            <Toggle value={callRecording} onChange={setCallRecording} label="Call recording" desc="Store encrypted recordings for quality review (GDPR compliant)" />
            <Toggle value={smsFollowUp} onChange={setSmsFollowUp} label="SMS follow-up" desc="Automatically send booking links and confirmations after calls" />
            <Toggle value={upsellEnabled} onChange={setUpsellEnabled} label="AI upsell suggestions" desc="Proactively mention room upgrades, spa, and dining to callers" />
            <Toggle value={reviewCollection} onChange={setReviewCollection} label="Post-stay review collection" desc="Send review request SMS 24hrs after checkout" />
          </div>
        </Section>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
              saved
                ? "bg-green-500 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-white"
            }`}
          >
            {saving ? "Saving..." : saved ? "✓ Configuration Saved!" : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

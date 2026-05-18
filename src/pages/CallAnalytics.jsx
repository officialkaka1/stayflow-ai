import { useState, useEffect } from "react";
import { Call } from "@/api/entities";

function TranscriptModal({ call, onClose }) {
  if (!call) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{call.caller_name || call.caller_number}</h3>
              <p className="text-stone-400 text-sm">{call.call_date ? new Date(call.call_date).toLocaleString() : "—"}</p>
            </div>
            <button onClick={onClose} className="text-stone-500 hover:text-white text-xl">✕</button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              call.status === "completed" ? "bg-green-500/10 text-green-400" :
              call.status === "missed" ? "bg-red-500/10 text-red-400" :
              call.status === "transferred" ? "bg-blue-500/10 text-blue-400" :
              "bg-stone-500/10 text-stone-400"
            }`}>{call.status}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">{call.intent?.replace(/_/g, " ")}</span>
            {call.language_detected && call.language_detected !== "en" && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">{call.language_detected?.toUpperCase()}</span>
            )}
          </div>
          {call.summary && (
            <div className="bg-stone-800/60 rounded-xl p-4 mb-4">
              <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-2">AI Summary</p>
              <p className="text-stone-200 text-sm leading-relaxed">{call.summary}</p>
            </div>
          )}
          {call.transcript && (
            <div>
              <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Transcript</p>
              <div className="space-y-2">
                {call.transcript.split("\n").filter(Boolean).map((line, i) => {
                  const isAI = line.startsWith("AI:");
                  const isCaller = line.startsWith("Caller:");
                  const text = line.replace(/^(AI:|Caller:)\s*/, "");
                  return (
                    <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
                      {isAI && (
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 text-xs font-bold text-white">A</div>
                      )}
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        isAI ? "bg-stone-800 text-stone-200 rounded-tl-sm" :
                        isCaller ? "bg-amber-500/20 text-amber-100 rounded-tr-sm" :
                        "text-stone-400 text-xs"
                      }`}>
                        {text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!call.transcript && !call.summary && (
            <p className="text-stone-500 text-sm text-center py-6">No transcript available for this call.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CallAnalytics() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedCall, setSelectedCall] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Call.list({ sort: "-call_date" }).then(setCalls).finally(() => setLoading(false));
  }, []);

  const filtered = calls.filter((c) => {
    const matchFilter =
      filter === "all" ||
      (filter === "bookings" && c.booking_captured) ||
      (filter === "missed" && c.missed_opportunity) ||
      (filter === "escalated" && c.escalated) ||
      (filter === "multilingual" && c.language_detected && c.language_detected !== "en");
    const matchSearch =
      !search ||
      c.caller_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.caller_number?.includes(search) ||
      c.summary?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const intentCounts = calls.reduce((acc, c) => {
    acc[c.intent] = (acc[c.intent] || 0) + 1;
    return acc;
  }, {});

  const sentimentCounts = calls.reduce((acc, c) => {
    acc[c.sentiment] = (acc[c.sentiment] || 0) + 1;
    return acc;
  }, {});

  const INTENT_LABELS = {
    booking_inquiry: "Booking Inquiry",
    faq: "FAQ",
    complaint: "Complaint",
    cancellation: "Cancellation",
    check_in: "Check-in",
    amenities: "Amenities",
    directions: "Directions",
    other: "Other",
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Call Analytics</h1>
          <p className="text-stone-400">Every conversation, transcribed and summarized by AI.</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Calls", value: calls.length, icon: "📞" },
            { label: "Bookings", value: calls.filter((c) => c.booking_captured).length, icon: "✅" },
            { label: "Missed Opps", value: calls.filter((c) => c.missed_opportunity).length, icon: "⚠" },
            { label: "Escalated", value: calls.filter((c) => c.escalated).length, icon: "↗" },
            { label: "Multilingual", value: calls.filter((c) => c.language_detected && c.language_detected !== "en").length, icon: "🌐" },
          ].map((s) => (
            <div key={s.label} className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-stone-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Intent breakdown */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Call Intent Breakdown</h3>
            <div className="space-y-2.5">
              {Object.entries(intentCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([intent, count]) => {
                  const pct = Math.round((count / calls.length) * 100);
                  const colors = {
                    booking_inquiry: "bg-amber-500",
                    faq: "bg-blue-500",
                    complaint: "bg-red-500",
                    check_in: "bg-purple-500",
                    amenities: "bg-teal-500",
                    other: "bg-stone-500",
                    cancellation: "bg-orange-500",
                  };
                  return (
                    <div key={intent}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-stone-400">{INTENT_LABELS[intent] || intent}</span>
                        <span className="text-white font-medium">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[intent] || "bg-stone-500"} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Sentiment */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Guest Sentiment</h3>
            <div className="flex items-center justify-center gap-6 py-4">
              {[
                { key: "positive", emoji: "😊", color: "text-green-400", bg: "bg-green-500/10" },
                { key: "neutral", emoji: "😐", color: "text-stone-400", bg: "bg-stone-700/40" },
                { key: "negative", emoji: "😟", color: "text-red-400", bg: "bg-red-500/10" },
              ].map((s) => (
                <div key={s.key} className={`${s.bg} rounded-2xl p-4 text-center min-w-[70px]`}>
                  <div className="text-3xl mb-1">{s.emoji}</div>
                  <div className={`text-xl font-black ${s.color}`}>{sentimentCounts[s.key] || 0}</div>
                  <div className="text-stone-500 text-xs capitalize">{s.key}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-stone-800">
              <div className="text-stone-400 text-xs mb-1">Overall satisfaction</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${calls.length ? Math.round((sentimentCounts.positive || 0) / calls.length * 100) : 70}%` }}
                  />
                </div>
                <span className="text-green-400 font-bold text-sm">
                  {calls.length ? Math.round((sentimentCounts.positive || 0) / calls.length * 100) : 70}%
                </span>
              </div>
            </div>
          </div>

          {/* Outcomes */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Call Outcomes</h3>
            <div className="space-y-3">
              {[
                { label: "Completed", count: calls.filter((c) => c.status === "completed").length, color: "bg-green-500" },
                { label: "Missed", count: calls.filter((c) => c.status === "missed").length, color: "bg-red-500" },
                { label: "Transferred", count: calls.filter((c) => c.status === "transferred").length, color: "bg-blue-500" },
                { label: "Voicemail", count: calls.filter((c) => c.status === "voicemail").length, color: "bg-stone-500" },
              ].map((o) => (
                <div key={o.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${o.color}`} />
                    <span className="text-stone-300 text-sm">{o.label}</span>
                  </div>
                  <span className="text-white font-bold">{o.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-stone-800">
              <div className="text-stone-400 text-xs mb-1">SMS sent after calls</div>
              <div className="text-amber-400 font-black text-2xl">{calls.filter((c) => c.sms_sent).length}</div>
            </div>
          </div>
        </div>

        {/* Call list */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-stone-800 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search calls, guests, summaries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl placeholder-stone-500 outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "bookings", "missed", "escalated", "multilingual"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize ${
                    filter === f
                      ? "bg-amber-500 text-white"
                      : "bg-stone-800 text-stone-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-800">
                  <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-5 py-3">Caller</th>
                  <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Intent</th>
                  <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Sentiment</th>
                  <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Duration</th>
                  <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">Actions</th>
                  <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center text-stone-500 py-12">Loading calls...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-stone-500 py-12">No calls match your filters.</td></tr>
                ) : filtered.map((c) => {
                  const statusConfig = {
                    completed: { dot: "bg-green-500", label: "Completed" },
                    missed: { dot: "bg-red-500", label: "Missed" },
                    transferred: { dot: "bg-blue-500", label: "Transferred" },
                    in_progress: { dot: "bg-amber-500 animate-pulse", label: "Live" },
                    voicemail: { dot: "bg-stone-500", label: "Voicemail" },
                  };
                  const sc = statusConfig[c.status] || statusConfig.completed;
                  const dur = c.duration_seconds
                    ? `${Math.floor(c.duration_seconds / 60)}m ${c.duration_seconds % 60}s`
                    : "—";
                  return (
                    <tr key={c.id} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-stone-200 text-sm font-medium">{c.caller_name || "Unknown"}</div>
                        <div className="text-stone-500 text-xs">{c.caller_number}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          <span className="text-stone-300 text-xs">{sc.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-xs text-stone-400 capitalize">{c.intent?.replace(/_/g, " ") || "—"}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm">{c.sentiment === "positive" ? "😊" : c.sentiment === "negative" ? "😟" : "😐"}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-stone-400 text-xs">{dur}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {c.booking_captured && <span title="Booking captured" className="text-xs">🗓</span>}
                          {c.sms_sent && <span title="SMS sent" className="text-xs">💬</span>}
                          {c.escalated && <span title="Escalated" className="text-xs">↗</span>}
                          {c.missed_opportunity && <span title="Missed opportunity" className="text-xs">⚠</span>}
                          {(c.transcript || c.summary) && (
                            <button
                              onClick={() => setSelectedCall(c)}
                              className="text-xs text-amber-400 hover:text-amber-300 ml-1 font-medium"
                            >
                              View →
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-stone-500 text-xs">
                          {c.call_date ? new Date(c.call_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCall && <TranscriptModal call={selectedCall} onClose={() => setSelectedCall(null)} />}
    </div>
  );
}

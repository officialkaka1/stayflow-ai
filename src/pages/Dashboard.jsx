import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Hotel, Call, Reservation } from "@/api/entities";

const MOCK_HOTEL = {
  name: "The Arbor House Boutique Hotel",
  plan: "pro",
  twilio_number: "+1-555-0100",
  ai_voice: "nova",
  ai_tone: "warm",
  monthly_minutes_used: 312,
  monthly_minutes_limit: 500,
  total_calls: 847,
  total_bookings_captured: 143,
  status: "active",
};

function StatCard({ icon, label, value, sub, color = "amber", trend }) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center text-xl`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-stone-400 text-sm font-medium">{label}</div>
      {sub && <div className="text-stone-600 text-xs mt-1">{sub}</div>}
    </div>
  );
}

function CallRow({ call }) {
  const intentColors = {
    booking_inquiry: "bg-amber-500/10 text-amber-400",
    faq: "bg-blue-500/10 text-blue-400",
    complaint: "bg-red-500/10 text-red-400",
    check_in: "bg-purple-500/10 text-purple-400",
    amenities: "bg-teal-500/10 text-teal-400",
    other: "bg-stone-500/10 text-stone-400",
    cancellation: "bg-orange-500/10 text-orange-400",
  };
  const statusIcons = {
    completed: { icon: "✓", cls: "text-green-400" },
    missed: { icon: "✗", cls: "text-red-400" },
    transferred: { icon: "↗", cls: "text-blue-400" },
    in_progress: { icon: "●", cls: "text-amber-400 animate-pulse" },
    voicemail: { icon: "◎", cls: "text-stone-400" },
  };
  const sentimentIcons = { positive: "😊", neutral: "😐", negative: "😟" };
  const st = statusIcons[call.status] || statusIcons.completed;
  const dur = call.duration_seconds
    ? `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s`
    : "—";

  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-stone-800/60 hover:bg-stone-800/30 -mx-2 px-2 rounded-lg transition-colors">
      <span className={`text-lg w-6 text-center ${st.cls}`}>{st.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-stone-200 text-sm font-medium truncate">
          {call.caller_name || call.caller_number}
        </div>
        <div className="text-stone-500 text-xs">{call.caller_number}</div>
      </div>
      <div className="hidden md:block">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${intentColors[call.intent] || intentColors.other}`}>
          {call.intent?.replace(/_/g, " ")}
        </span>
      </div>
      <div className="hidden lg:flex items-center gap-1 text-stone-400 text-xs">
        {sentimentIcons[call.sentiment]}
        <span className="capitalize">{call.sentiment}</span>
      </div>
      <div className="text-stone-400 text-xs w-16 text-right">{dur}</div>
      <div className="flex items-center gap-1.5">
        {call.booking_captured && (
          <span title="Booking captured" className="w-5 h-5 bg-amber-500/20 rounded flex items-center justify-center text-xs">🗓</span>
        )}
        {call.sms_sent && (
          <span title="SMS sent" className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center text-xs">💬</span>
        )}
        {call.escalated && (
          <span title="Escalated" className="w-5 h-5 bg-red-500/20 rounded flex items-center justify-center text-xs">↗</span>
        )}
      </div>
    </div>
  );
}

function MiniChart({ data, color = "#f59e0b" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 280;
  const h = 60;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`0,${h} ${points.join(" ")} ${w},${h}`}
        fill={`${color}20`}
        stroke="none"
      />
    </svg>
  );
}

export default function Dashboard() {
  const [calls, setCalls] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHotel, setActiveHotel] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [h, c, r] = await Promise.all([
          Hotel.list(),
          Call.list({ sort: "-call_date", limit: 20 }),
          Reservation.list({ sort: "-created_date", limit: 10 }),
        ]);
        setHotels(h);
        setCalls(c);
        setReservations(r);
        if (h.length > 0) setActiveHotel(h[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hotel = activeHotel || MOCK_HOTEL;
  const totalCalls = calls.length;
  const completedCalls = calls.filter((c) => c.status === "completed").length;
  const bookingsCaptured = calls.filter((c) => c.booking_captured).length;
  const missedCalls = calls.filter((c) => c.status === "missed").length;
  const escalated = calls.filter((c) => c.escalated).length;
  const answeredRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 94;

  const chartData = [12, 19, 14, 22, 18, 25, 21, 28, 24, 19, 31, 26, 22, 29, 33];

  const minutesPct = hotel.monthly_minutes_limit
    ? Math.round((hotel.monthly_minutes_used / hotel.monthly_minutes_limit) * 100)
    : 62;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-400">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <h1 className="text-2xl font-black text-white">StayFlow AI</h1>
            </div>
            <p className="text-stone-400 text-sm pl-12">
              Welcome back — <span className="text-amber-400 font-medium">{hotel.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hotels.length > 1 && (
              <select
                value={activeHotel?.id}
                onChange={(e) => setActiveHotel(hotels.find((h) => h.id === e.target.value))}
                className="bg-stone-800 border border-stone-700 text-stone-300 text-sm rounded-xl px-3 py-2"
              >
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            )}
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
              hotel.status === "active" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
              {hotel.plan?.toUpperCase()} · {hotel.status}
            </span>
            <Link to="/ai-config" className="bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 text-sm px-4 py-2 rounded-xl transition-colors">
              ⚙ Configure AI
            </Link>
          </div>
        </div>

        {/* Live status bar */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl px-5 py-3.5 mb-8 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-stone-300 text-sm font-medium">AI Receptionist is live</span>
            <span className="text-stone-600 text-sm">·</span>
            <span className="text-stone-400 text-sm">{hotel.twilio_number || "+1-555-0100"}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-stone-500">Usage this month:</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-stone-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${minutesPct > 80 ? "bg-red-500" : minutesPct > 60 ? "bg-amber-500" : "bg-green-500"}`}
                  style={{ width: `${minutesPct}%` }}
                />
              </div>
              <span className="text-stone-400 text-xs">{hotel.monthly_minutes_used || 312} / {hotel.monthly_minutes_limit || 500} min</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="📞" label="Total Calls" value={hotel.total_calls || calls.length || 847} trend={12} sub="This month" />
          <StatCard icon="🗓️" label="Bookings Captured" value={hotel.total_bookings_captured || bookingsCaptured || 143} trend={8} color="green" sub="Via AI this month" />
          <StatCard icon="✓" label="Answer Rate" value={`${answeredRate}%`} trend={3} color="blue" sub="Calls answered" />
          <StatCard icon="⚠" label="Missed Calls" value={missedCalls || 23} trend={-15} color="red" sub="SMS sent to all" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Call Volume Chart */}
          <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold">Call Volume</h3>
                <p className="text-stone-500 text-xs">Last 15 days</p>
              </div>
              <span className="text-amber-400 text-sm font-semibold">↑ 18% vs last period</span>
            </div>
            <MiniChart data={chartData} />
            <div className="flex justify-between text-stone-600 text-xs mt-1">
              <span>May 3</span>
              <span>May 10</span>
              <span>May 17</span>
            </div>
          </div>

          {/* AI Performance */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">AI Performance</h3>
            <div className="space-y-4">
              {[
                { label: "Booking conversion", value: 68, color: "bg-amber-500" },
                { label: "Avg confidence score", value: 94, color: "bg-green-500" },
                { label: "Escalation rate", value: 12, color: "bg-blue-500" },
                { label: "SMS delivery", value: 97, color: "bg-purple-500" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-stone-400">{m.label}</span>
                    <span className="text-white font-semibold">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full transition-all duration-700`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Calls */}
          <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Recent Calls</h3>
              <Link to="/call-analytics" className="text-amber-400 text-sm hover:text-amber-300">View all →</Link>
            </div>
            {calls.length === 0 ? (
              <div className="text-center py-10 text-stone-500">
                <div className="text-4xl mb-3">📞</div>
                <p>No calls yet. Your AI receptionist is ready.</p>
              </div>
            ) : (
              <div>
                {calls.slice(0, 6).map((c) => (
                  <CallRow key={c.id} call={c} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Reservations */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Reservations</h3>
              <span className="text-stone-500 text-xs">{reservations.length} leads</span>
            </div>
            <div className="space-y-3">
              {reservations.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-start gap-3 py-2.5 border-b border-stone-800/60 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 text-xs font-bold">{r.guest_name?.charAt(0) || "G"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-stone-200 text-sm font-medium truncate">{r.guest_name}</div>
                    <div className="text-stone-500 text-xs">{r.room_type} · {r.check_in_date}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    r.status === "confirmed" ? "bg-green-500/10 text-green-400" :
                    r.status === "lead" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800">
              <div className="text-stone-500 text-xs mb-1">Pipeline value</div>
              <div className="text-amber-400 font-black text-xl">
                ${reservations.reduce((sum, r) => sum + (r.estimated_value || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

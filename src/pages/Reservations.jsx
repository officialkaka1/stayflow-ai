import { useState, useEffect } from "react";
import { Reservation } from "@/api/entities";

const STATUS_CONFIG = {
  lead: { label: "Lead", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  confirmed: { label: "Confirmed", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  no_show: { label: "No Show", color: "bg-stone-500/10 text-stone-400 border-stone-500/20" },
};

function ReservationModal({ res, onClose, onUpdate }) {
  const [status, setStatus] = useState(res.status);
  const [notes, setNotes] = useState(res.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await Reservation.update(res.id, { status, notes });
      onUpdate(updated);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const nights = res.check_in_date && res.check_out_date
    ? Math.max(1, (new Date(res.check_out_date) - new Date(res.check_in_date)) / (1000 * 60 * 60 * 24))
    : 1;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">{res.guest_name}</h3>
            <p className="text-stone-400 text-sm">{res.room_type}</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-800/50 rounded-xl p-4">
              <p className="text-stone-500 text-xs mb-1">Check-in</p>
              <p className="text-white font-semibold">{res.check_in_date || "—"}</p>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-4">
              <p className="text-stone-500 text-xs mb-1">Check-out</p>
              <p className="text-white font-semibold">{res.check_out_date || "—"}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-stone-500 text-xs mb-1">Guests</p>
              <p className="text-stone-200">{res.guest_count || 1}</p>
            </div>
            <div>
              <p className="text-stone-500 text-xs mb-1">Nights</p>
              <p className="text-stone-200">{nights}</p>
            </div>
            <div>
              <p className="text-stone-500 text-xs mb-1">Est. Value</p>
              <p className="text-amber-400 font-bold">${res.estimated_value || "—"}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {res.guest_email && (
              <div className="flex gap-2">
                <span className="text-stone-500 w-16">Email</span>
                <span className="text-stone-200">{res.guest_email}</span>
              </div>
            )}
            {res.guest_phone && (
              <div className="flex gap-2">
                <span className="text-stone-500 w-16">Phone</span>
                <span className="text-stone-200">{res.guest_phone}</span>
              </div>
            )}
            {res.special_requests && (
              <div className="flex gap-2">
                <span className="text-stone-500 w-16 flex-shrink-0">Requests</span>
                <span className="text-stone-300 italic text-xs leading-relaxed">{res.special_requests}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {res.booking_link_sent && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">📩 Booking link sent</span>}
            {res.confirmation_sent && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">✅ Confirmed</span>}
            <span className="text-xs bg-stone-800 text-stone-400 px-2 py-1 rounded-full capitalize">Source: {res.source}</span>
          </div>
          <div>
            <label className="text-stone-400 text-xs font-medium block mb-2">Status</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                    status === key ? config.color : "border-stone-700 text-stone-500 hover:text-stone-300"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-stone-400 text-xs font-medium block mb-2">Internal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50 resize-none"
              placeholder="Add notes for your team..."
            />
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-stone-800 text-stone-300 rounded-xl text-sm hover:bg-stone-700 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-sm transition-colors">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Reservation.list({ sort: "-created_date" }).then(setReservations).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);
  const totalValue = reservations.filter((r) => r.status === "confirmed").reduce((s, r) => s + (r.estimated_value || 0), 0);
  const pipelineValue = reservations.filter((r) => r.status === "lead").reduce((s, r) => s + (r.estimated_value || 0), 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Reservations</h1>
          <p className="text-stone-400">All guest leads and bookings captured by your AI receptionist.</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="text-3xl font-black text-white">{reservations.length}</div>
            <div className="text-stone-400 text-sm mt-1">Total Leads</div>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="text-3xl font-black text-green-400">{reservations.filter((r) => r.status === "confirmed").length}</div>
            <div className="text-stone-400 text-sm mt-1">Confirmed</div>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="text-3xl font-black text-amber-400">${totalValue.toLocaleString()}</div>
            <div className="text-stone-400 text-sm mt-1">Confirmed Revenue</div>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="text-3xl font-black text-blue-400">${pipelineValue.toLocaleString()}</div>
            <div className="text-stone-400 text-sm mt-1">Pipeline Value</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "lead", "confirmed", "cancelled"].map((f) => {
            const counts = reservations.filter((r) => f === "all" || r.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium transition-colors capitalize ${
                  filter === f ? "bg-amber-500 text-white" : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                {f === "all" ? "All" : STATUS_CONFIG[f]?.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/20" : "bg-stone-800"}`}>{counts}</span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800">
                <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-5 py-3">Guest</th>
                <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">Room</th>
                <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Check-in</th>
                <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Guests</th>
                <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">Value</th>
                <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center text-stone-500 py-12">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-stone-500 py-12">No reservations found.</td></tr>
              ) : filtered.map((r) => {
                const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.lead;
                return (
                  <tr key={r.id} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors cursor-pointer" onClick={() => setSelected(r)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-400 text-xs font-bold">{r.guest_name?.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-stone-200 text-sm font-medium">{r.guest_name}</div>
                          <div className="text-stone-500 text-xs">{r.guest_email || r.guest_phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-stone-300 text-sm">{r.room_type}</td>
                    <td className="px-4 py-4 hidden md:table-cell text-stone-400 text-sm">{r.check_in_date}</td>
                    <td className="px-4 py-4 hidden lg:table-cell text-stone-400 text-sm">{r.guest_count}</td>
                    <td className="px-4 py-4">
                      <span className="text-amber-400 font-bold text-sm">${r.estimated_value?.toLocaleString() || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${sc.color}`}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex gap-1.5">
                        {r.booking_link_sent && <span title="Booking link sent" className="text-xs">📩</span>}
                        {r.confirmation_sent && <span title="Confirmed" className="text-xs">✅</span>}
                        <button className="text-amber-400 text-xs hover:text-amber-300 font-medium ml-1">Edit</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ReservationModal
          res={selected}
          onClose={() => setSelected(null)}
          onUpdate={(updated) => {
            setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

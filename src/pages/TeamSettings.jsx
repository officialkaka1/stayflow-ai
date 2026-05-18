import { useState, useEffect } from "react";
import { StaffMember } from "@/api/entities";

const ROLE_COLORS = {
  owner: "bg-amber-500/10 text-amber-400",
  admin: "bg-blue-500/10 text-blue-400",
  staff: "bg-green-500/10 text-green-400",
  viewer: "bg-stone-500/10 text-stone-400",
};

const ROLE_DESCRIPTIONS = {
  owner: "Full access including billing and account deletion",
  admin: "Manage AI config, knowledge base, and team",
  staff: "View analytics and manage reservations",
  viewer: "Read-only access to dashboard and analytics",
};

function InviteModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("staff");
  const [saving, setSaving] = useState(false);

  const handleInvite = async () => {
    if (!name || !email) return;
    setSaving(true);
    try {
      const member = await StaffMember.create({
        name, email, phone, role, status: "invited",
        notifications_email: true, notifications_sms: false, notifications_slack: false,
      });
      onAdd(member);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Invite Team Member</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-stone-400 text-xs font-medium block mb-2">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50"
                placeholder="Jane Smith" />
            </div>
            <div>
              <label className="text-stone-400 text-xs font-medium block mb-2">Phone (optional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50"
                placeholder="+1-555-0100" />
            </div>
          </div>
          <div>
            <label className="text-stone-400 text-xs font-medium block mb-2">Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50"
              placeholder="jane@yourhotel.com" />
          </div>
          <div>
            <label className="text-stone-400 text-xs font-medium block mb-2">Role</label>
            <div className="space-y-2">
              {["admin", "staff", "viewer"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    role === r ? "border-amber-500 bg-amber-500/5" : "border-stone-700 hover:border-stone-600"
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${ROLE_COLORS[r]}`}>
                    {r.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold capitalize ${role === r ? "text-amber-400" : "text-stone-200"}`}>{r}</div>
                    <div className="text-stone-500 text-xs">{ROLE_DESCRIPTIONS[r]}</div>
                  </div>
                  {role === r && <span className="ml-auto text-amber-400">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-stone-800 text-stone-300 rounded-xl text-sm hover:bg-stone-700 transition-colors">Cancel</button>
          <button
            onClick={handleInvite}
            disabled={!name || !email || saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors"
          >
            {saving ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeamSettings() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  const DEMO_MEMBERS = [
    { id: "1", name: "Eleanor Whitfield", email: "eleanor@arborhouse.com", role: "owner", status: "active", notifications_email: true, notifications_sms: true, last_login: "2026-05-18T10:22:00Z" },
    { id: "2", name: "Marcus Chen", email: "marcus@arborhouse.com", role: "admin", status: "active", notifications_email: true, notifications_sms: false, last_login: "2026-05-17T15:45:00Z" },
    { id: "3", name: "Sofia Patel", email: "sofia@arborhouse.com", role: "staff", status: "active", notifications_email: false, notifications_sms: false, last_login: "2026-05-16T09:10:00Z" },
    { id: "4", name: "Jake Morrison", email: "jake@arborhouse.com", role: "viewer", status: "invited", notifications_email: true, notifications_sms: false, last_login: null },
  ];

  useEffect(() => {
    StaffMember.list().then((data) => {
      setMembers(data.length > 0 ? data : DEMO_MEMBERS);
    }).catch(() => setMembers(DEMO_MEMBERS)).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    if (!confirm("Remove this team member?")) return;
    try {
      if (id.length > 5) await StaffMember.delete(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      if (id.length > 5) await StaffMember.update(id, { role });
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Team & Access</h1>
            <p className="text-stone-400">Manage who has access to your StayFlow AI dashboard.</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            + Invite Member
          </button>
        </div>

        {/* Role overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {["owner", "admin", "staff", "viewer"].map((r) => (
            <div key={r} className={`rounded-xl p-4 border ${r === "owner" ? "border-amber-500/30 bg-amber-500/5" : "border-stone-800 bg-stone-900"}`}>
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2 ${ROLE_COLORS[r]}`}>{r.toUpperCase()}</div>
              <div className="text-stone-400 text-xs leading-relaxed">{ROLE_DESCRIPTIONS[r]}</div>
            </div>
          ))}
        </div>

        {/* Team list */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-stone-800">
            <h3 className="text-white font-bold">Team Members ({members.length})</h3>
          </div>
          {loading ? (
            <div className="text-center py-10 text-stone-500">Loading team...</div>
          ) : (
            <div className="divide-y divide-stone-800/50">
              {members.map((member) => (
                <div key={member.id} className="p-5 flex items-center gap-4 hover:bg-stone-800/20 transition-colors">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold ${ROLE_COLORS[member.role]}`}>
                    {member.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{member.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_COLORS[member.role]}`}>
                        {member.role}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        member.status === "active" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {member.status}
                      </span>
                    </div>
                    <div className="text-stone-400 text-xs mt-0.5">{member.email}</div>
                    {member.last_login && (
                      <div className="text-stone-600 text-xs mt-0.5">
                        Last active: {new Date(member.last_login).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex gap-1.5 text-stone-600 text-xs">
                      {member.notifications_email && <span title="Email alerts">✉</span>}
                      {member.notifications_sms && <span title="SMS alerts">💬</span>}
                    </div>
                    {member.role !== "owner" && (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className="bg-stone-800 border border-stone-700 text-stone-300 text-xs rounded-lg px-2 py-1.5 outline-none"
                        >
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification settings */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mt-6">
          <h3 className="text-white font-bold mb-4">Alert Channels</h3>
          <p className="text-stone-400 text-sm mb-5">Choose how your team gets notified of important events like escalations and missed calls.</p>
          <div className="space-y-3">
            {[
              { icon: "✉", label: "Email Alerts", desc: "Escalations, missed bookings, daily digest", active: true },
              { icon: "💬", label: "SMS Alerts", desc: "Real-time escalation notifications", active: true },
              { icon: "🔔", label: "Slack Notifications", desc: "Send to a Slack channel", active: false },
              { icon: "📱", label: "WhatsApp Alerts", desc: "Staff alerts via WhatsApp", active: false },
            ].map((channel) => (
              <div key={channel.label} className="flex items-center justify-between p-4 bg-stone-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{channel.icon}</span>
                  <div>
                    <div className="text-stone-200 text-sm font-medium">{channel.label}</div>
                    <div className="text-stone-500 text-xs">{channel.desc}</div>
                  </div>
                </div>
                <div className={`text-xs px-3 py-1 rounded-full font-medium ${channel.active ? "bg-green-500/10 text-green-400" : "bg-stone-700 text-stone-500"}`}>
                  {channel.active ? "Active" : "Configure"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onAdd={(m) => setMembers((p) => [...p, m])} />}
    </div>
  );
}

import { useState, useEffect } from "react";
import { KnowledgeBase } from "@/api/entities";

const DOC_TYPES = [
  { id: "faq", label: "FAQ", icon: "❓", color: "text-blue-400 bg-blue-500/10" },
  { id: "policy", label: "Policy", icon: "📋", color: "text-purple-400 bg-purple-500/10" },
  { id: "menu", label: "Menu", icon: "🍽", color: "text-orange-400 bg-orange-500/10" },
  { id: "room_description", label: "Rooms", icon: "🛏", color: "text-amber-400 bg-amber-500/10" },
  { id: "amenities", label: "Amenities", icon: "🏊", color: "text-teal-400 bg-teal-500/10" },
  { id: "pricing", label: "Pricing", icon: "💰", color: "text-green-400 bg-green-500/10" },
  { id: "directions", label: "Directions", icon: "📍", color: "text-red-400 bg-red-500/10" },
  { id: "custom", label: "Custom", icon: "📄", color: "text-stone-400 bg-stone-500/10" },
];

function AddDocModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("faq");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) return;
    setSaving(true);
    try {
      const doc = await KnowledgeBase.create({
        title,
        document_type: docType,
        content,
        status: "pending",
        chunk_count: Math.ceil(content.split(" ").length / 100),
        usage_count: 0,
        confidence_avg: 0,
        tags: [],
      });
      onAdd(doc);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Add Knowledge Document</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-stone-400 text-xs font-medium block mb-2">Document Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500/50"
              placeholder="e.g. Pool & Fitness Center Hours"
            />
          </div>
          <div>
            <label className="text-stone-400 text-xs font-medium block mb-2">Document Type</label>
            <div className="grid grid-cols-4 gap-2">
              {DOC_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDocType(t.id)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                    docType === t.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-stone-700 text-stone-400 hover:border-stone-600"
                  }`}
                >
                  <div className="text-lg mb-1">{t.icon}</div>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-stone-400 text-xs font-medium block mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-3 rounded-xl outline-none focus:border-amber-500/50 resize-none"
              placeholder="Paste your content here. The AI will use this to answer guest questions accurately..."
            />
            <p className="text-stone-500 text-xs mt-1.5">~{Math.ceil(content.split(" ").length / 100)} chunks · {content.split(" ").filter(Boolean).length} words</p>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-stone-800 text-stone-300 rounded-xl text-sm hover:bg-stone-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title || !content || saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors"
          >
            {saving ? "Adding..." : "Add Document"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeBaseManager() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    KnowledgeBase.list({ sort: "-created_date" }).then(setDocs).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await KnowledgeBase.update(id, { status });
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this document from the knowledge base?")) return;
    try {
      await KnowledgeBase.delete(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = docs.filter((d) => {
    const byType = filterType === "all" || d.document_type === filterType;
    const byStatus = filterStatus === "all" || d.status === filterStatus;
    return byType && byStatus;
  });

  const approvedCount = docs.filter((d) => d.status === "approved").length;
  const pendingCount = docs.filter((d) => d.status === "pending").length;
  const totalUsage = docs.reduce((sum, d) => sum + (d.usage_count || 0), 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Knowledge Base</h1>
            <p className="text-stone-400">Train your AI on hotel documents, policies, menus, and more.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            + Add Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 text-center">
            <div className="text-3xl font-black text-green-400">{approvedCount}</div>
            <div className="text-stone-400 text-sm mt-1">Active Documents</div>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 text-center">
            <div className="text-3xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-stone-400 text-sm mt-1">Pending Review</div>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 text-center">
            <div className="text-3xl font-black text-blue-400">{totalUsage.toLocaleString()}</div>
            <div className="text-stone-400 text-sm mt-1">AI References</div>
          </div>
        </div>

        {/* How RAG works */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🧠</div>
            <div>
              <p className="text-stone-200 font-semibold text-sm">How your knowledge base works</p>
              <p className="text-stone-400 text-sm mt-1 leading-relaxed">
                When a guest asks a question, the AI uses semantic search to find the most relevant document chunks and generates an accurate, natural response.
                Documents marked <span className="text-green-400 font-medium">Approved</span> are live. <span className="text-amber-400 font-medium">Pending</span> documents await your review before going live.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex gap-1.5 bg-stone-900 border border-stone-800 rounded-xl p-1">
            {["all", ...DOC_TYPES.map((t) => t.id)].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${
                  filterType === t ? "bg-amber-500 text-white" : "text-stone-400 hover:text-white"
                }`}
              >
                {t === "all" ? "All Types" : DOC_TYPES.find((d) => d.id === t)?.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 bg-stone-900 border border-stone-800 rounded-xl p-1">
            {["all", "approved", "pending", "processing"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${
                  filterStatus === s ? "bg-amber-500 text-white" : "text-stone-400 hover:text-white"
                }`}
              >
                {s === "all" ? "All Status" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-stone-500">Loading knowledge base...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-stone-900 border border-stone-800 rounded-2xl">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-stone-300 font-medium mb-2">No documents yet</p>
              <p className="text-stone-500 text-sm mb-6">Add your hotel's policies, FAQs, menus, and more to train your AI.</p>
              <button onClick={() => setShowAdd(true)} className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors">
                Add Your First Document
              </button>
            </div>
          ) : filtered.map((doc) => {
            const typeConfig = DOC_TYPES.find((t) => t.id === doc.document_type) || DOC_TYPES[DOC_TYPES.length - 1];
            const isExpanded = expanded === doc.id;
            return (
              <div key={doc.id} className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${typeConfig.color}`}>
                      {typeConfig.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-white font-semibold">{doc.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          doc.status === "approved" ? "bg-green-500/10 text-green-400" :
                          doc.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                          doc.status === "processing" ? "bg-blue-500/10 text-blue-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>{doc.status}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                        <span>{typeConfig.label}</span>
                        {doc.chunk_count > 0 && <span>· {doc.chunk_count} chunks</span>}
                        {doc.usage_count > 0 && <span>· used {doc.usage_count} times</span>}
                        {doc.confidence_avg > 0 && <span>· {Math.round(doc.confidence_avg * 100)}% avg confidence</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doc.status === "pending" && (
                        <button
                          onClick={() => handleStatusChange(doc.id, "approved")}
                          className="text-xs px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg font-medium transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {doc.status === "approved" && (
                        <button
                          onClick={() => handleStatusChange(doc.id, "pending")}
                          className="text-xs px-3 py-1.5 bg-stone-800 text-stone-400 hover:text-white rounded-lg font-medium transition-colors"
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : doc.id)}
                        className="text-xs px-3 py-1.5 bg-stone-800 text-stone-400 hover:text-white rounded-lg font-medium transition-colors"
                      >
                        {isExpanded ? "▲ Hide" : "▼ Preview"}
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                {isExpanded && doc.content && (
                  <div className="px-5 pb-5 pt-0 border-t border-stone-800 mt-0">
                    <div className="bg-stone-800/50 rounded-xl p-4 mt-4">
                      <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">{doc.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && <AddDocModal onClose={() => setShowAdd(false)} onAdd={(doc) => setDocs((p) => [doc, ...p])} />}
    </div>
  );
}

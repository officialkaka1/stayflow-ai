import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "⊞", path: "/dashboard" },
  { label: "Call Analytics", icon: "📞", path: "/call-analytics" },
  { label: "Reservations", icon: "🗓", path: "/reservations" },
  { label: "Knowledge Base", icon: "🧠", path: "/knowledge-base" },
  { label: "AI Config", icon: "⚙", path: "/ai-config" },
  { label: "Team", icon: "👥", path: "/team" },
  { label: "Billing", icon: "💳", path: "/billing" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show sidebar on landing page
  const isLanding = location.pathname === "/" || location.pathname === "";
  if (isLanding) return <>{children}</>;

  return (
    <div className="min-h-screen bg-stone-950 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 bg-stone-900 border-r border-stone-800 flex flex-col transition-all duration-300
        ${collapsed ? "w-16" : "w-56"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className={`p-4 border-b border-stone-800 flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">S</span>
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-white text-sm leading-tight">StayFlow</div>
              <div className="text-amber-400 text-xs font-semibold">AI</div>
            </div>
          )}
        </div>

        {/* AI Status */}
        {!collapsed && (
          <div className="mx-3 mt-3 bg-green-500/5 border border-green-500/20 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-green-400 text-xs font-medium">AI Receptionist Live</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : ""}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-500 hover:text-stone-300 hover:bg-stone-800/60 transition-colors ${collapsed ? "justify-center" : ""}`}
          >
            <span>🏠</span>
            {!collapsed && <span>Home Page</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-400 hover:bg-stone-800/60 transition-colors text-xs"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-16" : "md:ml-56"}`}>
        {/* Mobile header */}
        <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-stone-400 text-xl">☰</button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
            <span className="text-white font-bold text-sm">StayFlow AI</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

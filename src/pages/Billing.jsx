import { useState } from "react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 149,
    period: "month",
    description: "Perfect for small independent hotels",
    color: "stone",
    features: [
      { label: "AI minutes per month", value: "200" },
      { label: "Phone numbers", value: "1" },
      { label: "SMS messages", value: "500/mo" },
      { label: "Knowledge base documents", value: "10" },
      { label: "Call transcripts & summaries", value: "✓" },
      { label: "FAQ & booking capture", value: "✓" },
      { label: "Email support", value: "✓" },
      { label: "Multilingual AI", value: "—" },
      { label: "Live call transfer", value: "—" },
      { label: "Analytics dashboard", value: "—" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 349,
    period: "month",
    description: "For serious boutique hotels",
    color: "amber",
    highlighted: true,
    features: [
      { label: "AI minutes per month", value: "500" },
      { label: "Phone numbers", value: "3" },
      { label: "SMS messages", value: "2,000/mo" },
      { label: "Knowledge base documents", value: "50" },
      { label: "Call transcripts & summaries", value: "✓" },
      { label: "FAQ & booking capture", value: "✓" },
      { label: "Priority support", value: "✓" },
      { label: "Multilingual AI", value: "✓" },
      { label: "Live call transfer", value: "✓" },
      { label: "Analytics dashboard", value: "✓" },
    ],
  },
  {
    id: "multi_property",
    name: "Multi-Property",
    price: 799,
    period: "month",
    description: "For hotel groups & portfolios",
    color: "purple",
    features: [
      { label: "AI minutes per month", value: "Unlimited" },
      { label: "Phone numbers", value: "Unlimited" },
      { label: "SMS messages", value: "Unlimited" },
      { label: "Knowledge base documents", value: "Unlimited" },
      { label: "Call transcripts & summaries", value: "✓" },
      { label: "FAQ & booking capture", value: "✓" },
      { label: "Dedicated account manager", value: "✓" },
      { label: "Multilingual AI", value: "✓" },
      { label: "Live call transfer", value: "✓" },
      { label: "Custom AI voice/persona", value: "✓" },
    ],
  },
];

const INVOICES = [
  { date: "May 1, 2026", amount: "$349.00", status: "paid", plan: "Pro" },
  { date: "Apr 1, 2026", amount: "$349.00", status: "paid", plan: "Pro" },
  { date: "Mar 1, 2026", amount: "$349.00", status: "paid", plan: "Pro" },
  { date: "Feb 1, 2026", amount: "$149.00", status: "paid", plan: "Starter" },
];

const USAGE_ITEMS = [
  { label: "AI Call Minutes", used: 312, limit: 500, unit: "min", color: "bg-amber-500" },
  { label: "SMS Messages", used: 187, limit: 2000, unit: "sms", color: "bg-blue-500" },
  { label: "Knowledge Base Docs", used: 7, limit: 50, unit: "docs", color: "bg-purple-500" },
  { label: "Phone Numbers", used: 1, limit: 3, unit: "numbers", color: "bg-teal-500" },
];

export default function Billing() {
  const [currentPlan] = useState("pro");
  const [billing] = useState("monthly");
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Billing & Subscription</h1>
          <p className="text-stone-400">Manage your plan, usage, and payment details.</p>
        </div>

        {/* Current plan summary */}
        <div className="bg-gradient-to-r from-amber-500/10 to-stone-900 border border-amber-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold bg-amber-500 text-white px-3 py-1 rounded-full">PRO PLAN</span>
                <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Active
                </span>
              </div>
              <p className="text-white font-bold text-xl">$349 / month</p>
              <p className="text-stone-400 text-sm">Next billing: June 1, 2026 · Auto-renews</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgrade(!showUpgrade)}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Upgrade Plan
              </button>
              <button className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
                Cancel Plan
              </button>
            </div>
          </div>
        </div>

        {/* Usage breakdown */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-bold text-lg mb-5">This Month's Usage</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {USAGE_ITEMS.map((item) => {
              const pct = Math.round((item.used / item.limit) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-stone-300 font-medium">{item.label}</span>
                    <span className="text-stone-400">
                      <span className="text-white font-bold">{item.used.toLocaleString()}</span> / {item.limit.toLocaleString()} {item.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-stone-600 mt-1">
                    <span>{pct}% used</span>
                    <span>{item.limit - item.used} remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between">
            <p className="text-stone-400 text-sm">Usage resets June 1, 2026</p>
            <button className="text-amber-400 text-sm hover:text-amber-300 font-medium">Buy more minutes →</button>
          </div>
        </div>

        {/* Plan comparison toggle */}
        {showUpgrade && (
          <div className="mb-8">
            <h3 className="text-white font-bold text-xl mb-5">Choose a Plan</h3>
            <div className="grid md:grid-cols-3 gap-5">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 border transition-all ${
                    plan.id === currentPlan
                      ? "border-amber-500 bg-amber-500/5"
                      : "border-stone-800 bg-stone-900 hover:border-stone-700"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="text-xs font-bold text-amber-400 mb-2">MOST POPULAR</div>
                  )}
                  {plan.id === currentPlan && (
                    <div className="text-xs font-bold text-green-400 mb-2">✓ CURRENT PLAN</div>
                  )}
                  <h4 className="text-white font-bold text-lg">{plan.name}</h4>
                  <p className="text-stone-400 text-xs mb-3">{plan.description}</p>
                  <div className="flex items-end gap-1 mb-5">
                    <span className="text-3xl font-black text-white">${plan.price}</span>
                    <span className="text-stone-500 text-sm mb-0.5">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f.label} className="flex items-center justify-between text-xs">
                        <span className="text-stone-400">{f.label}</span>
                        <span className={`font-semibold ${f.value === "—" ? "text-stone-600" : "text-white"}`}>
                          {f.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled={plan.id === currentPlan}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${
                      plan.id === currentPlan
                        ? "bg-stone-800 text-stone-500 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-400 text-white"
                    }`}
                  >
                    {plan.id === currentPlan ? "Current Plan" : plan.id === "multi_property" ? "Contact Sales" : "Switch to " + plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment method */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Payment Method</h3>
            <div className="flex items-center gap-4 p-4 bg-stone-800 rounded-xl mb-4">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-black">VISA</span>
              </div>
              <div>
                <div className="text-stone-200 text-sm font-medium">•••• •••• •••• 4242</div>
                <div className="text-stone-500 text-xs">Expires 12/27</div>
              </div>
              <span className="ml-auto text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Default</span>
            </div>
            <button className="text-amber-400 text-sm hover:text-amber-300 font-medium">+ Add payment method</button>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Billing Address</h3>
            <div className="text-stone-400 text-sm space-y-1">
              <p className="text-stone-200 font-medium">The Arbor House Boutique Hotel</p>
              <p>14 Elmwood Lane</p>
              <p>Charleston, SC 29401</p>
              <p>United States</p>
            </div>
            <button className="text-amber-400 text-sm hover:text-amber-300 font-medium mt-3">Edit address</button>
          </div>
        </div>

        {/* Invoice history */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-stone-800">
            <h3 className="text-white font-bold">Invoice History</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800">
                <th className="text-left text-stone-500 text-xs px-5 py-3 font-semibold uppercase tracking-wider">Date</th>
                <th className="text-left text-stone-500 text-xs px-4 py-3 font-semibold uppercase tracking-wider">Plan</th>
                <th className="text-left text-stone-500 text-xs px-4 py-3 font-semibold uppercase tracking-wider">Amount</th>
                <th className="text-left text-stone-500 text-xs px-4 py-3 font-semibold uppercase tracking-wider">Status</th>
                <th className="text-left text-stone-500 text-xs px-4 py-3 font-semibold uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={i} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors">
                  <td className="px-5 py-4 text-stone-300 text-sm">{inv.date}</td>
                  <td className="px-4 py-4 text-stone-400 text-sm">{inv.plan}</td>
                  <td className="px-4 py-4 text-white font-semibold text-sm">{inv.amount}</td>
                  <td className="px-4 py-4">
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium capitalize">{inv.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-amber-400 text-xs hover:text-amber-300 font-medium">Download PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

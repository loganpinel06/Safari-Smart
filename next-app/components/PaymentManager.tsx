"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// Subscription Features 
const FEATURES = [
  "All topics unlocked across every subject",
  "Unlimited quizzes and practice exams",
  "Performance reports and tailored study plans",
  "Past paper questions with worked solutions",
  "Parent dashboard with child progress tracking",
];

// Pricing Details
type PlanKey = "monthly" | "annual";
const SUBSCRIPTION_PLANS: Record<PlanKey, { label: string; price: number; billed: string; total: number; saving: number | null }> = 
{
  monthly: { label: "Monthly", price: 20,  billed: "Billed monthly, cancel anytime", total: 20,  saving: null },
  annual:  { label: "Annual",  price: 16,  billed: "Billed annually, save more",      total: 192, saving: 48  },
};

export default function PaymentManager({
  profile,
  logoutAction,
}: {
  profile: any; //Record<string, string> | null;
  logoutAction: () => Promise<void>;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanKey>("annual");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard]   = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc]     = useState("");

const current = SUBSCRIPTION_PLANS[plan];

// Handle formatting for card number and expiry input
function formatCardNumber(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
function formatCardExpiry(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
  }

return (
     <main className="min-h-screen bg-[#FFF1E5] text-[#592803] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl space-y-8">
 
        {/* Main Content */}
        <div className="flex-1 px-10 py-10">
          <div className="max-w-5xl space-y-8">
 
            {/* Page Header */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                Upgrade Your Learning Experience
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-[#592803]">
                Unlock Full Access
              </h1>
              <p className="mt-1 text-sm text-[#4B3A46]">
                Subscribe to continue learning with Safari Smart.
              </p>
            </div>
 
            {/* Columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
 
              {/* Subscription Summary*/}
              <div className="space-y-5">
 
                {/* Plan Card */}
                <div className="rounded-2xl bg-white/70 border border-[#4B3A46]/10 p-6 shadow-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1B8] border border-[#4B3A46]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#7A5600]">
                    ★ Premium Plan
                  </span>
 
                  <h2 className="mt-4 text-2xl font-extrabold text-[#592803]">
                    Full Access
                  </h2>
                  <p className="mt-1 text-sm text-[#4B3A46]">
                    Everything you need to ace your exams.
                  </p>
 
                  {/* Subscription Toggle Button */}
                  <div className="mt-5 inline-flex rounded-full bg-[#FFF1E5] border border-[#4B3A46]/10 p-1 gap-1">
                    {(["monthly", "annual"] as PlanKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => setPlan(key)}
                        className={`rounded-full px-5 py-1.5 text-xs font-bold transition ${
                          plan === key
                            ? "bg-[#592803] text-white shadow"
                            : "text-[#7A6058] hover:text-[#592803]"
                        }`}
                      >
                        {SUBSCRIPTION_PLANS[key].label}
                        {key === "annual" && (
                          <span className={`ml-1.5 ${plan === "annual" ? "text-[#FFF1B8]" : "text-green-600"}`}>
                            –20%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
 
                  {/* Price */}
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[#592803]">
                      USD$ {current.price}
                    </span>
                    <span className="text-sm text-[#4B3A46]">/month</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-[#4B3A46]/70">
                    {current.billed}
                  </p>
                </div>
 
                {/* Features Card */}
                <div className="rounded-2xl bg-white/70 border border-[#4B3A46]/10 p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46] mb-4">
                    What's Included?
                  </p>
                  <ul className="space-y-3">
                    {FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F6D8] border border-[#B7D78A]">
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6 8 1" stroke="#4D6B1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-sm text-[#4B3A46]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
 
                {/* Guarantee Card*/}
                <div className="flex items-start gap-3 rounded-2xl bg-[#FFF1B8]/50 border border-[#4B3A46]/10 p-5">
                  <p className="text-sm text-[#4B3A46]">
                    <span className="font-bold text-[#592803]">7-day money-back guarantee.</span>{" "}
                    Not satisfied? We'll refund you in full, no questions asked.
                  </p>
                </div>
              </div>
 
              {/* Payment Form */}
              <div className="rounded-2xl bg-white/70 border border-[#4B3A46]/10 p-6 shadow-sm h-fit">
 
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A08070] mb-4">
                  Contact
                </p>
 
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#592803]">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-[#4B3A46]/20 bg-[#FFFAF6] px-4 py-2.5 text-sm text-[#592803] placeholder-[#C4A898] outline-none transition focus:border-[#592803] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#592803]">
                      Cardholder Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="johndoe@example.com"
                      className="w-full rounded-xl border border-[#4B3A46]/20 bg-[#FFFAF6] px-4 py-2.5 text-sm text-[#592803] placeholder-[#C4A898] outline-none transition focus:border-[#592803] focus:bg-white"
                    />
                  </div>
                </div>
 
                <div className="my-5 border-t border-[#4B3A46]/10" />
 
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A08070] mb-4">
                  Payment Details
                </p>
 
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#592803]">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={card}
                      onChange={(e) => setCard(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-xl border border-[#4B3A46]/20 bg-[#FFFAF6] px-4 py-2.5 text-sm text-[#592803] placeholder-[#C4A898] outline-none transition focus:border-[#592803] focus:bg-white"
                    />
                  </div>
 
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#592803]">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatCardExpiry(e.target.value))}
                        placeholder="MM / YY"
                        className="w-full rounded-xl border border-[#4B3A46]/20 bg-[#FFFAF6] px-4 py-2.5 text-sm text-[#592803] placeholder-[#C4A898] outline-none transition focus:border-[#592803] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#592803]">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        className="w-full rounded-xl border border-[#4B3A46]/20 bg-[#FFFAF6] px-4 py-2.5 text-sm text-[#592803] placeholder-[#C4A898] outline-none transition focus:border-[#592803] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
 
                <div className="my-5 border-t border-[#4B3A46]/10" />
 
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A08070] mb-3">
                  Order Summary
                </p>
 
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#4B3A46]">
                    <span>Full Access — {current.label}</span>
                    <span>USD {current.total}</span>
                  </div>
                  {current.saving !== null && (
                    <div className="flex justify-between text-green-700">
                      <span>Annual discount</span>
                      <span>–USD {current.saving}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#4B3A46]/10 pt-3 font-bold text-[#592803]">
                    <span>Total Due</span>
                    <span>USD {current.total}</span>
                  </div>
                </div>
 
                <button
                  onClick={() => router.push("/dashboard")}
                  className="mt-6 w-full rounded-xl bg-[#592803] py-3 text-sm font-bold text-white shadow transition hover:bg-[#6e3303] active:scale-[0.98]"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
 
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
  annual:  { label: "Annual",  price: 200,  billed: "Billed annually, save more",      total: 200, saving: 40  },
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
}


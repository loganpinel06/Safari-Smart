"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardCard from "@/components/DashboardCard";

interface Topic {
  title: string;
  href: string;
  subtitle?: string;
  isfree?: boolean; // To be implemented in Supabase to control which topics are free or paid
}

interface TopicAccessProps {
  topics: Topic[];
  paymentHref?: string;
}

export default function TopicAccess({
  topics,
  paymentHref = "/payment",
}: TopicAccessProps) {
  const router = useRouter();
  const [lockedTopic, setLockedTopic] = useState<Topic | null>(null);

  return (
    <>
      {/* Cards Status */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic, index) => {
          const isLocked = !topic.isfree;
          return (
            <DashboardCard
              key={topic.title}
              title={topic.title}
              subtitle={topic.subtitle}
              href={isLocked ? undefined : topic.href}
              locked={isLocked}
              onLockedClick={isLocked ? () => setLockedTopic(topic) : undefined}
            />
          );
        })}
      </div>

      {/* Modal Access Implementation */}
      {lockedTopic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setLockedTopic(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#FFF1E5] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#592803]/10 text-2xl">
              🔒
            </div>

            {/* Heading */}
            <h2 className="text-center text-2xl font-extrabold text-[#592803]">
              Topic Locked
            </h2>
            <p className="mt-2 text-center text-sm text-[#4B3A46]">
              <span className="font-semibold">"{lockedTopic.title}"</span> is
              only available to subscribers. Upgrade to unlock this topic and
              more features for a better learning experience.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => router.push(paymentHref)}
                className="w-full rounded-xl bg-[#592803] py-3 text-sm font-bold text-white shadow transition hover:bg-[#6e3303]"
              >
                Subscribe Now
              </button>
              <button
                onClick={() => setLockedTopic(null)}
                className="w-full rounded-xl border border-[#592803]/20 py-3 text-sm font-semibold text-[#592803] transition hover:bg-[#592803]/5"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
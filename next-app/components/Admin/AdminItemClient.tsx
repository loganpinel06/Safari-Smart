//reusable client component for admin topic page to create lessons, quizzes, and exams
//to show the button

"use client";

import { useState } from "react";
import CreateItemModal from "./CreateItemModal";

type ItemType = "lesson" | "quiz" | "exam";

type AdminItemClientProps = {
  topicId: number;
  itemType: ItemType;
  buttonLabel?: string;
  size?: "default" | "large";
};

function CreateButtonIcon({
  itemType,
  className,
}: {
  itemType: ItemType;
  className: string;
}) {
  const svg = {
    className,
    fill: "none" as const,
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor" as const,
    "aria-hidden": true as const,
  };

  if (itemType === "lesson") {
    return (
      <svg {...svg}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    );
  }
  if (itemType === "quiz") {
    return (
      <svg {...svg}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    );
  }
  return (
    <svg {...svg}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6 9.75H12m7.5-3H12m-9.75 0H6m13.5-4.5v15.75a48.52 48.52 0 013.408-.982m0 0a48.475 48.475 0 00-5.593-11.04m7.5 0a48.475 48.475 0 00-5.593 11.04m7.5 0v6.375c0 .621-.504 1.125-1.125 1.125H5.625a1.125 1.125 0 01-1.125-1.125v-6.375m12-6.375v-1.5c0-.621-.504-1.125-1.125-1.125H8.25c-.621 0-1.125.504-1.125 1.125v1.5"
      />
    </svg>
  );
}

function largeSubtitle(itemType: ItemType): string {
  if (itemType === "lesson") return "Structured teaching content";
  if (itemType === "quiz") return "Questions & checkpoints";
  return "Full-topic assessment";
}

function largeCardClass(itemType: ItemType): string {
  if (itemType === "lesson") {
    return [
      "border-[#D4B878]/50 bg-gradient-to-br from-[#FFFDF8] via-[#FFF8E8] to-[#FFF1D0]",
      "shadow-[0_4px_20px_rgba(89,40,3,0.07)] hover:shadow-[0_12px_32px_rgba(89,40,3,0.12)]",
      "hover:border-[#B8953E]/70",
    ].join(" ");
  }
  if (itemType === "quiz") {
    return [
      "border-[#4B3A46]/18 bg-gradient-to-br from-white via-[#FFFBF8] to-[#F5EFEA]",
      "shadow-[0_4px_20px_rgba(75,58,70,0.06)] hover:shadow-[0_12px_32px_rgba(75,58,70,0.1)]",
      "hover:border-[#592803]/35",
    ].join(" ");
  }
  return [
    "border-[#8B5E3C]/28 bg-gradient-to-br from-[#FFFAF5] to-[#F3E4D6]",
    "shadow-[0_4px_20px_rgba(89,40,3,0.07)] hover:shadow-[0_12px_32px_rgba(89,40,3,0.1)]",
    "hover:border-[#592803]/40",
  ].join(" ");
}

function largeIconWrap(itemType: ItemType): string {
  if (itemType === "lesson") {
    return "bg-[#FFF1B8] shadow-inner ring-1 ring-[#C4A035]/25";
  }
  if (itemType === "quiz") {
    return "bg-white shadow-inner ring-1 ring-[#4B3A46]/12";
  }
  return "bg-[#EDE0D4] shadow-inner ring-1 ring-[#8B5E3C]/22";
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#592803]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF1E5]";

export default function AdminItemClient({
  topicId,
  itemType,
  buttonLabel,
  size = "default",
}: AdminItemClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultLabel = `+ New ${itemType}`;
  const label = buttonLabel ?? defaultLabel;

  const largeShell = [
    "group relative flex min-h-[148px] w-full cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 px-6 py-8 text-center transition",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
    largeCardClass(itemType),
    focusRing,
  ].join(" ");

  const defaultShell = [
    "inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#592803] px-5 py-2.5 text-sm font-semibold text-white",
    "shadow-[0_2px_12px_rgba(89,40,3,0.25)] transition hover:bg-[#4B2920] hover:shadow-[0_4px_18px_rgba(89,40,3,0.32)] active:scale-[0.98]",
    focusRing,
  ].join(" ");

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={size === "large" ? largeShell : defaultShell}
      >
        {size === "large" ? (
          <>
            <div
              className={`flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-105 ${largeIconWrap(itemType)}`}
            >
              <CreateButtonIcon
                itemType={itemType}
                className="h-8 w-8 text-[#592803]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-lg font-bold leading-snug tracking-tight text-[#592803]">
                {label}
              </span>
              <span className="text-sm leading-snug text-[#4B3A46]/90">
                {largeSubtitle(itemType)}
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#592803]/55">
                Click to create
              </span>
            </div>
          </>
        ) : (
          <>
            <CreateButtonIcon itemType={itemType} className="h-4 w-4 text-white opacity-95" />
            <span>{label}</span>
          </>
        )}
      </button>
      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topicId={topicId}
        itemType={itemType}
      />
    </>
  );
}

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
};

export default function AdminItemClient({
  topicId,
  itemType,
  buttonLabel,
}: AdminItemClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultLabel = `+ New ${itemType}`;
  const label = buttonLabel ?? defaultLabel;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-[#592803] px-6 py-2 font-semibold text-white transition hover:bg-[#4B3A46]"
      >
        {label}
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

"use client";

import { useState } from "react";
import CreateLessonModal from "./CreateLessonModal";

type AdminLessonsClientProps = {
  topicId: number;
  buttonLabel?: string;
};

export default function AdminLessonsClient({
  topicId,
  buttonLabel = "+ New lesson",
}: AdminLessonsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-[#592803] px-6 py-2 font-semibold text-white transition hover:bg-[#4B3A46]"
      >
        {buttonLabel}
      </button>
      <CreateLessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topicId={topicId}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import CreateLessonPageModal from "./CreateLessonPageModal";

type AdminLessonPagesClientProps = {
  lessonId: number;
  defaultOrder: number;
  buttonLabel?: string;
};

export default function AdminLessonPagesClient({
  lessonId,
  defaultOrder,
  buttonLabel = "+ Create page",
}: AdminLessonPagesClientProps) {
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
      <CreateLessonPageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lessonId={lessonId}
        defaultOrder={defaultOrder}
      />
    </>
  );
}

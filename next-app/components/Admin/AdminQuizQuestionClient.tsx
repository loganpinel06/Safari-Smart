"use client";

import { useState } from "react";
import CreateQuizQuestionModal from "./CreateQuizQuestionModal";

type AdminQuizQuestionClientProps = {
  quizId: number;
  defaultOrder: number;
  buttonLabel?: string;
};

export default function AdminQuizQuestionClient({
  quizId,
  defaultOrder,
  buttonLabel = "+ Create question",
}: AdminQuizQuestionClientProps) {
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
      <CreateQuizQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quizId={quizId}
        defaultOrder={defaultOrder}
      />
    </>
  );
}

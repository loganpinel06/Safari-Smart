//admin client for exam questions
"use client";

import { useState } from "react";
import CreateExamQuestionModal from "./CreateExamQuestionModal";

type AdminExamQuestionClientProps = {
  examId: number;
  defaultOrder: number;
  buttonLabel?: string;
};

export default function AdminExamQuestionClient({
  examId,
  defaultOrder,
  buttonLabel = "+ Create question",
}: AdminExamQuestionClientProps) {
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
      <CreateExamQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        examId={examId}
        defaultOrder={defaultOrder}
      />
    </>
  );
}

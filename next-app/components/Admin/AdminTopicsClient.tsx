"use client";

import { useState } from "react";
import CreateTopicModal from "./CreateTopicModal";

type AdminTopicsClientProps = {
  categoryId: number | null;
  buttonLabel?: string;
};

export default function AdminTopicsClient({
  categoryId,
  buttonLabel = "+ Create Topic",
}: AdminTopicsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-[#592803] px-6 py-2 font-semibold text-white transition hover:bg-[#4B3A46]"
      >
        {buttonLabel}
      </button>
      <CreateTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryId={categoryId}
      />
    </>
  );
}

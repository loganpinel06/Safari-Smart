"use client";

import { useState } from "react";
import CreateCategoryModal from "../CreateCategoryModal";

type AdminCategoriesClientProps = {
  parentId?: number | null;
  buttonLabel?: string;
};

export default function AdminCategoriesClient({
  parentId = null,
  buttonLabel = "+ Create Category",
}: AdminCategoriesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2 rounded-lg bg-[#592803] text-white font-semibold hover:bg-[#4B3A46] transition"
      >
        {buttonLabel}
      </button>
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentId={parentId}
      />
    </>
  );
}

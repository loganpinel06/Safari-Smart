"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { deleteAssignment } from "@/utils/assignments/util";

type DeleteAssignmentButtonProps = {
  assignmentId: number;
  classId: string;
};

export default function DeleteAssignmentButton({
  assignmentId,
  classId,
}: DeleteAssignmentButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    const result = await deleteAssignment(assignmentId);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Failed to delete assignment");
      return;
    }

    setIsOpen(false);
    router.push(`/class/${classId}`);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100"
      >
        Delete Assignment
      </button>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <ConfirmActionModal
        isOpen={isOpen}
        title="Delete Assignment?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={loading}
        onCancel={() => setIsOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

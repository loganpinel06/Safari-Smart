"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editAssignment } from "@/utils/assignments/util";

type EditAssignmentDueDateModalProps = {
  assignmentId: number;
  currentDueDate: string;
};

export default function EditAssignmentDueDateModal({
  assignmentId,
  currentDueDate,
}: EditAssignmentDueDateModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dueDate, setDueDate] = useState(currentDueDate.slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeModal() {
    setIsOpen(false);
    setError(null);
    setLoading(false);
  }

  async function handleSave() {
    setError(null);
    if (!dueDate.trim()) {
      setError("Due date is required");
      return;
    }

    setLoading(true);
    const result = await editAssignment({
      id: assignmentId,
      due_date: dueDate.trim(),
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Failed to update due date");
      return;
    }

    closeModal();
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-xl border border-[#4B3A46]/20 bg-white px-4 py-2 text-sm font-semibold text-[#592803] transition hover:bg-[#FFF1B8]"
      >
        Edit Due Date
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFF1E5] p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#592803]">Edit Due Date</h2>

            <div className="mt-4 space-y-2">
              <label className="text-sm font-semibold text-[#592803]">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex-1 rounded-lg border border-[#4B3A46]/20 px-4 py-2 font-semibold text-[#592803] transition hover:bg-[#FFF1B8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 rounded-lg bg-[#592803] px-4 py-2 font-semibold text-white transition hover:bg-[#4B3A46] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

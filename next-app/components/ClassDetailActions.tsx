"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteClass, leaveClass } from "@/utils/classes/util";
import ConfirmActionModal from "@/components/ConfirmActionModal";

type ClassDetailActionsProps = {
  classId: string;
  showLeave: boolean;
  showDelete: boolean;
};

export default function ClassDetailActions({
  classId,
  showLeave,
  showDelete,
}: ClassDetailActionsProps) {
  const router = useRouter();
  const [loadingLeave, setLoadingLeave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleLeave() {
    setError(null);
    setLoadingLeave(true);
    const result = await leaveClass(classId);
    setLoadingLeave(false);

    if (!result.success) {
      setError(result.error ?? "Failed to leave class");
      return;
    }

    router.push("/class");
    router.refresh();
  }

  async function handleDelete() {
    setError(null);
    setLoadingDelete(true);
    const result = await deleteClass(classId);
    setLoadingDelete(false);

    if (!result.success) {
      setError(result.error ?? "Failed to delete class");
      return;
    }

    router.push("/class");
    router.refresh();
  }

  if (!showLeave && !showDelete) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showLeave && (
        <button
          type="button"
          onClick={() => setShowLeaveConfirm(true)}
          disabled={loadingLeave}
          className="cursor-pointer rounded-xl border border-[#4B3A46]/25 bg-white px-4 py-2 text-sm font-semibold text-[#592803] shadow-sm transition hover:-translate-y-0.5 hover:border-[#592803]/40 hover:bg-[#FFF1E5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingLeave ? "Leaving…" : "Leave class"}
        </button>
      )}
      {showDelete && (
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={loadingDelete}
          className="cursor-pointer rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingDelete ? "Deleting…" : "Delete class"}
        </button>
      )}
      {error && <p className="w-full text-sm text-red-700">{error}</p>}

      <ConfirmActionModal
        isOpen={showLeaveConfirm}
        title="Leave Class?"
        message="You will be removed from this class and will lose direct access to its assignments."
        confirmLabel="Leave Class"
        variant="default"
        isLoading={loadingLeave}
        onCancel={() => setShowLeaveConfirm(false)}
        onConfirm={async () => {
          setShowLeaveConfirm(false);
          await handleLeave();
        }}
      />

      <ConfirmActionModal
        isOpen={showDeleteConfirm}
        title="Delete Class?"
        message="This action cannot be undone. The class and all enrollments in it will be removed."
        confirmLabel="Delete Class"
        variant="danger"
        isLoading={loadingDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          setShowDeleteConfirm(false);
          await handleDelete();
        }}
      />
    </div>
  );
}

//component for displaying delete button for exams in the admin exam page.
//handles opening the delete confirmation dialog, as well as making the API call to delete the exam.

"use client";

import EntityActionButtons from "./EntityActionButtons";
import DeleteActionDialog from "./DeleteActionDialog";
import { useDeleteAction } from "@/hooks/useDeleteAction";

type DeleteExamClientProps = {
  examId: number;
  topicId: number;
};

export default function DeleteExamClient({
  examId,
  topicId,
}: DeleteExamClientProps) {
  const {
    isDeleteOpen,
    isDeleting,
    deleteError,
    resetAndOpen,
    closeIfIdle,
    runDelete,
  } = useDeleteAction();

  const handleDelete = async () => {
    await runDelete({
      endpoint: "/api/exam/delete",
      payload: { id: examId, topic_id: topicId },
      fallbackError: "Failed to delete exam",
      onSuccess: () => {
        window.location.href = `/admin-topic/${topicId}`;
      },
    });
  };

  return (
    <>
      <EntityActionButtons
        onDelete={resetAndOpen}
        deleteLabel="Delete exam"
        compact={false}
      />

      <DeleteActionDialog
        isOpen={isDeleteOpen}
        title="Delete exam"
        defaultMessage="Are you sure you want to delete this exam? All questions will also be deleted. This action cannot be undone."
        confirmLabel="Delete exam"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeIfIdle}
      />
    </>
  );
}

//component for displaying delete button for quizzes in the admin quiz page.
//handles opening the delete confirmation dialog, as well as making the API call to delete the quiz.

"use client";

import EntityActionButtons from "./EntityActionButtons";
import DeleteActionDialog from "./DeleteActionDialog";
import { useDeleteAction } from "@/hooks/useDeleteAction";

type DeleteQuizClientProps = {
  quizId: number;
  topicId: number;
};

export default function DeleteQuizClient({
  quizId,
  topicId,
}: DeleteQuizClientProps) {
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
      endpoint: "/api/quiz/delete",
      payload: { id: quizId, topic_id: topicId },
      fallbackError: "Failed to delete quiz",
      onSuccess: () => {
        window.location.href = `/admin-topic/${topicId}`;
      },
    });
  };

  return (
    <>
      <EntityActionButtons
        onDelete={resetAndOpen}
        deleteLabel="Delete quiz"
        compact={false}
      />

      <DeleteActionDialog
        isOpen={isDeleteOpen}
        title="Delete quiz"
        defaultMessage="Are you sure you want to delete this quiz? All questions will also be deleted. This action cannot be undone."
        confirmLabel="Delete quiz"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeIfIdle}
      />
    </>
  );
}

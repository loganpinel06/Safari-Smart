//component for displaying delete button for quizzes in the admin quiz page.
//handles opening the delete confirmation dialog, as well as making the API call to delete the quiz.

"use client";

import EntityActionButtons from "./EntityActionButtons";
import DeleteActionDialog from "./DeleteActionDialog";
import { useDeleteAction } from "@/hooks/useDeleteAction";

type DeleteLessonClientProps = {
  lessonId: number;
  topicId: number;
};

export default function DeleteLessonClient({
  lessonId,
  topicId,
}: DeleteLessonClientProps) {
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
      endpoint: "/api/lesson/delete",
      payload: { id: lessonId, topic_id: topicId },
      fallbackError: "Failed to delete lesson",
      onSuccess: () => {
        window.location.href = `/admin-topic/${topicId}`;
      },
    });
  };

  return (
    <>
      <EntityActionButtons
        onDelete={resetAndOpen}
        deleteLabel="Delete lesson"
        compact={false}
      />

      <DeleteActionDialog
        isOpen={isDeleteOpen}
        title="Delete lesson"
        defaultMessage="Delete this lesson and all of its lesson pages? This action cannot be undone."
        confirmLabel="Delete lesson"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeIfIdle}
      />
    </>
  );
}

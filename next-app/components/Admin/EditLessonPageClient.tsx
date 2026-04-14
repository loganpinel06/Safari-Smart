//component for displaying edit and delete buttons for lesson pages in the admin lesson page.
//handles opening the edit modal and delete confirmation dialog, as well as making the API call to delete the page.

"use client";

import { useState } from "react";
import EditLessonPageModal from "./EditLessonPageModal";
import { type EditableLessonPage } from "./LessonPageModal";
import EntityActionButtons from "./EntityActionButtons";
import DeleteActionDialog from "./DeleteActionDialog";
import { useDeleteAction } from "@/hooks/useDeleteAction";

//typing for props passed to the EditLessonPageClient component.
type EditLessonPageClientProps = {
  lessonId: number;
  page: EditableLessonPage;
};

export default function EditLessonPageClient({
  lessonId,
  page,
}: EditLessonPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      endpoint: "/api/lesson/page/delete",
      payload: { id: page.id, lesson_id: lessonId },
      fallbackError: "Failed to delete lesson page",
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  return (
    <>
      <EntityActionButtons
        onEdit={() => setIsModalOpen(true)}
        onDelete={resetAndOpen}
        editLabel="Edit page"
        deleteLabel="Delete page"
        compact={false}
      />

      <DeleteActionDialog
        isOpen={isDeleteOpen}
        title="Delete lesson page"
        defaultMessage="Are you sure you want to delete this lesson page? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeIfIdle}
      />

      <EditLessonPageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lessonId={lessonId}
        page={page}
      />
    </>
  );
}

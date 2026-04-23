//component for displaying edit and delete buttons for lessons, quizzes, and exams
//handles opening the edit modal and delete confirmation dialog, as well as making the API call to delete the item

"use client";

import { useState } from "react";
import EditItemModal, { type EditableItem } from "./EditItemModal";
import EntityActionButtons from "./EntityActionButtons";
import DeleteActionDialog from "./DeleteActionDialog";
import { useDeleteAction } from "@/hooks/useDeleteAction";

type ItemType = "lesson" | "quiz" | "exam";

type EditItemClientProps = {
  item: EditableItem;
  itemType: ItemType;
  topicId: number;
  deleteMessage?: string;
  compact?: boolean;
};

export default function EditItemClient({
  item,
  itemType,
  topicId,
  deleteMessage,
  compact = true,
}: EditItemClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    isDeleteOpen,
    isDeleting,
    deleteError,
    resetAndOpen,
    closeIfIdle,
    runDelete,
  } = useDeleteAction();

  const itemTypeCapitalized =
    itemType.charAt(0).toUpperCase() + itemType.slice(1);

  const defaultDeleteMessage =
    itemType === "lesson"
      ? "Delete this lesson and all of its lesson pages? This action cannot be undone."
      : itemType === "quiz"
        ? "Are you sure you want to delete this quiz? All questions will also be deleted. This action cannot be undone."
        : "Are you sure you want to delete this exam? All questions will also be deleted. This action cannot be undone.";

  const handleDelete = async () => {
    await runDelete({
      endpoint: `/api/${itemType}/delete`,
      payload: { id: item.id, topic_id: topicId },
      fallbackError: `Failed to delete ${itemType}`,
      onSuccess: () => {
        window.location.href = `/admin-topic/${topicId}`;
      },
    });
  };

  return (
    <>
      <EntityActionButtons
        onEdit={() => setIsModalOpen(true)}
        onDelete={resetAndOpen}
        editLabel={`Edit ${itemType}`}
        deleteLabel={`Delete ${itemType}`}
        compact={compact}
      />

      <DeleteActionDialog
        isOpen={isDeleteOpen}
        title={`Delete ${itemType}`}
        defaultMessage={deleteMessage || defaultDeleteMessage}
        confirmLabel={`Delete ${itemType}`}
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeIfIdle}
      />

      <EditItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        itemType={itemType}
      />
    </>
  );
}

//component for displaying edit and delete options in a vertical 3-dot menu dropdown

"use client";

import { useRef, useState } from "react";
import EditItemModal, { type EditableItem } from "./EditItemModal";
import DeleteActionDialog from "./DeleteActionDialog";
import { useDeleteAction } from "@/hooks/useDeleteAction";

type ItemType = "lesson" | "quiz" | "exam";

type ItemActionsMenuProps = {
  item: EditableItem;
  itemType: ItemType;
  topicId: number;
};

export default function ItemActionsMenu({
  item,
  itemType,
  topicId,
}: ItemActionsMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleEdit = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = () => {
    resetAndOpen();
    setIsMenuOpen(false);
  };

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
      <div className={`relative ${isMenuOpen ? "z-50" : "z-20"}`} ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#592803] transition hover:bg-[#FFF1B8]/60"
          aria-label="Actions"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-0.9 2-2s-0.9-2-2-2-2 0.9-2 2 0.9 2 2 2zm0 2c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zm0 6c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z" />
          </svg>
        </button>

        {isMenuOpen && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full z-50 mt-2 w-max rounded-lg border border-[#4B3A46]/15 bg-white shadow-lg">
              <button
                type="button"
                onClick={handleEdit}
                className="block w-full px-4 py-2 text-left text-sm font-medium text-[#592803] transition hover:bg-[#FFF1B8]/40 first:rounded-t-lg"
              >
                Edit {itemType}
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="block w-full px-4 py-2 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 last:rounded-b-lg"
              >
                Delete {itemType}
              </button>
            </div>
          </>
        )}
      </div>

      <DeleteActionDialog
        isOpen={isDeleteOpen}
        title={`Delete ${itemType}`}
        defaultMessage={defaultDeleteMessage}
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

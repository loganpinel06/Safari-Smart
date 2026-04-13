//reusable component for edit and delete buttons used for lessons, pages, quizzes, and exam actions in the admin pages.

"use client";

type EntityActionButtonsProps = {
  onEdit?: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  compact?: boolean;
};

export default function EntityActionButtons({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  compact = true,
}: EntityActionButtonsProps) {
  const sizeClass = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const containerClass = compact ? "flex gap-2" : "flex flex-wrap gap-2";

  return (
    <div className={containerClass}>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className={`rounded-lg border border-[#592803]/20 font-semibold text-[#592803] transition hover:bg-[#FFF1B8] ${sizeClass}`}
        >
          {editLabel}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onDelete}
        className={`rounded-lg border border-red-300 font-semibold text-red-700 transition hover:bg-red-50 ${sizeClass}`}
      >
        {deleteLabel}
      </button>
    </div>
  );
}

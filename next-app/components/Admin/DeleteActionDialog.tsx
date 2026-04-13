//component for handling deleting actions in the admin pages for lessons, quizzes, and exams.
//It displays a delete button, and when clicked, it opens a confirmation dialog.

"use client";

import ConfirmActionModal from "@/components/ConfirmActionModal";

type DeleteActionDialogProps = {
  isOpen: boolean;
  title: string;
  defaultMessage: string;
  confirmLabel: string;
  isLoading: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteActionDialog({
  isOpen,
  title,
  defaultMessage,
  confirmLabel,
  isLoading,
  error,
  onConfirm,
  onCancel,
}: DeleteActionDialogProps) {
  return (
    <ConfirmActionModal
      isOpen={isOpen}
      title={title}
      message={error ?? defaultMessage}
      confirmLabel={confirmLabel}
      variant="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

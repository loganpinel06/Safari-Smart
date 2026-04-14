//custom hook for handling delete actions in the admin pages for lessons, quizzes, and exams.
//it manages the state for the delete confirmation dialog, the loading state for the delete action, and any errors that may occur during the delete process.
//it also provides a function to run the delete action, which makes an API call to the specified endpoint with the provided payload, and handles success and error cases.

"use client";

import { useState } from "react";

type DeletePayloadValue = string | number;

type UseDeleteActionParams = {
  endpoint: string;
  payload: Record<string, DeletePayloadValue>;
  fallbackError: string;
  onSuccess: () => void;
};

export function useDeleteAction() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const resetAndOpen = () => {
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const closeIfIdle = () => {
    if (isDeleting) return;
    setIsDeleteOpen(false);
    setDeleteError(null);
  };

  const runDelete = async ({
    endpoint,
    payload,
    fallbackError,
    onSuccess,
  }: UseDeleteActionParams) => {
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || fallbackError);
      }

      onSuccess();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "An error occurred");
      setIsDeleting(false);
    }
  };

  return {
    isDeleteOpen,
    isDeleting,
    deleteError,
    resetAndOpen,
    closeIfIdle,
    runDelete,
  };
}

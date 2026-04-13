//component for displaying edit and delete buttons for quiz questions in the admin quiz page.
//handles opening the edit modal and delete confirmation dialog, as well as making the API call to delete the question.

"use client";

import { useState } from "react";
import QuizQuestionModal from "./QuizQuestionModal";
import { type EditableQuizQuestion } from "./QuizQuestionModal";
import EntityActionButtons from "./EntityActionButtons";
import DeleteActionDialog from "./DeleteActionDialog";
import { useDeleteAction } from "@/hooks/useDeleteAction";

type EditQuizQuestionClientProps = {
  quizId: number;
  question: EditableQuizQuestion;
};

export default function EditQuizQuestionClient({
  quizId,
  question,
}: EditQuizQuestionClientProps) {
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
      endpoint: "/api/quiz/question/delete",
      payload: { id: question.id, quiz_id: quizId },
      fallbackError: "Failed to delete quiz question",
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
        editLabel="Edit"
        deleteLabel="Delete"
      />

      <QuizQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quizId={quizId}
        mode="edit"
        question={question}
      />

      <DeleteActionDialog
        isOpen={isDeleteOpen}
        title="Delete quiz question"
        defaultMessage="Are you sure you want to delete this quiz question? This action cannot be undone."
        confirmLabel="Delete question"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeIfIdle}
      />
    </>
  );
}

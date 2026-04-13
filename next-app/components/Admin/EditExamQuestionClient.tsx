//component for displaying edit and delete buttons for exam questions in the admin exam page.
//handles opening the edit modal and delete confirmation dialog, as well as making the API call to delete the question.

"use client";

import { useState } from "react";
import ExamQuestionModal from "./ExamQuestionModal";
import { type EditableExamQuestion } from "./ExamQuestionModal";
import EntityActionButtons from "./EntityActionButtons";
import DeleteActionDialog from "./DeleteActionDialog";
import { useDeleteAction } from "@/hooks/useDeleteAction";

type EditExamQuestionClientProps = {
  examId: number;
  question: EditableExamQuestion;
};

export default function EditExamQuestionClient({
  examId,
  question,
}: EditExamQuestionClientProps) {
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
      endpoint: "/api/exam/question/delete",
      payload: { id: question.id, exam_id: examId },
      fallbackError: "Failed to delete exam question",
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

      <ExamQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        examId={examId}
        mode="edit"
        question={question}
      />

      <DeleteActionDialog
        isOpen={isDeleteOpen}
        title="Delete exam question"
        defaultMessage="Are you sure you want to delete this exam question? This action cannot be undone."
        confirmLabel="Delete question"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeIfIdle}
      />
    </>
  );
}

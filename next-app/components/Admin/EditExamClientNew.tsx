//component for displaying edit and delete buttons for exams in the admin-exam page
//wrapper around EditItemClient for type safety and consistency

"use client";

import EditItemClient from "./EditItemClient";
import { type EditableItem } from "./EditItemModal";

type EditExamClientProps = {
  exam: EditableItem;
  topicId: number;
  compact?: boolean;
};

export default function EditExamClient({
  exam,
  topicId,
  compact = true,
}: EditExamClientProps) {
  return (
    <EditItemClient
      item={exam}
      itemType="exam"
      topicId={topicId}
      compact={compact}
    />
  );
}

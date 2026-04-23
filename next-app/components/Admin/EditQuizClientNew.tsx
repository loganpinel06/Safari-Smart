//component for displaying edit and delete buttons for quizzes in the admin-quiz page
//wrapper around EditItemClient for type safety and consistency

"use client";

import EditItemClient from "./EditItemClient";
import { type EditableItem } from "./EditItemModal";

type EditQuizClientProps = {
  quiz: EditableItem;
  topicId: number;
  compact?: boolean;
};

export default function EditQuizClient({
  quiz,
  topicId,
  compact = true,
}: EditQuizClientProps) {
  return (
    <EditItemClient
      item={quiz}
      itemType="quiz"
      topicId={topicId}
      compact={compact}
    />
  );
}

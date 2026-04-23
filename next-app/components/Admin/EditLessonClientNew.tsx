//component for displaying edit and delete buttons for lessons in the admin-lesson page
//wrapper around EditItemClient for type safety and consistency

"use client";

import EditItemClient from "./EditItemClient";
import { type EditableItem } from "./EditItemModal";

type EditLessonClientProps = {
  lesson: EditableItem;
  topicId: number;
  compact?: boolean;
};

export default function EditLessonClient({
  lesson,
  topicId,
  compact = true,
}: EditLessonClientProps) {
  return (
    <EditItemClient
      item={lesson}
      itemType="lesson"
      topicId={topicId}
      compact={compact}
    />
  );
}

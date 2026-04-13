"use client";

import LessonPageModal from "./LessonPageModal";

//typing for props passed to the CreateLessonPageModal component.
type CreateLessonPageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  defaultOrder: number;
};

export default function CreateLessonPageModal({
  isOpen,
  onClose,
  lessonId,
  defaultOrder,
}: CreateLessonPageModalProps) {
  return (
    <LessonPageModal
      isOpen={isOpen}
      onClose={onClose}
      lessonId={lessonId}
      mode="create" //notice mode
      defaultOrder={defaultOrder}
    />
  );
}

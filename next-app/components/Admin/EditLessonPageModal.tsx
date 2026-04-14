//modal for editing lesson pages, used in the admin lesson page.
//It is a wrapper around the LessonPageModal component, which is used for both creating and editing lesson pages.
//The mode is determined by the props passed to it, and it pre-populates the form with the existing page data when in edit mode.

"use client";

import LessonPageModal, { type EditableLessonPage } from "./LessonPageModal";

//typing for props passed to the EditLessonPageModal component.
type EditLessonPageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  page: EditableLessonPage;
};

export default function EditLessonPageModal({
  isOpen,
  onClose,
  lessonId,
  page,
}: EditLessonPageModalProps) {
  return (
    <LessonPageModal
      isOpen={isOpen}
      onClose={onClose}
      lessonId={lessonId}
      mode="edit" //notice mode
      page={page}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SectionCard from "@/components/SectionCard";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import type { LessonPageDetail } from "@/utils/lesson/util";
import { getSignedUrlFromStoredPath } from "@/utils/files/getFile";
import { supabase } from "@/utils/supabase/client";
import { markLessonAsComplete } from "@/utils/progress/lesson/util";

type LessonSlidesClientProps = {
  pages: LessonPageDetail[];
  topicId: number | null;
  lessonId: number;
  userId: string;
  initiallyCompleted: boolean;
};

export default function LessonSlidesClient({
  pages,
  topicId,
  lessonId,
  userId,
  initiallyCompleted,
}: LessonSlidesClientProps) {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [signedMediaUrl, setSignedMediaUrl] = useState<string | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initiallyCompleted);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const hasPages = pages.length > 0;
  const current = hasPages ? pages[pageIndex] : null;
  const isLast = hasPages && pageIndex >= pages.length - 1;
  const isFirst = pageIndex <= 0;

  const progressPercent = hasPages ? ((pageIndex + 1) / pages.length) * 100 : 0;

  const goToTopicOrDashboard = () => {
    if (topicId != null && Number.isFinite(topicId)) {
      router.push(`/topic/${topicId}`);
    } else {
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (!hasPages) {
      goToTopicOrDashboard();
      return;
    }
    if (isFirst) {
      goToTopicOrDashboard();
      return;
    }
    setPageIndex((i) => i - 1);
  };

  const handleNext = async () => {
    if (!hasPages) {
      goToTopicOrDashboard();
      return;
    }
    if (isLast) {
      if (
        !isCompleted &&
        !isMarkingComplete &&
        topicId != null &&
        Number.isFinite(topicId)
      ) {
        setIsMarkingComplete(true);
        const result = await markLessonAsComplete({
          user_id: userId,
          topic_id: topicId,
          lesson_id: lessonId,
        });
        if (result.success) {
          setIsCompleted(true);
        }
        setIsMarkingComplete(false);
      }
      goToTopicOrDashboard();
      return;
    }
    setPageIndex((i) => i + 1);
  };

  const nextLabel = !hasPages ? "Back" : isLast ? "Finish Lesson" : "Next";

  const mediaPath =
    current &&
    (current.type === "Image" || current.type === "Video") &&
    current.path
      ? current.path.trim()
      : null;

  useEffect(() => {
    if (!mediaPath) {
      setSignedMediaUrl(null);
      setMediaLoading(false);
      return;
    }

    let cancelled = false;
    setSignedMediaUrl(null);
    setMediaLoading(true);

    void (async () => {
      const url = await getSignedUrlFromStoredPath(supabase(), mediaPath);
      if (!cancelled) {
        setSignedMediaUrl(url);
        setMediaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mediaPath]);

  if (!hasPages || !current) {
    return (
      <SectionCard className="flex flex-col gap-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3EFEA]">
          <div className="h-full w-0 rounded-full bg-[#6AC700]" />
        </div>
        <p className="text-sm text-[#592803]">
          There are no lesson pages for this lesson yet. When your teacher adds
          slides, they will appear here.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#592803]/10 pt-6">
          <button
            type="button"
            onClick={goToTopicOrDashboard}
            className="rounded-xl border-2 border-[#4B3A46]/25 bg-white/80 px-5 py-3 font-semibold text-[#592803] transition hover:border-[#592803]/40"
          >
            Back To Topic
          </button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="flex flex-col gap-0 overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3EFEA]">
          <div
            className="h-full rounded-full bg-[#592803] transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-right text-xs font-medium text-[#592803]">
          Slide {pageIndex + 1} of {pages.length}
        </p>
      </div>

      <div className="flex min-h-[260px] w-full flex-col justify-center md:min-h-[400px]">
        {current.type === "Text" && (
          <div className="flex flex-2 rounded-2xl bg-white border-4 border-[#EAD9C8] px-6 py-8 md:px-10 md:py-12">
            <p className="text-base sm:text-lg leading-relaxed text-[#2d2d3a] whitespace-pre-wrap text-justify hyphens-auto font-normal">
              {current.main_text ?? "No text content for this page."}
            </p>
          </div>
        )}

        {current.type === "Image" && (
          <div className="flex flex-2 rounded-2xl font-semibold bg-white border-2 border-[#EAD9C8] px-6 py-8 md:px-10 md:py-12">
            {mediaLoading ? (
              <p className="text-center text-sm text-[#592803]">
                Loading image…
              </p>
            ) : signedMediaUrl ? (
              <img
                src={signedMediaUrl}
                alt=""
                className="max-h-[min(70vh,560px)] w-full max-w-full rounded-2xl object-contain"
              />
            ) : (
              <p className="text-center text-sm text-[#592803]">
                Image is not available for this page.
              </p>
            )}
          </div>
        )}

        {current.type === "Video" && (
          <div className="flex flex-2 rounded-2xl font-semibold bg-white border-2 border-[#EAD9C8] px-6 py-8 md:px-10 md:py-12">
            {mediaLoading ? (
              <p className="text-center text-sm text-[#592803]">
                Loading video…
              </p>
            ) : signedMediaUrl ? (
              <video
                src={signedMediaUrl}
                controls
                className="max-h-[min(70vh,560px)] w-full max-w-4xl rounded-2xl bg-black/90"
              />
            ) : (
              <div className="w-full max-w-4xl">
                <VideoPlaceholder />
              </div>
            )}
          </div>
        )}
      </div>

      {current.sub_text ? (
        <p className="border-l-2 border-[#E0C9B3] pl-4 ml-1 text-base leading-relaxed font-stretch-semi-expanded text-[#8B6040] italic">
          {current.sub_text}
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#592803]/10 pt-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 rounded-xl border border-[#4B3A46]/15 bg-white/70 px-5 py-3 font-semibold text-[#4B3A46] transition hover:opacity-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {isFirst ? "Back To Topic" : "Back"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isLast && isMarkingComplete}
          className="flex items-center gap-2 rounded-xl bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] transition hover:opacity-90"
        >
          {nextLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </SectionCard>
  );
}

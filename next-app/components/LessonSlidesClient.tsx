"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SectionCard from "@/components/SectionCard";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import type { LessonPageDetail } from "@/utils/lesson/util";
import { getSignedUrlFromStoredPath } from "@/utils/files/getFile";
import { supabase } from "@/utils/supabase/client";


type LessonSlidesClientProps = {
  pages: LessonPageDetail[];
  topicId: number | null;
};

export default function LessonSlidesClient({
  pages,
  topicId,
}: LessonSlidesClientProps) {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [signedMediaUrl, setSignedMediaUrl] = useState<string | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);

  const hasPages = pages.length > 0;
  const current = hasPages ? pages[pageIndex] : null;
  const isLast = hasPages && pageIndex >= pages.length - 1;
  const isFirst = pageIndex <= 0;

  const progressPercent = hasPages
    ? ((pageIndex + 1) / pages.length) * 100
    : 0;

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

  const handleNext = () => {
    if (!hasPages) {
      goToTopicOrDashboard();
      return;
    }
    if (isLast) {
      goToTopicOrDashboard();
      return;
    }
    setPageIndex((i) => i + 1);
  };

  const nextLabel = !hasPages ? "BACK" : isLast ? "FINISH LESSON" : "NEXT";

  const pageForMedia = hasPages ? pages[pageIndex] : null;
  const mediaFetchKey =
    pageForMedia &&
    (pageForMedia.type === "Image" || pageForMedia.type === "Video") &&
    pageForMedia.path
      ? `${pageForMedia.id}\u001f${pageForMedia.path}`
      : null;

  useEffect(() => {
    if (!mediaFetchKey) {
      setSignedMediaUrl(null);
      setMediaLoading(false);
      return;
    }

    const sep = mediaFetchKey.indexOf("\u001f");
    const pathInLesson =
      sep === -1 ? null : mediaFetchKey.slice(sep + 1);
    if (!pathInLesson) {
      setSignedMediaUrl(null);
      setMediaLoading(false);
      return;
    }

    let cancelled = false;
    setSignedMediaUrl(null);
    setMediaLoading(true);

    void (async () => {
      const url = await getSignedUrlFromStoredPath(supabase(), pathInLesson);
      if (!cancelled) {
        setSignedMediaUrl(url);
        setMediaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mediaFetchKey]);

  if (!hasPages || !current) {
    return (
      <SectionCard className="flex flex-col gap-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3EFEA]">
          <div className="h-full w-0 rounded-full bg-[#6AC700]" />
        </div>
        <p className="text-sm text-[#4B3A46]">
          There are no lesson pages for this lesson yet. When your teacher adds
          slides, they will appear here.
        </p>
        <div className="flex flex-wrap items-center justify-end gap-4 border-t border-[#4B3A46]/10 pt-6">
          <button
            type="button"
            onClick={goToTopicOrDashboard}
            className="rounded-xl border-2 border-[#4B3A46]/25 bg-white/80 px-5 py-3 font-semibold text-[#592803] transition hover:border-[#592803]/40"
          >
            BACK TO TOPIC
          </button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3EFEA]">
          <div
            className="h-full rounded-full bg-[#6AC700] transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-right text-xs font-medium text-[#4B3A46]">
          {pageIndex + 1} / {pages.length}
        </p>
      </div>

      <div className="flex min-h-[320px] w-full flex-col justify-center md:min-h-[400px]">
        {current.type === "Text" && (
          <div className="flex flex-2 rounded-2xl font-semibold bg-[#F3EFEA] px-6 py-8 md:px-10 md:py-12">
            <p className="text-lg leading-8 text-[#3a3b4b] whitespace-pre-wrap md:text-xl md:leading-9">
              {current.main_text ?? "No text content for this page."}
            </p>
          </div>
        )}

        {current.type === "Image" && (
          <div className="flex min-h-[280px] flex-1 items-center justify-center md:min-h-[360px]">
            {mediaLoading ? (
              <p className="text-center text-sm text-[#4B3A46]">
                Loading image…
              </p>
            ) : signedMediaUrl ? (
              <img
                src={signedMediaUrl}
                alt=""
                className="max-h-[min(70vh,560px)] w-full max-w-full rounded-2xl object-contain"
              />
            ) : (
              <p className="text-center text-sm text-[#4B3A46]">
                Image is not available for this page.
              </p>
            )}
          </div>
        )}

        {current.type === "Video" && (
          <div className="flex w-full flex-1 items-center justify-center">
            {mediaLoading ? (
              <p className="text-center text-sm text-[#4B3A46]">
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
        <p className="border-t border-[#592803]/10 pt-4 text-sm leading-7 font-semibold text-[#4B3A46]">
          {current.sub_text}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#592803]/10 pt-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 rounded-xl border-2 border-[#4B3A46]/25 bg-[#FFF1E5] px-5 py-3 font-semibold text-[#4B3A46] transition hover:border-[#592803]/40"
        >
          {isFirst ? "BACK TO TOPIC" : "BACK"}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl bg-[#6AC700] px-5 py-3 font-semibold text-white transition hover:bg-[#5bb000]"
        >
          {nextLabel}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </SectionCard>
  );
}

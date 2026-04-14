//outline component used for both creating and editing lesson pages
"use client";

import { useEffect, useState } from "react";

export type LessonPageModalType = "Text" | "Image" | "Video";
type ModalPanel = "editing" | "preview";

//typing for the lesson page data used in the edit form
export type EditableLessonPage = {
  id: number;
  type: LessonPageModalType;
  order: number;
  main_text: string | null;
  sub_text: string | null;
  path: string | null;
};

//typing for props
type LessonPageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  mode: "create" | "edit";
  defaultOrder?: number;
  page?: EditableLessonPage;
};

export default function LessonPageModal({
  isOpen,
  onClose,
  lessonId,
  mode, //mode is either "create" or "edit" to determine form behavior
  defaultOrder = 0,
  page,
}: LessonPageModalProps) {
  const isEdit = mode === "edit";

  const [pageType, setPageType] = useState<LessonPageModalType>(
    isEdit ? (page?.type ?? "Text") : "Text",
  );
  const [order, setOrder] = useState(
    String(isEdit ? (page?.order ?? 0) : defaultOrder),
  );
  const [mainText, setMainText] = useState(
    isEdit ? (page?.main_text ?? "") : "",
  );
  const [subText, setSubText] = useState(isEdit ? (page?.sub_text ?? "") : "");
  const [file, setFile] = useState<File | null>(null);
  const [mediaObjectUrl, setMediaObjectUrl] = useState<string | null>(null);

  const [panel, setPanel] = useState<ModalPanel>("editing");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!file) {
      setMediaObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setMediaObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit) {
      setPageType(page?.type ?? "Text");
      setOrder(String(page?.order ?? 0));
      setMainText(page?.main_text ?? "");
      setSubText(page?.sub_text ?? "");
    } else {
      setPageType("Text");
      setOrder(String(defaultOrder));
      setMainText("");
      setSubText("");
    }

    setFile(null);
    setError(null);
    setSuccess(false);
    setPanel("editing");
  }, [isOpen, isEdit, page, defaultOrder]);

  const handleTypeChange = (t: LessonPageModalType) => {
    setPageType(t);
    setFile(null);
    if (t !== "Text") setMainText("");
  };

  const hasExistingMedia =
    isEdit &&
    (pageType === "Image" || pageType === "Video") &&
    page?.type === pageType &&
    Boolean(page.path);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const orderNum = Number.parseInt(order.trim(), 10);
    if (!Number.isFinite(orderNum)) {
      setError("Order must be a valid number");
      return;
    }

    if (pageType === "Text" && !mainText.trim()) {
      setError("Main text is required for Text pages");
      return;
    }

    if (
      (pageType === "Image" || pageType === "Video") &&
      (!file || file.size === 0) &&
      !hasExistingMedia
    ) {
      setError(`Please choose a valid ${pageType.toLowerCase()} file`);
      return;
    }

    if (isEdit && !page) {
      setError("Page data is required to edit");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("type", pageType);
      formData.append("lesson_id", lessonId.toString());
      formData.append("order", String(orderNum));

      if (isEdit && page) {
        formData.append("id", page.id.toString());
      }

      if (subText.trim()) formData.append("sub_text", subText.trim());

      if (pageType === "Text") {
        formData.append("main_text", mainText.trim());
      } else if (file) {
        formData.append("file", file);
      }

      const endpoint = isEdit
        ? "/api/lesson/page/update"
        : "/api/lesson/page/create";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(
          data.error ||
            (isEdit
              ? "Failed to update lesson page"
              : "Failed to create lesson page"),
        );
      }

      setSuccess(true);

      setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setFile(null);
    onClose();
  };

  if (!isOpen) return null;

  const imageAccept =
    "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml";
  const videoAccept = "video/mp4,video/webm,video/quicktime";

  const title = isEdit ? "Edit lesson page" : "Create lesson page";
  const subtitle = isEdit
    ? "Update content and preview before saving."
    : "Switch between editing and preview.";
  const successMessage = isEdit
    ? "Page updated successfully!"
    : "Page created successfully!";
  const submitLabel = isEdit ? "Save changes" : "Create page";
  const loadingLabel = isEdit ? "Saving..." : "Creating...";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-[#FFF1E5] shadow-lg">
        <div className="border-b border-[#4B3A46]/15 px-6 py-4">
          <h2 className="text-xl font-bold text-[#592803] md:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#4B3A46]">{subtitle}</p>
        </div>

        <div
          className="flex border-b border-[#4B3A46]/15 px-6 py-3"
          role="tablist"
          aria-label="Editing or preview"
        >
          <div className="grid w-full grid-cols-2 gap-2 rounded-xl border border-[#4B3A46]/15 bg-white/70 p-1">
            <button
              type="button"
              role="tab"
              aria-selected={panel === "editing"}
              onClick={() => setPanel("editing")}
              className={`rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                panel === "editing"
                  ? "bg-[#592803] text-white shadow-sm"
                  : "text-[#4B3A46] hover:bg-[#FFF1B8]/80"
              }`}
            >
              Editing
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={panel === "preview"}
              onClick={() => setPanel("preview")}
              className={`rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                panel === "preview"
                  ? "bg-[#592803] text-white shadow-sm"
                  : "text-[#4B3A46] hover:bg-[#FFF1B8]/80"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {panel === "editing" ? (
            <div className="flex flex-col gap-4 p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <fieldset className="flex flex-col gap-2">
                  <legend className="text-sm font-semibold text-[#592803]">
                    Type
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {(["Text", "Image", "Video"] as const).map((t) => (
                      <label
                        key={t}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          pageType === t
                            ? "border-[#592803] bg-[#FFF1B8] text-[#592803]"
                            : "border-[#4B3A46]/20 bg-white/80 text-[#4B3A46] hover:border-[#592803]/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pageType"
                          value={t}
                          checked={pageType === t}
                          onChange={() => handleTypeChange(t)}
                          className="sr-only"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#592803]">
                    Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    min={0}
                    className="w-full rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                    disabled={loading}
                  />
                </div>

                {pageType === "Text" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#592803]">
                      Main text
                    </label>
                    <textarea
                      value={mainText}
                      onChange={(e) => setMainText(e.target.value)}
                      rows={6}
                      placeholder="Primary content for this page"
                      className="w-full resize-y rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                      disabled={loading}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#592803]">
                      {pageType} file
                    </label>
                    <input
                      type="file"
                      accept={pageType === "Image" ? imageAccept : videoAccept}
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="text-sm text-[#592803] file:mr-3 file:rounded-lg file:border-0 file:bg-[#592803] file:px-3 file:py-2 file:font-semibold file:text-white"
                      disabled={loading}
                    />
                    <p className="text-xs text-[#4B3A46]">
                      {pageType === "Image"
                        ? "JPEG, PNG, WebP, GIF, or SVG."
                        : "MP4, WebM, or QuickTime (.mov)."}
                    </p>
                    {hasExistingMedia && !file && (
                      <p className="text-xs text-[#4B3A46]">
                        No new file selected. Existing media will be kept.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#592803]">
                    Sub text{" "}
                    <span className="font-normal text-[#4B3A46]">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={subText}
                    onChange={(e) => setSubText(e.target.value)}
                    rows={3}
                    placeholder="Supporting text below the main section"
                    className="w-full resize-y rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-green-100 p-3 text-sm text-green-800">
                    {successMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-[#4B3A46]/20 px-4 py-2 font-semibold text-[#592803] transition hover:bg-[#FFF1B8] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-[#592803] px-4 py-2 font-semibold text-white transition hover:bg-[#4B3A46] disabled:opacity-50"
                  >
                    {loading ? loadingLabel : submitLabel}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-6">
              <div className="flex min-h-70 flex-1 flex-col rounded-xl border border-[#4B3A46]/15 bg-white/90 p-4 shadow-inner">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {pageType === "Text" && (
                    <div className="text-[#592803]">
                      {mainText.trim() ? (
                        <p className="whitespace-pre-wrap text-base leading-relaxed">
                          {mainText}
                        </p>
                      ) : (
                        <p className="text-sm italic text-[#4B3A46]/70">
                          Main text will appear here.
                        </p>
                      )}
                    </div>
                  )}

                  {pageType === "Image" && (
                    <div className="flex justify-center">
                      {mediaObjectUrl ? (
                        <img
                          src={mediaObjectUrl}
                          alt="Preview"
                          className="max-h-64 w-full max-w-md rounded-lg object-contain"
                        />
                      ) : (
                        <p className="text-sm italic text-[#4B3A46]/70">
                          {hasExistingMedia
                            ? "Existing image will be kept if you do not upload a replacement."
                            : "Choose an image to preview."}
                        </p>
                      )}
                    </div>
                  )}

                  {pageType === "Video" && (
                    <div className="flex justify-center">
                      {mediaObjectUrl ? (
                        <video
                          src={mediaObjectUrl}
                          controls
                          className="max-h-64 w-full max-w-md rounded-lg"
                        />
                      ) : (
                        <p className="text-sm italic text-[#4B3A46]/70">
                          {hasExistingMedia
                            ? "Existing video will be kept if you do not upload a replacement."
                            : "Choose a video to preview."}
                        </p>
                      )}
                    </div>
                  )}

                  {subText.trim() ? (
                    <p className="mt-4 whitespace-pre-wrap border-t border-[#4B3A46]/10 pt-4 text-sm leading-relaxed text-[#4B3A46]">
                      {subText}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 border-t border-[#4B3A46]/10 pt-4">
                  <div
                    className="w-full rounded-lg bg-[#592803] px-4 py-2.5 text-center text-sm font-semibold text-white/90"
                    aria-hidden="true"
                  >
                    Next
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

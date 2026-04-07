"use client";

import { useEffect, useMemo, useState } from "react";

type QuizQuestionModalType = "Text" | "Image" | "Video";
type ModalPanel = "editing" | "preview";

type CreateQuizQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quizId: number;
  defaultOrder: number;
};

export default function CreateQuizQuestionModal({
  isOpen,
  onClose,
  quizId,
  defaultOrder,
}: CreateQuizQuestionModalProps) {
  const [questionType, setQuestionType] =
    useState<QuizQuestionModalType>("Text");
  const [order, setOrder] = useState(String(defaultOrder));
  const [mainText, setMainText] = useState("");
  const [question, setQuestion] = useState("");
  const [choicesInput, setChoicesInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mediaObjectUrl, setMediaObjectUrl] = useState<string | null>(null);

  const [panel, setPanel] = useState<ModalPanel>("editing");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const parsedChoices = useMemo(
    () =>
      choicesInput
        .split("\n")
        .map((choice) => choice.trim())
        .filter(Boolean),
    [choicesInput],
  );

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
    setQuestionType("Text");
    setOrder(String(defaultOrder));
    setMainText("");
    setQuestion("");
    setChoicesInput("");
    setFile(null);
    setError(null);
    setSuccess(false);
    setPanel("editing");
  }, [isOpen, defaultOrder]);

  const handleTypeChange = (type: QuizQuestionModalType) => {
    setQuestionType(type);
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const orderNum = Number.parseInt(order.trim(), 10);
    if (!Number.isFinite(orderNum)) {
      setError("Order must be a valid number");
      return;
    }

    if (!question.trim()) {
      setError("Question is required");
      return;
    }

    if (parsedChoices.length < 2) {
      setError("Please provide at least 2 choices (one per line)");
      return;
    }

    if (
      (questionType === "Image" || questionType === "Video") &&
      (!file || file.size === 0)
    ) {
      setError(`Please choose a valid ${questionType.toLowerCase()} file`);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("type", questionType);
      formData.append("quiz_id", quizId.toString());
      formData.append("order", String(orderNum));
      formData.append("question", question.trim());
      formData.append("choices", JSON.stringify(parsedChoices));
      if (mainText.trim()) formData.append("main_text", mainText.trim());
      if (file) formData.append("file", file);

      const response = await fetch("/api/quiz/question/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Failed to create quiz question");
      }

      setSuccess(true);
      setMainText("");
      setQuestion("");
      setChoicesInput("");
      setFile(null);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-[#FFF1E5] shadow-lg">
        <div className="border-b border-[#4B3A46]/15 px-6 py-4">
          <h2 className="text-xl font-bold text-[#592803] md:text-2xl">
            Create quiz question
          </h2>
          <p className="mt-1 text-sm text-[#4B3A46]">
            Switch between editing and preview.
          </p>
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
                    {(["Text", "Image", "Video"] as const).map((type) => (
                      <label
                        key={type}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          questionType === type
                            ? "border-[#592803] bg-[#FFF1B8] text-[#592803]"
                            : "border-[#4B3A46]/20 bg-white/80 text-[#4B3A46] hover:border-[#592803]/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="questionType"
                          value={type}
                          checked={questionType === type}
                          onChange={() => handleTypeChange(type)}
                          className="sr-only"
                        />
                        {type}
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

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#592803]">
                    Main text{" "}
                    <span className="font-normal text-[#4B3A46]">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={mainText}
                    onChange={(e) => setMainText(e.target.value)}
                    rows={3}
                    placeholder="Optional top text before the question"
                    className="w-full resize-y rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                    disabled={loading}
                  />
                </div>

                {questionType === "Text" ? null : (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#592803]">
                      {questionType} file
                    </label>
                    <input
                      type="file"
                      accept={
                        questionType === "Image" ? imageAccept : videoAccept
                      }
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="text-sm text-[#592803] file:mr-3 file:rounded-lg file:border-0 file:bg-[#592803] file:px-3 file:py-2 file:font-semibold file:text-white"
                      disabled={loading}
                    />
                    <p className="text-xs text-[#4B3A46]">
                      {questionType === "Image"
                        ? "JPEG, PNG, WebP, GIF, or SVG."
                        : "MP4, WebM, or QuickTime (.mov)."}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#592803]">
                    Question
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    placeholder="Enter the question text"
                    className="w-full resize-y rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#592803]">
                    Choices{" "}
                    <span className="font-normal text-[#4B3A46]">
                      (one per line)
                    </span>
                  </label>
                  <textarea
                    value={choicesInput}
                    onChange={(e) => setChoicesInput(e.target.value)}
                    rows={6}
                    placeholder={"Choice 1\nChoice 2\nChoice 3\nChoice 4"}
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
                    Question created successfully!
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
                    {loading ? "Creating..." : "Create question"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-6">
              <div className="flex min-h-70 flex-1 flex-col rounded-xl border border-[#4B3A46]/15 bg-white/90 p-4 shadow-inner">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {mainText.trim() ? (
                    <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-[#4B3A46]">
                      {mainText}
                    </p>
                  ) : null}

                  {questionType === "Image" && (
                    <div className="mb-4 flex justify-center">
                      {mediaObjectUrl ? (
                        <img
                          src={mediaObjectUrl}
                          alt="Preview"
                          className="max-h-64 w-full max-w-md rounded-lg object-contain"
                        />
                      ) : (
                        <p className="text-sm italic text-[#4B3A46]/70">
                          Choose an image to preview.
                        </p>
                      )}
                    </div>
                  )}

                  {questionType === "Video" && (
                    <div className="mb-4 flex justify-center">
                      {mediaObjectUrl ? (
                        <video
                          src={mediaObjectUrl}
                          controls
                          className="max-h-64 w-full max-w-md rounded-lg"
                        />
                      ) : (
                        <p className="text-sm italic text-[#4B3A46]/70">
                          Choose a video to preview.
                        </p>
                      )}
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-[#592803]">
                    {question.trim() || "Question text will appear here."}
                  </h3>

                  <div className="mt-4 grid gap-2">
                    {parsedChoices.length > 0 ? (
                      parsedChoices.map((choice, index) => (
                        <div
                          key={`${choice}-${index}`}
                          className="rounded-lg border border-[#4B3A46]/15 bg-[#FFF1B8]/30 px-3 py-2 text-sm text-[#592803]"
                        >
                          {choice}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm italic text-[#4B3A46]/70">
                        Choices will appear here.
                      </p>
                    )}
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

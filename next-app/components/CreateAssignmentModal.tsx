"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createAssignment } from "@/utils/assignments/util";
import { supabase } from "@/utils/supabase/client";

type TopicOption = {
  id: number;
  name: string;
};

type CreateAssignmentModalProps = {
  classId: string;
};

export default function CreateAssignmentModal({ classId }: CreateAssignmentModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return topics;
    return topics.filter((topic) => topic.name.toLowerCase().includes(query));
  }, [search, topics]);

  const selectedTopicName =
    topics.find((topic) => topic.id === selectedTopicId)?.name ?? null;

  function closeModal() {
    setIsOpen(false);
    setSearch("");
    setSelectedTopicId(null);
    setDueDate("");
    setError(null);
    setLoading(false);
  }

  async function openModal() {
    setIsOpen(true);
    setError(null);
    setLoadingTopics(true);

    const { data, error: topicsError } = await supabase()
      .from("topic")
      .select("id, name")
      .order("name", { ascending: true });

    if (topicsError) {
      setTopics([]);
      setError("Failed to load topics");
    } else {
      const nextTopics = (data ?? [])
        .filter(
          (topic: any) =>
            Number.isFinite(Number(topic.id)) && typeof topic.name === "string",
        )
        .map((topic: any) => ({
          id: Number(topic.id),
          name: topic.name,
        }));
      setTopics(nextTopics);
    }

    setLoadingTopics(false);
  }

  async function handleCreate() {
    setError(null);

    const classIdNum = Number.parseInt(classId, 10);
    if (!Number.isFinite(classIdNum) || !selectedTopicId || !dueDate.trim()) {
      setError("Select a topic and due date");
      return;
    }

    setLoading(true);
    const result = await createAssignment({
      class_id: classIdNum,
      topic_id: selectedTopicId,
      due_date: dueDate.trim(),
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Failed to create assignment");
      return;
    }

    closeModal();
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-xl bg-[#FFF1B8] px-4 py-2 text-sm font-semibold text-[#592803] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFE78A] hover:shadow-md"
      >
        Create Assignment
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-[#FFF1E5] p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-[#592803]">Create Assignment</h2>
            <p className="mt-1 text-sm text-[#4B3A46]">
              Pick a topic, then set a due date.
            </p>

            <div className="mt-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics..."
                className="w-full rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                disabled={loading || loadingTopics}
                autoFocus
              />
            </div>

            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-[#4B3A46]/15 bg-white/70 p-3">
              {loadingTopics ? (
                <p className="px-2 py-3 text-sm text-[#4B3A46]">Loading topics...</p>
              ) : filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => {
                  const isSelected = selectedTopicId === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedTopicId(topic.id)}
                      disabled={loading || loadingTopics}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? "border-[#592803]/45 bg-[#FFF1B8] text-[#592803]"
                          : "border-[#4B3A46]/15 bg-white text-[#592803] hover:bg-[#FFF7D3]"
                      }`}
                    >
                      {topic.name}
                    </button>
                  );
                })
              ) : (
                <p className="px-2 py-3 text-sm text-[#4B3A46]">
                  No topics match your search.
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-sm font-semibold text-[#592803]">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                disabled={loading || loadingTopics}
              />
              {selectedTopicName && (
                <p className="text-xs text-[#4B3A46]">Selected topic: {selectedTopicName}</p>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading || loadingTopics}
                className="flex-1 rounded-lg border border-[#4B3A46]/20 px-4 py-2 font-semibold text-[#592803] transition hover:bg-[#FFF1B8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={loading || loadingTopics}
                className="flex-1 rounded-lg bg-[#592803] px-4 py-2 font-semibold text-white transition hover:bg-[#4B3A46] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

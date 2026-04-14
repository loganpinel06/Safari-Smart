"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateClassModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Class name is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());

      const response = await fetch("/api/classes/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Failed to create class");
      }

      setIsOpen(false);
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full cursor-pointer rounded-xl bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFE78A] hover:shadow-md"
      >
        Create Class
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFF1E5] p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-[#592803]">
              Create Class
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#592803]">
                  Class Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter class name"
                  className="w-full rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError(null);
                    setName("");
                  }}
                  disabled={loading}
                  className="cursor-pointer flex-1 rounded-lg border border-[#4B3A46]/20 px-4 py-2 font-semibold text-[#592803] transition hover:bg-[#FFF1B8] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer flex-1 rounded-lg bg-[#592803] px-4 py-2 font-semibold text-white transition hover:bg-[#4B3A46] disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

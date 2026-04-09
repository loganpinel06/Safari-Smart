"use client";

import { useState } from "react";

export function useCreateCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [parentId, setParentId] = useState<number | null>(null);

  const open = (parentId?: number) => {
    if (parentId) setParentId(parentId);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setParentId(null);
  };

  return { isOpen, open, close, parentId };
}

type CreateCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentId?: number | null;
};

export default function CreateCategoryModal({
  isOpen,
  onClose,
  parentId = null,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (parentId) {
        formData.append("parent_id", parentId.toString());
      }

      const response = await fetch("/api/category/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      setSuccess(true);
      setName("");

      // Refresh the page after success
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-[#FFF1E5] p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#592803] mb-4">
          Create New Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#592803] mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-2 rounded-lg border border-[#4B3A46]/20 bg-white text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-100 p-3 text-sm text-green-800">
              Category created successfully!
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg border border-[#4B3A46]/20 text-[#592803] font-semibold hover:bg-[#FFF1B8] transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-[#592803] text-white font-semibold hover:bg-[#4B3A46] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

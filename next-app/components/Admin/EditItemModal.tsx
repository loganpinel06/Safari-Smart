//reusable modal component for editing lessons, quizzes, and exams

"use client";

import { useEffect, useState } from "react";

type ItemType = "lesson" | "quiz" | "exam";

export type EditableItem = {
  id: number;
  name: string;
  order: number;
};

type EditItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: EditableItem;
  itemType: ItemType;
};

export default function EditItemModal({
  isOpen,
  onClose,
  item,
  itemType,
}: EditItemModalProps) {
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const itemTypeCapitalized =
    itemType.charAt(0).toUpperCase() + itemType.slice(1);

  useEffect(() => {
    if (isOpen) {
      setName(item.name);
      setOrder(String(item.order));
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim() || order.trim() === "") {
      setError("Name and order are required");
      return;
    }

    const orderNum = Number.parseInt(order.trim(), 10);
    if (!Number.isFinite(orderNum) || orderNum < 0) {
      setError("Order must be a valid non-negative number");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", item.id.toString());
      formData.append("name", name.trim());
      formData.append("order", order.trim());

      const response = await fetch(`/api/${itemType}/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || `Failed to update ${itemType}`);
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setOrder("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#FFF1E5] p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-[#592803]">
          Edit {itemTypeCapitalized}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#592803]">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${itemType} name`}
              className="w-full rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#592803]">
              Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="Enter display order"
              className="w-full rounded-lg border border-[#4B3A46]/20 bg-white px-4 py-2 text-[#592803] placeholder-[#4B3A46]/50 focus:outline-none focus:ring-2 focus:ring-[#592803]/40"
              disabled={loading}
              min="0"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-600">
                {itemTypeCapitalized} updated successfully!
              </p>
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
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

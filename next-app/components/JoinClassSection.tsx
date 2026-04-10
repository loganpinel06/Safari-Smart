"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinClassWithCode } from "@/utils/classes/util";

type JoinClassSectionProps = {
  helperText?: string;
};

export default function JoinClassSection({
  helperText = "Enter a class code from your teacher to join a class.",
}: JoinClassSectionProps) {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoinClass(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!joinCode.trim()) {
      setError("Please enter a class code.");
      return;
    }

    setIsLoading(true);
    const result = await joinClassWithCode(joinCode);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Failed to join class.");
      return;
    }

    setJoinCode("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[#592803]">Join a Class</h2>
        <p className="mt-1 text-sm text-[#4B3A46]">{helperText}</p>
      </div>

      <form onSubmit={handleJoinClass} className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter class code"
          className="flex-1 rounded-xl border border-[#4B3A46]/15 bg-white px-4 py-3 text-[#592803] outline-none focus:border-[#592803]"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-xl bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFE78A] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Joining..." : "Join Class"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
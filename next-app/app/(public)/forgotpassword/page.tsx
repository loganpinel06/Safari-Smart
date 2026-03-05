"use client";
import Image from "next/image";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = "/verifycode";
  };

  return (
    /* Default Background */
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803] antialiased">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-20">

        {/* Navigation Bar */}
        <header className="max-w-5xl mx-auto px-6 pt-6 pb-4 border-b border-[#4B3A46]/10">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/sslogo.png"
                alt="Safari Smart logo"
                width={80}
                height={80}
                priority
                className="rounded-full"
              />
              <span className="font-extrabold text-4xl tracking-tight">
                Safari Smart
              </span>
            </div>

            <div className="flex items-center gap-4 text-md">
              <a href="/" className="hover:underline">
                Home
              </a>
              <a
                href="/signup"
                className="px-4 py-1 rounded-full border border-[#592803] hover:bg-[#592803] hover:text-white transition"
              >
                Sign up
              </a>
            </div>
          </nav>
        </header>

        {/* Forgot Password Form */}
        <section className="flex justify-center">
          <div className="bg-white/70 rounded-xl p-10 w-full max-w-xl shadow-md space-y-6">
            <h1 className="text-3xl font-bold text-center">
              Forgot Password?
            </h1>
            <p className="text-center text-med text-[#592803]/60">
              Enter your email address and we'll send you a code to reset your password.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@gmail.com"
                  required
                  autoComplete="email"
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#6AC700] text-white font-semibold hover:bg-[#5bb000] transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending code..." : "Send Code"}
              </button>

            </form>
          </div>
        </section>

      </div>
    </main>
  );
}
"use client";
import Image from "next/image";
import { useState } from "react";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code === "123456") {
    window.location.href = "/resetpassword"; // your next page
  } else {
    alert("Invalid code. Try 123456");
  }
    //console.log("Verify code:", code); // can replace test code with actual verification logic
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

        {/* Verify Code Form */}
        <section className="flex justify-center">
          <div className="bg-white/70 rounded-xl p-10 w-full max-w-xl shadow-md space-y-6">
            <h1 className="text-3xl font-bold text-center">
              Verify Your Code
            </h1>
            <p className="text-center text-med text-[#592803]/60">
              Enter the 6 digit code from your email.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Verification Code</label>
                <input
                  name="code"
                  type="text"
                  value={code}
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#6AC700] text-white font-semibold hover:bg-[#5bb000] transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying code..." : "Verify Code"}
              </button>

            </form>
          </div>
        </section>

      </div>
    </main>
  );
}
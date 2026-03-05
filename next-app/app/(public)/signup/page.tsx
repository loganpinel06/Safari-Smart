"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function Page() {
  //get the router for navigation after successful sign up
  const router = useRouter();
  //state variables for the form fields
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [test, setTest] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //sign up with supabase logic
  //get the client
  const supabaseClient = supabase();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    //sign up the user with supabase
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    //return any errors
    if (error) {
      alert(error.message);
      return;
    }

    //send the user data to backend route to be added to the 'users' table in the database
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName,
        exam_type: role === "Student" ? test : null,
        account_type: role,
      }),
    });

    //check if the backend returned an error and alert the user if so
    const responseData = await response.json();
    if (!response.ok) {
      alert(responseData.error || "An error occurred during sign up");
      setLoading(false);
      return;
    }

    //if successful, send to dashboard
    router.replace("/dashboard");
    setLoading(false);
  };
  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803] antialiased">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        {/* Nav bar */}
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
                href="/signin"
                className="px-4 py-1 rounded-full border border-[#592803] hover:bg-[#592803] hover:text-white transition"
              >
                Sign in
              </a>
            </div>
          </nav>
        </header>

        {/* Sign Up Form */}
        <section className="flex justify-center">
          <div className="bg-white/70 rounded-xl p-10 w-full max-w-xl shadow-md space-y-6">
            <h1 className="text-3xl font-bold text-center">
              Create Your Account
            </h1>

            <form className="space-y-5" onSubmit={handleSignUp}>
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                >
                  <option value="">Select your role</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">
                  Test You Are Taking
                </label>
                <input
                  type="text"
                  placeholder="BECE or WASSCE"
                  value={test}
                  onChange={(e) => setTest(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-semibold transition
  ${
    loading
      ? "bg-[#4f9800] cursor-not-allowed"
      : "bg-[#6AC700] hover:bg-[#5bb000] cursor-pointer"
  }`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

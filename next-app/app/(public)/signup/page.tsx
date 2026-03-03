import Image from "next/image";

export default function Page() {
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

            <form className="space-y-5">

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Role</label>
                <select
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Test You Are Taking</label>
                <input
                  type="text"
                  placeholder="BECE or WASSCE"
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="px-4 py-2 rounded-lg border border-[#4B3A46]/20 focus:outline-none focus:ring-2 focus:ring-[#6AC700]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#6AC700] text-white font-semibold hover:bg-[#5bb000] transition"
              >
                Sign Up
              </button>

            </form>
          </div>
        </section>

      </div>
    </main>
  );
}
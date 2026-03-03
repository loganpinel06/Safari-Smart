export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Student Dashboard</h1>
          <p className="text-sm text-[#4B3A46]">(Mock data for now)</p>
        </header>

        <section className="bg-white/70 rounded-xl p-6">
          <h2 className="text-xl font-bold">Welcome back!</h2>
          <p className="text-sm text-[#4B3A46] mt-1">
            Exam track: <strong>BECE</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Subjects</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#FFF1B8] rounded-xl p-5">
              <h3 className="font-bold">English</h3>
              <p className="text-sm text-[#4B3A46] mt-1">Lessons • Quizzes • Writing</p>
            </div>
            <div className="bg-[#FFF1B8] rounded-xl p-5">
              <h3 className="font-bold">Mathematics</h3>
              <p className="text-sm text-[#4B3A46] mt-1">Practice sets • Progress</p>
            </div>
            <div className="bg-[#FFF1B8] rounded-xl p-5">
              <h3 className="font-bold">Science</h3>
              <p className="text-sm text-[#4B3A46] mt-1">Topics • Quizzes</p>
            </div>
          </div>
        </section>

        <section className="bg-white/70 rounded-xl p-6 space-y-2">
          <h2 className="text-xl font-bold">Progress</h2>
          <p className="text-sm text-[#4B3A46]">
            Lessons completed: <strong>3 / 10</strong>
          </p>
          <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
            <div className="h-3 bg-[#6AC700] w-[30%]" />
          </div>
        </section>
      </div>
    </main>
  );
}
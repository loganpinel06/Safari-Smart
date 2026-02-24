import Image from "next/image";

/**
 * Safari Smart landing page (before login page)
 * Basic html content and structure
 */



export default function Home() {
  return (
    <main className = "min-h-screen bg-[#FFF1E5] text-[#592803] antialiased">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-20">
      {/* Top navigation bar */}
      <header className="max-w-5xl mx-auto px-6 pt-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/sslogo.png"
              alt="Safari Smart logo"
              width={48}
              height={48}
              priority
            />
            <span className="font-bold text-xl">Safari Smart</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#features" className="hover:underline">
              Features
            </a>
            <a href="#audience" className="hover:underline">
              Who it’s for
            </a>

            <a
              href="/signin"
              className="px-4 py-1 rounded-full border border-[#592803] hover:bg-[#592803] hover:text-white transition">
              Sign in
            </a>

            <a
              href="/signup"
              className="px-4 py-1 rounded-full bg-[#6AC700] text-white hover:bg-[#5bb000] transition">
              Sign up
            </a>
          </div>
          </nav>
        </header>


        {/* Main Content */}
      
        <section className="flex flex-col items-center text-center space-y-6 pt-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold max-w-3xl">
            Prep smarter for BECE & WASSCE.
          </h1>
          <p className="text-lg max-w-2xl">
            Safari Smart is a learning web application designed to help students prepare for
            BECE and WASSCE exams through structured lessons, practice questions, and
            progress tracking.
          </p>
        </section>

        <section
          id="features"
          className="bg-[#FFF1B8] rounded-xl p-10 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center">Features</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white/70 rounded-xl p-6">
              <h3 className="font-bold text-lg">Structured Lessons</h3>
              <p className="mt-2 text-sm">
                Short, focused lesson content designed for BECE and WASSCE exam preparation.
              </p>
            </div>

            <div className="bg-white/70 rounded-xl p-6">
              <h3 className="font-bold text-lg">Practice Quizzes</h3>
              <p className="mt-2 text-sm">
                Topic-based quizzes and question banks to reinforce learning and build confidence.
              </p>
            </div>

            <div className="bg-white/70 rounded-xl p-6">
              <h3 className="font-bold text-lg">Progress Tracking</h3>
              <p className="mt-2 text-sm">
                Track improvement over time with clear progress indicators and completed lessons.
              </p>
            </div>

            <div className="bg-white/70 rounded-xl p-6">
              <h3 className="font-bold text-lg">Teacher Feedback</h3>
              <p className="mt-2 text-sm">
                Teachers can review submissions and give feedback to help students improve.
              </p>
            </div>

            <div className="bg-white/70 rounded-xl p-6">
              <h3 className="font-bold text-lg">AI-Assisted Writing Support</h3>
              <p className="mt-2 text-sm">
                Artificial Intelligence writing feedback and suggestions to support essay improvement.
              </p>
            </div>

            <div className="bg-white/70 rounded-xl p-6">
              <h3 className="font-bold text-lg">Role-Based Access</h3>
              <p className="mt-2 text-sm">
                Separate student, teacher, and parent views with features tailored to each role.
              </p>
            </div>
          </div>
        </section>

        <section id="audience"
          className="space-y-10 pt-16">

          <h2 className="text-3xl font-bold text-center">
            Who Safari Smart Supports
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white/70 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/students2.jpg"
                alt="Students in classroom"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="font-bold text-lg">Students</h3>
                <p className="text-sm mt-2">
                  Structured lessons and practice quizzes designed specifically for BECE and WASSCE success.
                </p>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/students1.jpg"
                alt="Students studying"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="font-bold text-lg">Teachers</h3>
                <p className="text-sm mt-2">
                  Upload content, review submissions, and provide meaningful feedback.
                </p>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/students3.jpg"
                alt="Classroom environment"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="font-bold text-lg">Parents</h3>
                <p className="text-sm mt-2">
                  Monitor student progress and encourage consistent exam preparation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="get-started"
          className="bg-[#592803] text-[#FFF1E5] rounded-xl p-10 text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="max-w-2xl mx-auto">
            Create an account to begin studying for BECE and WASSCE with structured lessons and practice.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <a
              href="/signup"
              className="px-6 py-2 rounded-lg bg-[#6AC700] text-white font-semibold hover:bg-[#5bb000] transition"
            >
              Sign Up
            </a>
            <a
              href="/signin"
              className="px-6 py-2 rounded-lg border border-[#FFF1E5] hover:bg-[#FFF1E5] hover:text-[#592803] transition"
            >
              Sign In
            </a>
          </div>
        </section>

    </div>
  


    </main>
  );
}
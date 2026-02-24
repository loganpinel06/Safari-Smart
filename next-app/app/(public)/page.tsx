import Image from "next/image";

/**
 * Safari Smart landing page (before login page)
 * Basic html content and structure
 */



export default function Home() {
  return (
    <main className = "min-h-screen bg-[#FFF1E5] text-[#592803]">
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
        <div className="flex gap-4 text-sm">
              <a href="#features" className="hover:underline">
                Features
              </a>
              <a href="#audience" className="hover:underline">
                Who it’s for
              </a>
            </div>
          </nav>
        </header>


        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
          <section className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Prep smarter for BECE & WASSCE.
          </h1>
          <p className="text-lg max-w-2xl">
            Safari Smart is a learning web application designed to help students prepare for
            BECE and WASSCE exams through structured lessons, practice questions, and
            progress tracking.
          </p>
          </section>
        </div>


      {/** 
      <section>
        <h2>What Safari Smart does</h2>
        <ul className="list-disc pl-6">
          <li>Provides short lessons (text and/or video content)</li>
          <li>Gives quizzes and practice questions to reinforce learning</li>
          <li>Tracks progress so students can see improvement over time</li>
          <li>Supports teacher feedback and (later) AI-assisted grading for writing</li>
        </ul>
      </section>

      <section>
        <h2>Who it’s for</h2>
        <ul>
          <li>
            <strong>Students:</strong> learn content, take quizzes, and track progress
          </li>
          <li>
            <strong>Professors:</strong> upload content, review assignments, and give feedback
          </li>
          <li>
            <strong>Parents:</strong> view student progress and support studying
          </li>
        </ul>
      </section>
      */}
    


    </main>
  );
}
/**
 * Safari Smart landing page (before login page)
 * Basic html content and structure
 */

export default function Home() {
  return (
    <main>
      <header>
      <h1>Safari Smart</h1>
        <p>
          Safari Smart is a learning web application designed to help students prepare for
          BECE and WASSCE exams through structured lessons, practice questions, and
          progress tracking.
        </p>
      </header>

      <section>
        <h2>What Safari Smart does</h2>
        <ul className="list-disc pl-6">
          <li>Provides short lessons (text and/or video content)</li>
          <li>Gives quizzes and practice questions to reinforce learning</li>
          <li>Tracks progress so students can see improvement over time</li>
          <li>Supports teacher feedback and (later) AI-assisted grading for writing</li>
        </ul>
      </section>


    </main>
  );
}
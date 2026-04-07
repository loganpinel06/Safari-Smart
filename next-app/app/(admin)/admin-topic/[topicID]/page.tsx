import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminLessonsClient from "@/components/Admin/AdminLessonsClient";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTopicDetails } from "@/utils/topic/util";

function PlaceholderActionButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="rounded-lg bg-[#592803] px-6 py-2 font-semibold text-white opacity-60 cursor-not-allowed"
      aria-disabled="true"
    >
      {label}
    </button>
  );
}

export default async function AdminTopicPage({
  params,
}: {
  params: Promise<{ topicID: string }>;
}) {
  const supabase = await createClient();
  const topicID = (await params).topicID;
  const topicIdNum = Number.parseInt(topicID, 10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!Number.isFinite(topicIdNum)) {
    redirect("/admin-dashboard");
  }

  const { data: topic } = await supabase
    .from("topic")
    .select("name, category_id")
    .eq("id", topicIdNum)
    .single();

  const { data: category } = topic
    ? await supabase
        .from("category")
        .select("name, parent_id")
        .eq("id", topic.category_id)
        .single()
    : { data: null };

  const { data: subjectCategory } =
    category?.parent_id != null
      ? await supabase
          .from("category")
          .select("name")
          .eq("id", category.parent_id)
          .single()
      : { data: null };

  const { lessons, quizzes, exams } = await getTopicDetails(
    topicIdNum,
    supabase,
  );

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  const breadcrumbItems = [];
  if (subjectCategory?.name && category?.parent_id != null) {
    breadcrumbItems.push({
      label: subjectCategory.name,
      href: `/admin-dashboard/${category.parent_id}`,
    });
  }
  if (category?.name && topic?.category_id != null) {
    breadcrumbItems.push({
      label: category.name,
      href: `/admin-dashboard/${topic.category_id}`,
    });
  }
  breadcrumbItems.push({
    label: topic?.name ?? "Topic",
  });

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen">
        <div className="w-[320px]">
          <Sidebar
            userName={profile?.name ?? "Admin"}
            examTrack={profile?.exam_type ?? "BECE"}
            activeItem="Admin Dashboard"
            logoutAction={logout}
            profile={profile}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-6xl flex flex-col gap-8">
            <Breadcrumbs items={breadcrumbItems} />

            <PageHeader
              title={topic?.name ?? "Topic"}
              subtitle={
                category?.name
                  ? `${category.name} • Manage lessons, quizzes, and exams.`
                  : "Manage lessons, quizzes, and exams for this topic."
              }
            />

            <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Topic
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  {topic?.name ?? "Unknown topic"}
                </h2>
                <p className="text-sm text-[#4B3A46]">
                  Category:{" "}
                  <span className="font-semibold text-[#592803]">
                    {category?.name ?? "—"}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 md:w-[360px]">
                <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Lessons
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {lessons.length}
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Quizzes
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {quizzes.length}
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Exams
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {exams.length}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">Lessons</h2>
                  <p className="text-sm text-[#4B3A46] mt-1">
                    Ordered content for this topic.
                  </p>
                </div>
                <AdminLessonsClient topicId={topicIdNum} />
              </div>

              {lessons.length === 0 ? (
                <p className="text-sm text-[#4B3A46]">No lessons yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/admin-lesson/${lesson.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#4B3A46]/15 bg-white/60 px-4 py-3 transition hover:border-[#592803]/40 hover:bg-white/90"
                    >
                      <span className="font-semibold">{lesson.name}</span>
                      <span className="text-sm text-[#4B3A46]">
                        Order {lesson.order}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">Quizzes</h2>
                  <p className="text-sm text-[#4B3A46] mt-1">
                    Practice quizzes for this topic.
                  </p>
                </div>
                <PlaceholderActionButton label="+ New quiz" />
              </div>

              {quizzes.length === 0 ? (
                <p className="text-sm text-[#4B3A46]">No quizzes yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#4B3A46]/15 bg-white/60 px-4 py-3"
                    >
                      <span className="font-semibold">{quiz.name}</span>
                      <span className="text-sm text-[#4B3A46]">
                        Order {quiz.order}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">Exams</h2>
                  <p className="text-sm text-[#4B3A46] mt-1">
                    Exam-style material for this topic.
                  </p>
                </div>
                <PlaceholderActionButton label="+ New exam" />
              </div>

              {exams.length === 0 ? (
                <p className="text-sm text-[#4B3A46]">No exams yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#4B3A46]/15 bg-white/60 px-4 py-3"
                    >
                      <span className="font-semibold">{exam.name}</span>
                      <span className="text-sm text-[#4B3A46]">
                        Order {exam.order}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}

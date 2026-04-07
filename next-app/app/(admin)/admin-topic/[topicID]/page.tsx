import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminItemClient from "@/components/Admin/AdminItemClient";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTopicDetails, type TopicContentType } from "@/utils/topic/util";

function ContentTypeIcon({
  type,
  className,
}: {
  type: TopicContentType;
  className?: string;
}) {
  const common = className ?? "h-7 w-7 text-[#592803]";
  if (type === "lesson") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    );
  }
  if (type === "quiz") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6 9.75H12m7.5-3H12m-9.75 0H6m13.5-4.5v15.75a48.52 48.52 0 013.408-.982m0 0a48.475 48.475 0 00-5.593-11.04m7.5 0a48.475 48.475 0 00-5.593 11.04m7.5 0v6.375c0 .621-.504 1.125-1.125 1.125H5.625a1.125 1.125 0 01-1.125-1.125v-6.375m12-6.375v-1.5c0-.621-.504-1.125-1.125-1.125H8.25c-.621 0-1.125.504-1.125 1.125v1.5" />
    </svg>
  );
}

function typeLabel(type: TopicContentType): string {
  if (type === "lesson") return "Lesson";
  if (type === "quiz") return "Quiz";
  return "Exam";
}

function contentRowShell(type: TopicContentType, isLink: boolean): string {
  const lessonSurface =
    "border-2 border-[#D4B878]/50 bg-gradient-to-br from-[#FFFDF8] via-[#FFF8E8] to-[#FFF1D0] shadow-[0_4px_18px_rgba(89,40,3,0.06)]";
  const quizSurface =
    "border-2 border-[#4B3A46]/18 bg-gradient-to-br from-white via-[#FFFBF8] to-[#F5EFEA] shadow-[0_4px_18px_rgba(75,58,70,0.055)]";
  const examSurface =
    "border-2 border-[#8B5E3C]/28 bg-gradient-to-br from-[#FFFAF5] to-[#F3E4D6] shadow-[0_4px_18px_rgba(89,40,3,0.055)]";

  const typeSurface =
    type === "lesson"
      ? lessonSurface
      : type === "quiz"
        ? quizSurface
        : examSurface;

  const base =
    "flex items-center gap-4 rounded-2xl px-5 py-5 sm:gap-5 sm:px-6 sm:py-5 transition";

  if (!isLink) {
    return `${base} ${typeSurface}`;
  }

  const interactive =
    "cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#592803]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF1E5]";
  const motion =
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995]";
  const hoverGlow =
    type === "lesson"
      ? "hover:border-[#B8953E]/75 hover:shadow-[0_10px_28px_rgba(89,40,3,0.11)]"
      : "hover:border-[#592803]/38 hover:shadow-[0_10px_28px_rgba(75,58,70,0.09)]";

  return `${base} ${typeSurface} ${interactive} ${motion} ${hoverGlow}`;
}

function contentIconWrapClass(type: TopicContentType): string {
  if (type === "lesson") {
    return "bg-[#FFF1B8] shadow-inner ring-1 ring-[#C4A035]/25";
  }
  if (type === "quiz") {
    return "bg-white shadow-inner ring-1 ring-[#4B3A46]/12";
  }
  return "bg-[#EDE0D4] shadow-inner ring-1 ring-[#8B5E3C]/22";
}

function ContentRowChevron() {
  return (
    <span
      className="ml-auto flex shrink-0 text-[#592803]/35 transition group-hover:translate-x-0.5 group-hover:text-[#592803]/55"
      aria-hidden="true"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </span>
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

  const topicContent = await getTopicDetails(topicIdNum, supabase);
  const lessons = topicContent.filter((c) => c.type === "lesson");
  const quizzes = topicContent.filter((c) => c.type === "quiz");
  const exams = topicContent.filter((c) => c.type === "exam");

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
              <h2 className="text-lg font-bold text-[#592803]">Add content</h2>
              <p className="mt-1 text-sm text-[#4B3A46]">
                Create new items for this topic. They appear in the list below by order.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <AdminItemClient
                  topicId={topicIdNum}
                  itemType="lesson"
                  buttonLabel="New lesson"
                  size="large"
                />
                <AdminItemClient
                  topicId={topicIdNum}
                  itemType="quiz"
                  buttonLabel="New quiz"
                  size="large"
                />
                <button
                  type="button"
                  disabled
                  className="flex min-h-[148px] w-full cursor-not-allowed flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-[#4B3A46]/22 bg-gradient-to-br from-[#FAF7F4]/80 to-[#EDE8E4]/50 px-6 py-8 text-center text-[#592803] opacity-[0.72] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                  aria-disabled="true"
                >
                  <div className="flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-2xl bg-[#E8D4C4]/45 ring-1 ring-[#8B5E3C]/15">
                    <ContentTypeIcon
                      type="exam"
                      className="h-8 w-8 text-[#592803]/75"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-bold leading-snug tracking-tight">
                      New exam
                    </span>
                    <span className="text-sm text-[#4B3A46]/85">Coming soon</span>
                    <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#4B3A46]/45">
                      Not available yet
                    </span>
                  </div>
                </button>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#592803]">
                  Topic content
                </h2>
                <p className="mt-1 text-sm text-[#4B3A46]">
                  Lessons, quizzes, and exams in display order.
                </p>
              </div>

              {topicContent.length === 0 ? (
                <p className="text-sm text-[#4B3A46]">
                  No content yet. Use the buttons above to add a lesson or quiz.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {topicContent.map((item) => {
                    const isLink =
                      item.type === "lesson" || item.type === "quiz";
                    const shell = contentRowShell(item.type, isLink);
                    const inner = (
                      <>
                        <div
                          className={`flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-[1.02] ${contentIconWrapClass(item.type)}`}
                        >
                          <ContentTypeIcon
                            type={item.type}
                            className="h-8 w-8 text-[#592803]"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wider text-[#4B3A46]/90">
                                {typeLabel(item.type)}
                              </p>
                              <p className="mt-1 text-lg font-bold leading-snug tracking-tight text-[#592803]">
                                {item.name}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full border border-[#592803]/10 bg-white/55 px-3 py-1 text-xs font-bold tabular-nums text-[#592803] shadow-sm">
                              Order {item.order}
                            </span>
                          </div>
                        </div>
                        {isLink ? <ContentRowChevron /> : null}
                      </>
                    );

                    if (item.type === "lesson") {
                      return (
                        <Link
                          key={`lesson-${item.id}`}
                          href={`/admin-lesson/${item.id}`}
                          className={shell}
                        >
                          {inner}
                        </Link>
                      );
                    }
                    if (item.type === "quiz") {
                      return (
                        <Link
                          key={`quiz-${item.id}`}
                          href={`/admin-quiz/${item.id}`}
                          className={shell}
                        >
                          {inner}
                        </Link>
                      );
                    }
                    return (
                      <div key={`exam-${item.id}`} className={shell}>
                        {inner}
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}

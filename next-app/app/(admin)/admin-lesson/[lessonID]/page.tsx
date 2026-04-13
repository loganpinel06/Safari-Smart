import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminLessonPagesClient from "@/components/Admin/AdminLessonPagesClient";
import EditLessonPageClient from "@/components/Admin/EditLessonPageClient";
import DeleteLessonClient from "@/components/Admin/DeleteLessonClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getLessonPagesDetail } from "@/utils/lesson/util";

export default async function AdminLessonPage({
  params,
}: {
  params: Promise<{ lessonID: string }>;
}) {
  const supabase = await createClient();
  const lessonID = (await params).lessonID;
  const lessonIdNum = Number.parseInt(lessonID, 10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!Number.isFinite(lessonIdNum)) {
    redirect("/admin-dashboard");
  }

  const { data: lesson } = await supabase
    .from("lesson")
    .select("name, topic_id")
    .eq("id", lessonIdNum)
    .single();

  if (!lesson) {
    redirect("/admin-dashboard");
  }

  const { data: topic } = await supabase
    .from("topic")
    .select("name")
    .eq("id", lesson.topic_id)
    .single();

  const lessonPages = await getLessonPagesDetail(lessonIdNum, supabase);
  const nextOrder =
    lessonPages.length === 0
      ? 0
      : Math.max(...lessonPages.map((p) => p.order)) + 1;

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  const breadcrumbItems = [
    ...(topic?.name
      ? [
          {
            label: topic.name,
            href: `/admin-topic/${lesson.topic_id}`,
          },
        ]
      : []),
    {
      label: lesson.name,
    },
  ];

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
              title={lesson.name}
              subtitle="Lesson pages for this lesson, in display order."
            />

            <SectionCard>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">Pages</h2>
                  <p className="mt-1 text-sm text-[#4B3A46]">
                    Add and reorder content slides for this lesson.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AdminLessonPagesClient
                    lessonId={lessonIdNum}
                    defaultOrder={nextOrder}
                  />
                  <DeleteLessonClient
                    lessonId={lessonIdNum}
                    topicId={lesson.topic_id}
                  />
                </div>
              </div>

              {lessonPages.length === 0 ? (
                <p className="text-sm text-[#4B3A46]">
                  No lesson pages yet. Add pages to build this lesson.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {lessonPages.map((page) => (
                    <div
                      key={page.id}
                      className="rounded-xl border border-[#4B3A46]/15 bg-white/70 px-5 py-4 shadow-sm"
                    >
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            ID
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {page.id}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            Type
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {page.type}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            Order
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {page.order}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <EditLessonPageClient
                          lessonId={lessonIdNum}
                          page={page}
                        />
                      </div>
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

import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import LessonSlidesClient from "@/components/LessonSlidesClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getLessonPagesDetail, getTopicFromLessonID } from "@/utils/lesson/util";
import { hasCompletedLesson } from "@/utils/progress/lesson/util";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonID: string }>;
}) {
  const supabase = await createClient();
  const lessonID = Number.parseInt((await params).lessonID, 10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const lessonPages = await getLessonPagesDetail(lessonID, supabase);
  const topic = await getTopicFromLessonID(lessonID, supabase);
  const lessonCompletion = await hasCompletedLesson(lessonID, user.id, supabase);

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen">
        <div className="w-[320px]">
          <Sidebar
            userName={profile?.name ?? "John Doe"}
            examTrack={profile?.exam_type ?? "BECE"}
            activeItem="Dashboard"
            logoutAction={logout}
            profile={profile ?? undefined}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="flex max-w-5xl flex-col gap-8">
            <Breadcrumbs
              items={[
                ...(topic
                  ? [
                    {
                      label: topic.name,
                      href: `/topic/${topic.id}`,
                    },
                  ]
                  : []),
                {
                  label: "Lesson",
                },
              ]}
            />
            <PageHeader
              title="Lesson"
              subtitle={
                topic
                  ? `${topic.name} · Lesson content`
                  : "Lesson content"
              }
            />

            <LessonSlidesClient
              pages={lessonPages}
              topicId={topic?.id ?? null}
              lessonId={lessonID}
              userId={user.id}
              initiallyCompleted={lessonCompletion.completed}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

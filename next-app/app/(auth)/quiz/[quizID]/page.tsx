import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import LessonContentCard from "@/components/LessonContentCard";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonID: string }>;
}) {
  const supabase = await createClient();
  const lessonID = (await params).lessonID;

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

  const isTeacher = profile?.account_type === "Teacher";
  const isParent = profile?.account_type === "Parent";

  // For now, lessonID is really the selected topic/category id
  const { data: currentLessonCategory } = await supabase
    .from("category")
    .select("name, parent_id")
    .eq("id", lessonID)
    .single();

  const { data: parentCategory } = await supabase
    .from("category")
    .select("name")
    .eq("id", currentLessonCategory?.parent_id)
    .single();

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
            role={profile?.account_type ?? "Student"}
            activeItem="Dashboard"
            logoutAction={logout}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-5xl space-y-8">
            <Breadcrumbs
              items={[
                {
                  label: parentCategory?.name ?? "Subject",
                  href: `/dashboard/${currentLessonCategory?.parent_id}`,
                },
                {
                  label: currentLessonCategory?.name ?? "Topic",
                  href: `/topic/${lessonID}`,
                },
                {
                  label: "Lesson",
                },
              ]}
            />

            <PageHeader
              title={currentLessonCategory?.name ?? "Lesson"}
              subtitle={
                isTeacher
                  ? `${parentCategory?.name ?? "Subject"} • Preview and manage lesson content`
                  : isParent
                  ? `${parentCategory?.name ?? "Subject"} • View-only lesson page`
                  : `${parentCategory?.name ?? "Subject"} • Lesson Content`
              }
            />

            <SectionCard>
              <p className="text-sm text-[#4B3A46]">
                {isTeacher
                  ? "This teacher view allows you to preview lesson structure and manage how this lesson is assigned."
                  : isParent
                  ? "This lesson is read-only in the parent view so you can monitor what the student is working on."
                  : "This lesson page supports different lesson types such as video, reading, and guided notes."}
              </p>
            </SectionCard>

            <LessonContentCard
              title="Lesson Media"
              description={
                isTeacher
                  ? "Preview the media or resource students will see in this lesson."
                  : isParent
                  ? "Read-only preview of lesson media."
                  : "This area can display a video, image, or embedded resource."
              }
            >
              <VideoPlaceholder />
            </LessonContentCard>

            <LessonContentCard
              title="Lesson Summary"
              description="This will later be pulled from the lesson_page table."
            >
              <div className="rounded-2xl bg-[#F3EFEA] p-5 text-sm leading-7 text-[#4B3A46]">
                Placeholder lesson summary text for{" "}
                <span className="font-semibold text-[#592803]">
                  {currentLessonCategory?.name ?? "this lesson"}
                </span>
                . This block can later render lesson content from the backend.
              </div>
            </LessonContentCard>

            {isTeacher ? (
              <SectionCard className="flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] transition hover:opacity-90">
                  Edit Lesson
                </button>

                <button className="rounded-xl bg-[#E57E25] px-5 py-3 font-semibold text-white transition hover:opacity-90">
                  Assign Lesson
                </button>
              </SectionCard>
            ) : isParent ? (
              <SectionCard>
                <p className="text-sm text-[#4B3A46]">
                  Parents can view lesson content and progress, but cannot complete or submit work.
                </p>
              </SectionCard>
            ) : (
              <SectionCard className="flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#6AC700] px-5 py-3 font-semibold text-white transition hover:bg-[#5bb000]">
                  Mark Lesson Complete
                </button>

                <Link
                  href={`/quiz/${lessonID}`}
                  className="rounded-xl bg-[#E57E25] px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Proceed to Quiz
                </Link>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
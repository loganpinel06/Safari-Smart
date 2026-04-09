import { createClient } from "@/utils/supabase/server";
import { createItem } from "@/utils/api/createItem";

export async function POST(request: Request) {
  const supabase = await createClient();
  return createItem({ request, supabase, itemType: "quiz" });
}

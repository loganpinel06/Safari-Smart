import { createClient } from "@/utils/supabase/server";
import { updateItem } from "@/utils/api/updateItem";

export async function POST(request: Request) {
  const supabase = await createClient();
  return updateItem({ request, supabase, itemType: "quiz" });
}

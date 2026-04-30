export async function getSubjects(
  categoryID: Number | null,
  profile: any,
  supabase: any,
) {
  const subjects = [];
  let areCategories = true;
  if (profile.account_type === "Student") {
    if (categoryID === null) {
      const test = profile.exam_type === "BECE" ? 1 : 2;
      const res = await supabase
        .from("category")
        .select("*")
        .eq("parent_id", test);
      if (res.error) {
        console.error("Error fetching subjects:", res.error);
        return { subjects: [], areCategories: true };
      }

      for (const category of res.data) {
        subjects.push({
          title: category.name,
          href: "/dashboard/" + category.id,
          isfree: true,
        });
      }
    } else {
      const res = await supabase
        .from("category")
        .select("*")
        .eq("parent_id", categoryID);
      if (res.error) {
        console.error("Error fetching subjects:", res.error);
        return { subjects: [], areCategories: true };
      }

      for (const category of res.data) {
        subjects.push({
          title: category.name,
          href: "/dashboard/" + category.id,
          isfree: true,
        });
      }
    }
  } else {
    if (categoryID === null) {
      const res = await supabase
        .from("category")
        .select("*")
        .is("parent_id", null);

      if (res.error) {
        console.error("Error fetching subjects:", res.error);
        return { subjects: [], areCategories: true };
      }

      for (const category of res.data) {
        subjects.push({
          title: category.name,
          href: "/dashboard/" + category.id,
          isfree: true,
        });
      }
    } else {
      const res = await supabase
        .from("category")
        .select("*")
        .eq("parent_id", categoryID);

      if (res.error) {
        console.error("Error fetching subjects:", res.error);
        return { subjects: [], areCategories: true };
      }

      for (const category of res.data) {
        subjects.push({
          title: category.name,
          href: "/dashboard/" + category.id,
          isfree: true,
        });
      }
    }
  }

  if (subjects.length == 0) {
    const res = await supabase
      .from("topic")
      .select("*")
      .eq("category_id", categoryID)
      .order("order", { ascending: true });
    if (res.error) {
      console.error("Error fetching topics:", res.error);
      return { subjects: [], areCategories: true };
    }

    for (const topic of res.data) {
      subjects.push({
        title: topic.name,
        href: "/topic/" + topic.id,
        isfree: topic.isfree,
      });
    }

    areCategories = false;
  }

  return { subjects, areCategories };
}

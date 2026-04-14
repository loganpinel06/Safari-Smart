/**
 * Modularized utility for deleting parent items with cascading child deletion.
 * Used by lessons, quizzes, and exams that have child questions/pages with media.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { parseStoredMediaPath } from "@/utils/files/getFile";

export type DeleteItemParams = {
  parentTableName: string;
  childTableName: string;
  parentId: number;
  parentIdField: string;
  parentValidationField: string;
  parentValidationValue: number | string;
  childPathField?: string; // Field name in child table that contains media paths
};

type ChildRow = Record<string, unknown>;

/**
 * Delete a parent item and cascade delete all children with media cleanup
 */
export async function deleteItemWithChildren(
  supabase: SupabaseClient,
  params: DeleteItemParams,
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      parentTableName,
      childTableName,
      parentId,
      parentIdField,
      parentValidationField,
      parentValidationValue,
      childPathField,
    } = params;

    // Verify parent exists and matches validation
    const { data: parent, error: parentError } = await supabase
      .from(parentTableName)
      .select(parentValidationField)
      .eq("id", parentId)
      .single();

    if (parentError || !parent) {
      return { success: false, error: `${parentTableName} not found` };
    }

    const parentRow = parent as unknown as Record<string, unknown>;
    if (parentRow[parentValidationField] !== parentValidationValue) {
      return {
        success: false,
        error: `Invalid ${parentValidationField} for this ${parentTableName}`,
      };
    }

    // Fetch children if media cleanup is needed
    let mediaByBucket: Record<string, string[]> = {};
    if (childPathField) {
      const { data: children, error: childrenError } = await supabase
        .from(childTableName)
        .select(childPathField)
        .eq(parentIdField, parentId);

      if (childrenError) {
        return { success: false, error: childrenError.message };
      }

      // Group media by bucket
      for (const row of (children ?? []) as unknown as ChildRow[]) {
        const pathValue = row[childPathField];
        if (!pathValue || typeof pathValue !== "string") continue;
        const media = parseStoredMediaPath(pathValue);
        if (!media) continue;
        if (!mediaByBucket[media.bucket]) mediaByBucket[media.bucket] = [];
        mediaByBucket[media.bucket].push(media.pathInBucket);
      }
    }

    // Delete all children
    const { error: deleteChildrenError } = await supabase
      .from(childTableName)
      .delete()
      .eq(parentIdField, parentId);

    if (deleteChildrenError) {
      return { success: false, error: deleteChildrenError.message };
    }

    // Delete parent
    const { error: deleteParentError } = await supabase
      .from(parentTableName)
      .delete()
      .eq("id", parentId)
      .eq(parentValidationField, parentValidationValue);

    if (deleteParentError) {
      return { success: false, error: deleteParentError.message };
    }

    // Clean up media files
    for (const [bucket, paths] of Object.entries(mediaByBucket)) {
      if (paths.length > 0) {
        await supabase.storage.from(bucket).remove(paths);
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete a single child item (question/page) with media cleanup
 */
export async function deleteChildItem(
  supabase: SupabaseClient,
  {
    childTableName,
    childId,
    parentTableName,
    parentIdField,
    parentId,
    pathField,
  }: {
    childTableName: string;
    childId: number;
    parentTableName: string;
    parentIdField: string;
    parentId: number;
    pathField: string;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch child to validate parent relationship and get media path
    const { data: child, error: childError } = await supabase
      .from(childTableName)
      .select(`${parentIdField},${pathField}`)
      .eq("id", childId)
      .single();

    if (childError || !child) {
      return { success: false, error: `${childTableName} not found` };
    }

    const childRow = child as unknown as Record<string, unknown>;

    if (childRow[parentIdField] !== parentId) {
      return {
        success: false,
        error: `Invalid ${parentIdField} for this ${childTableName}`,
      };
    }

    // Get media path and cleanup
    const pathValue = childRow[pathField];
    if (pathValue && typeof pathValue === "string") {
      const media = parseStoredMediaPath(pathValue);
      if (media) {
        await supabase.storage.from(media.bucket).remove([media.pathInBucket]);
      }
    }

    // Delete child
    const { error: deleteError } = await supabase
      .from(childTableName)
      .delete()
      .eq("id", childId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

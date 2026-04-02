import type { SupabaseClient } from "@supabase/supabase-js";

/** Buckets used for lesson (and matching) media uploads — see `uploadFile.ts`. */
const MEDIA_BUCKETS = new Set(["images", "videos"]);

/** Default TTL for lesson media — long enough for a typical session (private buckets). */
export const DEFAULT_SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 4;

export type ParsedStoredMediaPath = {
  bucket: string;
  /** Object key inside the bucket (e.g. `uuid.jpg`). */
  pathInBucket: string;
};

/**
 * Lesson rows store `path` as `{bucket}/{pathInBucket}` (e.g. `images/abc.jpg`).
 */
export function parseStoredMediaPath(
  storedPath: string | null | undefined,
): ParsedStoredMediaPath | null {
  if (typeof storedPath !== "string") return null;
  const trimmed = storedPath.trim();
  if (!trimmed) return null;

  const slash = trimmed.indexOf("/");
  if (slash <= 0 || slash === trimmed.length - 1) return null;

  const bucket = trimmed.slice(0, slash);
  const pathInBucket = trimmed.slice(slash + 1);
  if (!pathInBucket || !MEDIA_BUCKETS.has(bucket)) return null;

  return { bucket, pathInBucket };
}

/**
 * Signed URL for private storage buckets (images / videos).
 */
export async function getSignedUrlFromStoredPath(
  supabase: SupabaseClient,
  storedPath: string | null | undefined,
  expiresInSeconds: number = DEFAULT_SIGNED_URL_EXPIRY_SECONDS,
): Promise<string | null> {
  const parsed = parseStoredMediaPath(storedPath);
  if (!parsed) return null;

  const { data, error } = await supabase.storage
    .from(parsed.bucket)
    .createSignedUrl(parsed.pathInBucket, expiresInSeconds);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

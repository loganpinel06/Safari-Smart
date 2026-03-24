import type { SupabaseClient } from "@supabase/supabase-js";

export type MediaKind = "image" | "video";

export type UploadFileResult =
  | { success: true; bucket: string; path: string }
  | { success: false; error: string };

const BUCKET_FOR: Record<MediaKind, string> = {
  image: "images",
  video: "videos",
};

const MIME_PREFIX: Record<MediaKind, string> = {
  image: "image/",
  video: "video/",
};

function inferExtension(file: File | Blob): string {
  if (file instanceof File && file.name.includes(".")) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (/^\.\w{1,12}$/.test(ext)) return ext;
  }

  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
  };

  if (file.type && map[file.type]) return map[file.type];
  return "";
}

export async function uploadFile(
  supabase: SupabaseClient,
  file: File | Blob,
  mediaType: MediaKind,
): Promise<UploadFileResult> {
  const bucket = BUCKET_FOR[mediaType];

  const mime = file.type;
  if (!mime || !mime.startsWith(MIME_PREFIX[mediaType])) {
    return {
      success: false,
      error: `File must be a ${mediaType} (${MIME_PREFIX[mediaType]}… MIME type)`,
    };
  }

  const ext = inferExtension(file);
  if (!ext) {
    return {
      success: false,
      error: "Could not determine a safe file extension",
    };
  }

  const path = `${crypto.randomUUID()}${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: mime,
    upsert: false,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, bucket, path };
}

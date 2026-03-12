import { supabase } from "@/integrations/supabase/client";

const BUCKET = "portfolio";

/**
 * Upload a file (base64 data URL or File) to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadFile(
  path: string,
  file: File | Blob
): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Convert a base64 data URL to a Blob.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "application/octet-stream";
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
}

/**
 * Upload a base64 data URL to storage and return public URL.
 * If the value is already a URL (not data:), returns it as-is.
 */
export async function uploadDataUrl(
  path: string,
  dataUrl: string
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith("data:")) return dataUrl;
  const blob = dataUrlToBlob(dataUrl);
  return uploadFile(path, blob);
}

export async function deleteFile(path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path]);
}

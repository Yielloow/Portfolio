import { supabase } from "@/integrations/supabase/client";

export async function translateTexts(texts: string[]): Promise<string[]> {
  const filtered = texts.filter((t) => t.trim());
  if (filtered.length === 0) return texts.map(() => "");

  const { data, error } = await supabase.functions.invoke("translate", {
    body: { texts: filtered },
  });

  if (error) throw new Error(error.message || "Translation failed");
  if (data?.error) throw new Error(data.error);

  const translations: string[] = data.translations || [];

  // Map back, filling blanks for empty inputs
  let tIdx = 0;
  return texts.map((t) => {
    if (!t.trim()) return "";
    return translations[tIdx++] || t;
  });
}

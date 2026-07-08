import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Review = {
  id: string;
  stylist_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  photo_url: string | null;
  created_at: string;
};

const SELECT_COLS = "id,stylist_id,author_name,rating,comment,photo_url,created_at";

const reviewInput = z.object({
  stylist_id: z.string().uuid(),
  author_name: z.string().trim().min(1, "Naam is verplicht").max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional().or(z.literal("").transform(() => undefined)),
  photo_url: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type ReviewInput = z.infer<typeof reviewInput>;

export const listReviews = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ stylist_id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("reviews")
      .select(SELECT_COLS)
      .eq("stylist_id", data.stylist_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (rows ?? []) as Review[];
  });

export const createReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => reviewInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("reviews")
      .insert(data)
      .select(SELECT_COLS)
      .single();
    if (error) throw new Error(error.message);
    return row as Review;
  });

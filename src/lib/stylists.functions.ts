import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Stylist = {
  id: string;
  name: string;
  city: string;
  instagram_url: string | null;
  image_url: string | null;
  rating: number;
  reviews_count: number;
  price_min: number;
  price_max: number;
  specialties: string[];
  bio: string | null;
};

const stylistInput = z.object({
  name: z.string().trim().min(1).max(120),
  city: z.string().trim().min(1).max(80),
  instagram_url: z
    .string()
    .trim()
    .max(300)
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  image_url: z
    .string()
    .trim()
    .max(1000)
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  rating: z.number().min(0).max(5),
  reviews_count: z.number().int().min(0).max(100000),
  price_min: z.number().int().min(0).max(100000),
  price_max: z.number().int().min(0).max(100000),
  specialties: z.array(z.string().trim().min(1).max(60)).max(20),
  bio: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
});

const stylistInputRefined = stylistInput.refine((d) => d.price_max >= d.price_min, {
  path: ["price_max"],
  message: "Max price must be greater than or equal to min price",
});

export type StylistInput = z.infer<typeof stylistInputRefined>;

export const listStylists = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("stylists")
    .select(
      "id,name,city,instagram_url,image_url,rating,reviews_count,price_min,price_max,specialties,bio"
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Stylist[];
});

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const createStylist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => stylistInputRefined.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("stylists")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as Stylist;
  });

export const updateStylist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), values: stylistInputRefined }).parse(data)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("stylists")
      .update(data.values)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as Stylist;
  });

export const deleteStylist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("stylists").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

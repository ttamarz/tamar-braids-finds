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
  owner_id: string | null;
  verified: boolean;
  featured: boolean;
  email: string | null;
  booking_url: string | null;
};

const SELECT_COLS =
  "id,name,city,instagram_url,image_url,rating,reviews_count,price_min,price_max,specialties,bio,owner_id,verified,featured,email,booking_url";

const optionalUrl = z
  .string()
  .trim()
  .max(1000)
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalEmail = z
  .string()
  .trim()
  .max(200)
  .email()
  .optional()
  .or(z.literal("").transform(() => undefined));

const stylistInput = z.object({
  name: z.string().trim().min(1).max(120),
  city: z.string().trim().min(1).max(80),
  instagram_url: optionalUrl,
  image_url: optionalUrl,
  rating: z.number().min(0).max(5),
  reviews_count: z.number().int().min(0).max(100000),
  price_min: z.number().int().min(0).max(100000),
  price_max: z.number().int().min(0).max(100000),
  specialties: z.array(z.string().trim().min(1).max(60)).max(20),
  bio: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  email: optionalEmail,
  booking_url: optionalUrl,
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
    .select(SELECT_COLS)
    .order("featured", { ascending: false })
    .order("verified", { ascending: false })
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
    const { data: row, error } = await context.supabase
      .from("stylists")
      .insert({ ...data, owner_id: context.userId })
      .select(SELECT_COLS)
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
    const { data: row, error } = await context.supabase
      .from("stylists")
      .update(data.values)
      .eq("id", data.id)
      .select(SELECT_COLS)
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

export const setStylistFlags = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        verified: z.boolean().optional(),
        featured: z.boolean().optional(),
      })
      .parse(data)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const patch: { verified?: boolean; featured?: boolean } = {};
    if (typeof data.verified === "boolean") patch.verified = data.verified;
    if (typeof data.featured === "boolean") patch.featured = data.featured;
    const { data: row, error } = await context.supabase
      .from("stylists")
      .update(patch)
      .eq("id", data.id)
      .select(SELECT_COLS)
      .single();
    if (error) throw new Error(error.message);
    return row as Stylist;
  });

export const getMyStylist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("stylists")
      .select(SELECT_COLS)
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data ?? null) as Stylist | null;
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) return { isAdmin: false };
    return { isAdmin: !!data };
  });

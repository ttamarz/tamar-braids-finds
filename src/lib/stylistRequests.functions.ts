import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  city: z.string().trim().min(2).max(60),
  hairstyle: z.string().trim().min(2).max(200),
  budget: z.string().trim().min(1).max(40),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const submitStylistRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => requestSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("stylist_requests").insert({
      name: data.name,
      email: data.email,
      city: data.city,
      hairstyle: data.hairstyle,
      budget: data.budget,
      notes: data.notes || null,
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });

const applicationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  city: z.string().trim().min(2).max(80),
  instagram: z.string().trim().min(2).max(200),
  specialties: z.string().trim().min(2).max(300),
  priceRange: z.string().trim().min(1).max(80),
  bookingMethod: z.string().trim().max(200).optional().or(z.literal("")),
  bio: z.string().trim().min(10).max(1000),
});

export const submitStylistApplication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => applicationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("stylist_requests").insert({
      name: data.name,
      email: data.email,
      city: data.city,
      hairstyle: data.specialties,
      budget: data.priceRange,
      notes: `
STYLIST APPLICATION

Instagram: ${data.instagram}
Booking method: ${data.bookingMethod || "Not provided"}

Bio:
${data.bio}
      `.trim(),
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });

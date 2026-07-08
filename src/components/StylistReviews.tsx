import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Camera, X } from "lucide-react";
import { reviewsQueryOptions } from "@/lib/reviewsQuery";
import { createReview } from "@/lib/reviews.functions";
import { supabase } from "@/integrations/supabase/client";

export function StylistReviews({ stylistId }: { stylistId: string }) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const { data: reviews = [] } = useQuery({
    ...reviewsQueryOptions(stylistId),
    enabled: open,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Vul je naam in.");
      return;
    }

    setSubmitting(true);
    try {
      let photo_url: string | undefined;

      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${stylistId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("review-photos")
          .upload(fileName, photoFile);
        if (uploadError) throw new Error(uploadError.message);

        const { data: urlData } = supabase.storage.from("review-photos").getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }

      await createReview({
        data: {
          stylist_id: stylistId,
          author_name: name.trim(),
          rating,
          comment: comment.trim() || undefined,
          photo_url,
        },
      });

      setName("");
      setRating(5);
      setComment("");
      setPhotoFile(null);
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", stylistId] });
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    } catch (err: any) {
      setError(err.message || "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-2 border-t border-border/60 pt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm font-semibold text-foreground hover:text-[color:var(--rose)] transition-colors"
      >
        {open ? "Verberg reviews" : "Bekijk reviews"}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {reviews.length === 0 && !showForm && (
            <p className="text-sm text-muted-foreground">Nog geen reviews. Wees de eerste!</p>
          )}

          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-[color:var(--blush)]/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{r.author_name}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold">
                  <Star className="h-3 w-3 fill-[color:var(--pink)] text-[color:var(--pink)]" />
                  {r.rating}
                </span>
              </div>
              {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
              {r.photo_url && (
                <img
                  src={r.photo_url}
                  alt="Review foto"
                  className="mt-3 rounded-xl max-h-48 object-cover"
                />
              )}
            </div>
          ))}

          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="text-sm font-semibold bg-foreground text-background rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Schrijf een review
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 p-4 space-y-3">
              <input
                type="text"
                placeholder="Jouw naam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm"
              />

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    <Star
                      className={`h-6 w-6 ${
                        n <= rating ? "fill-[color:var(--pink)] text-[color:var(--pink)]" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Vertel over je ervaring (optioneel)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-border bg-background px-4 py-2 text-sm"
              />

              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <Camera className="h-4 w-4" />
                {photoFile ? photoFile.name : "Foto toevoegen (optioneel)"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-sm font-semibold bg-[color:var(--rose)] text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Bezig..." : "Plaatsen"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Annuleren
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

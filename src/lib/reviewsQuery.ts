import { queryOptions } from "@tanstack/react-query";
import { listReviews } from "./reviews.functions";

export const reviewsQueryOptions = (stylistId: string) =>
  queryOptions({
    queryKey: ["reviews", stylistId],
    queryFn: () => listReviews({ data: { stylist_id: stylistId } }),
    staleTime: 30_000,
  });

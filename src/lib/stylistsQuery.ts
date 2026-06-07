import { queryOptions } from "@tanstack/react-query";
import { listStylists } from "./stylists.functions";

export const stylistsQueryOptions = queryOptions({
  queryKey: ["stylists"],
  queryFn: () => listStylists(),
  staleTime: 30_000,
});

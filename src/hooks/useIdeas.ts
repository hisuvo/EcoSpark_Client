// hooks/useIdeas.ts
import { useQuery } from "@tanstack/react-query";
import { getIdeas } from "@/services/idea.service";
import { IIdeaResponse } from "@/type/idea.type";

export const useIdeas = (params: Record<string, unknown>) => {
  return useQuery<IIdeaResponse>({
    queryKey: ["ideas", params],
    queryFn: () => getIdeas(params),
    placeholderData: (prev) => prev, // smooth pagination
  });
};

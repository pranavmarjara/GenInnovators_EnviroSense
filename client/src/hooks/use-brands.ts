import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useBrandScore(name: string | null) {
  return useQuery({
    queryKey: [api.brands.get.path, name],
    queryFn: async () => {
      if (!name) return null;
      const url = buildUrl(api.brands.get.path, { name });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch brand score");
      return api.brands.get.responses[200].parse(await res.json());
    },
    enabled: !!name && name.length > 0,
    retry: false,
  });
}

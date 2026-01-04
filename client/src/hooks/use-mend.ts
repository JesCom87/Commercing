import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { MendEntry, InsertMendEntry } from "@shared/schema";

export function useMend() {
  return useQuery<MendEntry[]>({
    queryKey: [api.mend.listEntries.path],
    queryFn: async () => {
      const res = await fetch(api.mend.listEntries.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch mend entries");
      return api.mend.listEntries.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMendEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMendEntry) => {
      const validated = api.mend.createEntry.input.parse(data);
      const res = await fetch(api.mend.createEntry.path, {
        method: api.mend.createEntry.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create mend entry");
      return api.mend.createEntry.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.mend.listEntries.path] });
    },
  });
}

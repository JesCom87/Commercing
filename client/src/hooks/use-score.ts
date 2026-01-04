import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { ScoreEntry, InsertScoreEntry } from "@shared/schema";

export function useInvoices() {
  return useQuery<ScoreEntry[]>({
    queryKey: [api.score.listInvoices.path],
    queryFn: async () => {
      const res = await fetch(api.score.listInvoices.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return api.score.listInvoices.responses[200].parse(await res.json());
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScoreEntry) => {
      const validated = api.score.createInvoice.input.parse(data);
      const res = await fetch(api.score.createInvoice.path, {
        method: api.score.createInvoice.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create invoice");
      return api.score.createInvoice.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.score.listInvoices.path] });
    },
  });
}

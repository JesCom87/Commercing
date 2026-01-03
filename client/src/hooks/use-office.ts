import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertLedgerEntry } from "@shared/routes";

export function useLedger() {
  return useQuery({
    queryKey: [api.office.listLedger.path],
    queryFn: async () => {
      const res = await fetch(api.office.listLedger.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch ledger");
      return api.office.listLedger.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLedgerEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLedgerEntry) => {
      const validated = api.office.createLedgerEntry.input.parse(data);
      const res = await fetch(api.office.createLedgerEntry.path, {
        method: api.office.createLedgerEntry.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Validation failed");
        }
        throw new Error("Failed to create ledger entry");
      }
      return api.office.createLedgerEntry.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.office.listLedger.path] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Operation, InsertOperation } from "@shared/schema";

export function useOperations() {
  return useQuery<Operation[]>({
    queryKey: [api.outfit.listOperations.path],
    queryFn: async () => {
      const res = await fetch(api.outfit.listOperations.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch operations");
      return api.outfit.listOperations.responses[200].parse(await res.json());
    },
  });
}

export function useCreateOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertOperation) => {
      const validated = api.outfit.createOperation.input.parse(data);
      const res = await fetch(api.outfit.createOperation.path, {
        method: api.outfit.createOperation.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create operation");
      return api.outfit.createOperation.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.outfit.listOperations.path] });
    },
  });
}

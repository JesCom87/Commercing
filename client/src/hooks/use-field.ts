import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InventoryItem, InsertInventoryItem, Employee, InsertEmployee } from "@shared/schema";

// --- Inventory ---
export function useInventory() {
  return useQuery<InventoryItem[]>({
    queryKey: [api.field.listInventory.path],
    queryFn: async () => {
      const res = await fetch(api.field.listInventory.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      return api.field.listInventory.responses[200].parse(await res.json());
    },
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertInventoryItem) => {
      const validated = api.field.createInventoryItem.input.parse(data);
      const res = await fetch(api.field.createInventoryItem.path, {
        method: api.field.createInventoryItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create inventory item");
      return api.field.createInventoryItem.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.field.listInventory.path] });
    },
  });
}

// --- Employees ---
export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: [api.field.listEmployees.path],
    queryFn: async () => {
      const res = await fetch(api.field.listEmployees.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch employees");
      return api.field.listEmployees.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEmployee) => {
      const validated = api.field.createEmployee.input.parse(data);
      const res = await fetch(api.field.createEmployee.path, {
        method: api.field.createEmployee.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create employee");
      return api.field.createEmployee.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.field.listEmployees.path] });
    },
  });
}

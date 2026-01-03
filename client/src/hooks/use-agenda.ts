import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertEvent } from "@shared/routes";

export function useEvents() {
  return useQuery({
    queryKey: [api.agenda.listEvents.path],
    queryFn: async () => {
      const res = await fetch(api.agenda.listEvents.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.agenda.listEvents.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEvent) => {
      const validated = api.agenda.createEvent.input.parse(data);
      const res = await fetch(api.agenda.createEvent.path, {
        method: api.agenda.createEvent.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.agenda.createEvent.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.agenda.listEvents.path] });
    },
  });
}

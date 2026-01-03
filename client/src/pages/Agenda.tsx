import { Shell } from "@/components/layout/Shell";
import { useEvents, useCreateEvent } from "@/hooks/use-agenda";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";

export default function Agenda() {
  const { data: events, isLoading } = useEvents();
  const createMutation = useCreateEvent();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const form = useForm({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      type: "task",
      description: "",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Shell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Agenda</h1>
          <p className="text-muted-foreground mt-2">Schedule, tasks, and project milestones.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({field}) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="type" render={({field}) => (
                  <FormItem><FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="bg-secondary/50 border-white/10 text-white"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent className="bg-card border-white/10">
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select><FormMessage/>
                  </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({field}) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                {/* Simplified date handling for demo - would use a proper date-time picker in prod */}
                <div className="grid grid-cols-2 gap-4">
                   <FormField control={form.control} name="startTime" render={({field}) => (
                    <FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="datetime-local" {...field} value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''} onChange={e => field.onChange(new Date(e.target.value).toISOString())} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                  )}/>
                   <FormField control={form.control} name="endTime" render={({field}) => (
                    <FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="datetime-local" {...field} value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''} onChange={e => field.onChange(new Date(e.target.value).toISOString())} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                  )}/>
                </div>
                <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming</h2>
          {isLoading ? <p>Loading events...</p> : events?.length === 0 ? <p className="text-muted-foreground">No upcoming events.</p> : events?.map((event: any) => (
            <div key={event.id} className="glass-card p-4 rounded-xl flex gap-4 hover:border-primary/50 transition-all group">
              <div className="w-16 h-16 rounded-lg bg-secondary flex flex-col items-center justify-center border border-white/5 group-hover:border-primary/50 transition-colors">
                <span className="text-xs text-muted-foreground uppercase">{new Date(event.startTime).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-xl font-bold text-white">{new Date(event.startTime).getDate()}</span>
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-white">{event.title}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-white/5 capitalize text-muted-foreground">{event.type}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{event.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-primary/80">
                  <Clock className="w-3 h-3" />
                  {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(event.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="glass-card p-4 rounded-2xl">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="text-white"
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}

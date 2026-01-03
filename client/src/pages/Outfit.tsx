import { Shell } from "@/components/layout/Shell";
import { useOperations, useCreateOperation } from "@/hooks/use-outfit";
import { Plus, Factory, Activity } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOperationSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

export default function Outfit() {
  const { data: operations, isLoading } = useOperations();
  const createMutation = useCreateOperation();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertOperationSchema),
    defaultValues: {
      name: "",
      type: "manufacturing",
      sector: "industrial",
      status: "production",
      progress: 0,
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
          <h1 className="text-3xl font-bold text-white font-display">Outfit</h1>
          <p className="text-muted-foreground mt-2">Operational processing & distribution.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Operation
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Start Operation</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({field}) => (
                  <FormItem><FormLabel>Operation Name</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({field}) => (
                    <FormItem><FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-secondary/50 border-white/10 text-white"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="trading">Trading</SelectItem>
                          <SelectItem value="prospecting">Prospecting</SelectItem>
                        </SelectContent>
                      </Select><FormMessage/>
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="sector" render={({field}) => (
                    <FormItem><FormLabel>Sector</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-secondary/50 border-white/10 text-white"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select><FormMessage/>
                    </FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="progress" render={({field}) => (
                  <FormItem><FormLabel>Initial Progress (%)</FormLabel><FormControl><Input {...field} type="number" min="0" max="100" onChange={e => field.onChange(parseInt(e.target.value))} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Start Operation"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? <p>Loading operations...</p> : operations?.map((op: any) => (
          <div key={op.id} className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Factory className="w-24 h-24" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{op.name}</h3>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-white/5 rounded text-muted-foreground uppercase tracking-wider">{op.type}</span>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded text-muted-foreground uppercase tracking-wider">{op.sector}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{op.status}</span>
                  <span className="text-white font-mono">{op.progress}%</span>
                </div>
                <Progress value={op.progress} className="h-2 bg-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

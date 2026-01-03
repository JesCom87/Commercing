import { Shell } from "@/components/layout/Shell";
import { useLedger, useCreateLedgerEntry } from "@/hooks/use-office";
import { Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLedgerSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

export default function Office() {
  const { data: ledger, isLoading } = useLedger();
  const createMutation = useCreateLedgerEntry();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertLedgerSchema),
    defaultValues: {
      type: "credit",
      category: "market",
      amount: "0",
      description: "",
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
          <h1 className="text-3xl font-bold text-white font-display">Office</h1>
          <p className="text-muted-foreground mt-2">Financial ledger & market economics.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add Ledger Entry</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary/50 border-white/10 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" className="bg-secondary/50 border-white/10 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary/50 border-white/10 text-white">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="credit">Credit (Income)</SelectItem>
                            <SelectItem value="debit">Debit (Expense)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/50 border-white/10 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="market">Market</SelectItem>
                          <SelectItem value="fund">Fund</SelectItem>
                          <SelectItem value="asset">Asset</SelectItem>
                          <SelectItem value="liability">Liability</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Entry"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="p-4 font-medium text-muted-foreground text-sm">Date</th>
              <th className="p-4 font-medium text-muted-foreground text-sm">Description</th>
              <th className="p-4 font-medium text-muted-foreground text-sm">Category</th>
              <th className="p-4 font-medium text-muted-foreground text-sm">Type</th>
              <th className="p-4 font-medium text-muted-foreground text-sm text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading ledger...</td></tr>
            ) : ledger?.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No entries found</td></tr>
            ) : (
              ledger?.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm text-white/80">
                    {entry.date ? new Date(entry.date).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 font-medium text-white">{entry.description}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground capitalize">
                      {entry.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {entry.type === 'credit' ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                        <ArrowUpCircle className="w-4 h-4" /> Credit
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 text-sm font-medium">
                        <ArrowDownCircle className="w-4 h-4" /> Debit
                      </span>
                    )}
                  </td>
                  <td className={`p-4 text-right font-mono font-medium ${entry.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {entry.type === 'credit' ? '+' : '-'}${Number(entry.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

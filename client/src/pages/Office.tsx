import { Shell } from "@/components/layout/Shell";
import { useLedger, useCreateLedgerEntry } from "@/hooks/use-office";
import { Plus, ArrowUpCircle, ArrowDownCircle, TrendingUp, LineChart, RefreshCcw, DollarSign, BarChart3, Receipt, TrendingDown, Layers, Scale, BookOpen, Calculator } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLedgerSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Office() {
  const { data: ledger, isLoading } = useLedger();
  const createMutation = useCreateLedgerEntry();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertLedgerSchema),
    defaultValues: {
      type: "credit",
      category: "market",
      subcategory: "StationState",
      detail: "Supply|Demand",
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
          <p className="text-muted-foreground mt-2">StationState (Price) | MarketPlace (Value) | DoubleEntry (Cost)</p>
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
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/50 border-white/10 text-white">
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="StationState">Economics (StationState)</SelectItem>
                          <SelectItem value="MarketPlace">Finance (MarketPlace)</SelectItem>
                          <SelectItem value="DoubleEntry">Accounting (DoubleEntry)</SelectItem>
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

      <Tabs defaultValue="economics" className="space-y-6">
        <TabsList className="bg-card border border-white/5 p-1">
          <TabsTrigger value="economics">
            <TrendingUp className="w-4 h-4 mr-2" /> StationState: (Price) | (Economics)
          </TabsTrigger>
          <TabsTrigger value="finance">
            <DollarSign className="w-4 h-4 mr-2" /> MarketPlace: (Value) | (Finance)
          </TabsTrigger>
          <TabsTrigger value="accounting">
            <Receipt className="w-4 h-4 mr-2" /> DoubleEntry: (Cost) | (Accounting)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="economics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Market Forces" value="Supply | Demand" icon={TrendingUp} />
            <MetricCard title="Lineal Curves" value="Means | Ends" icon={LineChart} />
            <MetricCard title="Circular Flow" value="Deficiency | Sufficiency" icon={RefreshCcw} />
          </div>
          <LedgerTable data={ledger?.filter(e => e.subcategory === 'StationState')} loading={isLoading} />
        </TabsContent>

        <TabsContent value="finance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Cycles" value="Bearish|Bullish" icon={RefreshCcw} />
            <MetricCard title="Bands" value="Resist|Support" icon={BarChart3} />
            <MetricCard title="Funds" value="Sell|Buy" icon={DollarSign} />
          </div>
          <LedgerTable data={ledger?.filter(e => e.subcategory === 'MarketPlace')} loading={isLoading} />
        </TabsContent>

        <TabsContent value="accounting">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Accounts" value="Debits|Credits" icon={Receipt} />
            <MetricCard title="Books" value="Left|Right" icon={BarChart3} />
            <MetricCard title="Units" value="Ratios|Rates" icon={TrendingUp} />
          </div>
          <LedgerTable data={ledger?.filter(e => e.subcategory === 'DoubleEntry')} loading={isLoading} />
        </TabsContent>
      </Tabs>
    </Shell>
  );
}

function MetricCard({ title, value, icon: Icon }: { title: string, value: string, icon: any }) {
  return (
    <Card className="glass-card border-white/5 p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function LedgerTable({ data, loading }: { data: any, loading: boolean }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5 border-b border-white/5">
          <tr>
            <th className="p-4 font-medium text-muted-foreground text-sm">Date</th>
            <th className="p-4 font-medium text-muted-foreground text-sm">Description</th>
            <th className="p-4 font-medium text-muted-foreground text-sm">Detail</th>
            <th className="p-4 font-medium text-muted-foreground text-sm">Type</th>
            <th className="p-4 font-medium text-muted-foreground text-sm text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
          ) : data?.length === 0 ? (
            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No entries found</td></tr>
          ) : (
            data?.map((entry: any) => (
              <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm text-white/80">
                  {entry.date ? new Date(entry.date).toLocaleDateString() : '-'}
                </td>
                <td className="p-4 font-medium text-white">{entry.description}</td>
                <td className="p-4 text-sm text-muted-foreground">{entry.detail}</td>
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
  );
}

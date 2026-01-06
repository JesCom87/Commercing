import { Shell } from "@/components/layout/Shell";
import { useInvoices, useCreateInvoice } from "@/hooks/use-score";
import { Plus, Download, FileText, CheckCircle2, TrendingUp, Receipt, Wallet, Scale, Landmark, Coins } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertScoreSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Score() {
  const { data: score, isLoading } = useInvoices();
  const createMutation = useCreateInvoice();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertScoreSchema),
    defaultValues: {
      clientName: "",
      amount: "0",
      status: "estimate",
      type: "deposit",
      dueDate: new Date().toISOString(),
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
          <h1 className="text-3xl font-bold text-white font-display">Score</h1>
          <p className="text-muted-foreground mt-2">Gain (Appraisal, Billing, Payment)</p>
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
              <DialogTitle>Create Document</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="clientName" render={({field}) => (
                  <FormItem><FormLabel>Entity / Client</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="amount" render={({field}) => (
                  <FormItem><FormLabel>Amount</FormLabel><FormControl><Input {...field} type="number" step="0.01" className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="status" render={({field}) => (
                    <FormItem><FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-secondary/50 border-white/10 text-white"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="estimate">Estimate</SelectItem>
                          <SelectItem value="invoice">Invoice</SelectItem>
                          <SelectItem value="receipt">Receipt</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select><FormMessage/>
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="type" render={({field}) => (
                    <FormItem><FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-secondary/50 border-white/10 text-white"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                          <SelectItem value="appraisal">Appraisal</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                        </SelectContent>
                      </Select><FormMessage/>
                    </FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="dueDate" render={({field}) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ''} onChange={e => field.onChange(new Date(e.target.value).toISOString())} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Entry"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="gain" className="space-y-6">
        <TabsList className="bg-card border border-white/5 p-1">
          <TabsTrigger value="gain">
            <TrendingUp className="w-4 h-4 mr-2" /> Gain
          </TabsTrigger>
          <TabsTrigger value="appraisal">
            <Scale className="w-4 h-4 mr-2" /> Appraisal
          </TabsTrigger>
          <TabsTrigger value="payment">
            <Wallet className="w-4 h-4 mr-2" /> Payment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gain">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Appraisal" value="Estimate" icon={Scale} />
            <MetricCard title="Billing" value="Invoice|Receipt" icon={Receipt} />
            <MetricCard title="Payment" value="Withdrawal|Deposit" icon={Wallet} />
          </div>
          <ScoreTable data={score} loading={isLoading} />
        </TabsContent>

        <TabsContent value="appraisal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Estimate" value="Plan | Quote" icon={Scale} />
            <MetricCard title="Evaluation" value="Audit | Review" icon={FileText} />
            <MetricCard title="Assessment" value="Risk | Return" icon={TrendingUp} />
          </div>
          <ScoreTable data={score?.filter(s => s.status === 'estimate')} loading={isLoading} />
        </TabsContent>

        <TabsContent value="payment">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Deposit" value="Inflow | Credits" icon={Wallet} />
            <MetricCard title="Withdrawal" value="Outflow | Debits" icon={Receipt} />
            <MetricCard title="Transfers" value="Internal | Flow" icon={CheckCircle2} />
          </div>
          <ScoreTable data={score?.filter(s => s.type === 'deposit' || s.type === 'withdrawal')} loading={isLoading} />
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

function ScoreTable({ data, loading }: { data: any, loading: boolean }) {
  return (
    <Card className="glass-card rounded-2xl overflow-hidden border-none">
      <table className="w-full text-left">
        <thead className="bg-white/5 border-b border-white/5">
          <tr>
            <th className="p-4 font-medium text-muted-foreground text-sm">ID</th>
            <th className="p-4 font-medium text-muted-foreground text-sm">Entity</th>
            <th className="p-4 font-medium text-muted-foreground text-sm">Date</th>
            <th className="p-4 font-medium text-muted-foreground text-sm">Type</th>
            <th className="p-4 font-medium text-muted-foreground text-sm">Status</th>
            <th className="p-4 font-medium text-muted-foreground text-sm text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
          ) : data?.length === 0 ? (
            <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No entries found</td></tr>
          ) : (
            data?.map((item: any) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm font-mono text-muted-foreground">#SC-{item.id.toString().padStart(4, '0')}</td>
                <td className="p-4 font-medium text-white">{item.clientName}</td>
                <td className="p-4 text-sm text-white/80">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</td>
                <td className="p-4 text-sm text-muted-foreground capitalize">{item.type}</td>
                <td className="p-4">
                  <Badge variant={item.status === 'paid' ? 'default' : 'outline'} className={item.status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {item.status}
                  </Badge>
                </td>
                <td className="p-4 text-right font-mono font-medium text-white">
                  ${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}

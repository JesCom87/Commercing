import { Shell } from "@/components/layout/Shell";
import { useInvoices, useCreateInvoice } from "@/hooks/use-score";
import { Plus, Download, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInvoiceSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

export default function Score() {
  const { data: invoices, isLoading } = useInvoices();
  const createMutation = useCreateInvoice();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertInvoiceSchema),
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
          <p className="text-muted-foreground mt-2">Invoicing, billing, and payments.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create Document</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="clientName" render={({field}) => (
                  <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
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
                        </SelectContent>
                      </Select><FormMessage/>
                    </FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="dueDate" render={({field}) => (
                  <FormItem><FormLabel>Due Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ''} onChange={e => field.onChange(new Date(e.target.value).toISOString())} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Invoice"}
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
              <th className="p-4 font-medium text-muted-foreground text-sm">Invoice ID</th>
              <th className="p-4 font-medium text-muted-foreground text-sm">Client</th>
              <th className="p-4 font-medium text-muted-foreground text-sm">Date</th>
              <th className="p-4 font-medium text-muted-foreground text-sm">Due Date</th>
              <th className="p-4 font-medium text-muted-foreground text-sm">Status</th>
              <th className="p-4 font-medium text-muted-foreground text-sm text-right">Amount</th>
              <th className="p-4 font-medium text-muted-foreground text-sm"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading invoices...</td></tr>
            ) : invoices?.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No invoices found</td></tr>
            ) : (
              invoices?.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-mono text-muted-foreground">INV-{invoice.id.toString().padStart(4, '0')}</td>
                  <td className="p-4 font-medium text-white">{invoice.clientName}</td>
                  <td className="p-4 text-sm text-white/80">{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="p-4 text-sm text-white/80">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</td>
                  <td className="p-4">
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'outline'} className={invoice.status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right font-mono font-medium text-white">
                    ${Number(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </Button>
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

import { Shell } from "@/components/layout/Shell";
import { useInventory, useCreateInventoryItem, useEmployees, useCreateEmployee } from "@/hooks/use-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Package, Users } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInventorySchema, insertEmployeeSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function Field() {
  const { data: inventory, isLoading: isLoadingInv } = useInventory();
  const { data: employees, isLoading: isLoadingEmp } = useEmployees();
  
  return (
    <Shell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-display">Field</h1>
        <p className="text-muted-foreground mt-2">Supply chain logistics & human resources.</p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="bg-card border border-white/5 p-1">
          <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="w-4 h-4 mr-2" /> Inventory
          </TabsTrigger>
          <TabsTrigger value="employees" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="w-4 h-4 mr-2" /> Employees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <InventorySection data={inventory} loading={isLoadingInv} />
        </TabsContent>

        <TabsContent value="employees">
          <EmployeeSection data={employees} loading={isLoadingEmp} />
        </TabsContent>
      </Tabs>
    </Shell>
  );
}

function InventorySection({ data, loading }: { data: any, loading: boolean }) {
  const createMutation = useCreateInventoryItem();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(insertInventorySchema),
    defaultValues: {
      name: "",
      sku: "",
      quantity: 0,
      category: "material",
      status: "stocked",
      location: "",
    }
  });

  const onSubmit = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white">
            <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({field}) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="sku" render={({field}) => (
                    <FormItem><FormLabel>SKU</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                  )}/>
                  <FormField control={form.control} name="quantity" render={({field}) => (
                    <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="category" render={({field}) => (
                  <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-secondary/50 border-white/10 text-white"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="asset">Asset</SelectItem>
                    </SelectContent>
                  </Select><FormMessage/></FormItem>
                )}/>
                <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Item"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : data?.map((item: any) => (
          <div key={item.id} className="glass-card p-6 rounded-xl hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">{item.sku}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.quantity < 10 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {item.quantity} units
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-white/5">
              <span className="capitalize">{item.category}</span>
              <span className="capitalize">{item.location || 'Unassigned'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeeSection({ data, loading }: { data: any, loading: boolean }) {
  const createMutation = useCreateEmployee();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(insertEmployeeSchema),
    defaultValues: {
      name: "",
      role: "",
      department: "",
      email: "",
      status: "active",
    }
  });

  const onSubmit = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white">
            <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({field}) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({field}) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="department" render={({field}) => (
                    <FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                  )}/>
                  <FormField control={form.control} name="role" render={({field}) => (
                    <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                  )}/>
                </div>
                <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add Employee"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : data?.map((employee: any) => (
          <div key={employee.id} className="glass-card p-6 rounded-xl hover:border-primary/50 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              {employee.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
              <p className="text-sm text-primary">{employee.role}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{employee.department} • {employee.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

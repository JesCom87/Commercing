import { Shell } from "@/components/layout/Shell";
import { useInventory, useCreateInventoryItem, useEmployees, useCreateEmployee } from "@/hooks/use-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, Megaphone, ShieldCheck, MapPin, ShoppingCart, Truck, ClipboardList, GraduationCap, Heart } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInventorySchema, insertEmployeeSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";

export default function Field() {
  const { data: inventory, isLoading: isLoadingInv } = useInventory();
  const { data: employees, isLoading: isLoadingEmp } = useEmployees();
  
  return (
    <Shell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-display">Field</h1>
        <p className="text-muted-foreground mt-2">Marketing, Supply Chain, and Human Resources.</p>
      </div>

      <Tabs defaultValue="marketing" className="space-y-6">
        <TabsList className="bg-card border border-white/5 p-1">
          <TabsTrigger value="marketing">
            <Megaphone className="w-4 h-4 mr-2" /> Marketing
          </TabsTrigger>
          <TabsTrigger value="supplychain">
            <ShoppingCart className="w-4 h-4 mr-2" /> Supply Chain
          </TabsTrigger>
          <TabsTrigger value="hr">
            <Users className="w-4 h-4 mr-2" /> Human Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Endorsement" value="Promoting | Advertising" icon={Megaphone} />
            <MetricCard title="Environment" value="Scanning | Auditing" icon={ShieldCheck} />
            <MetricCard title="Emplacement" value="Researching | Positioning" icon={MapPin} />
          </div>
          <InventorySection data={inventory?.filter(i => i.subcategory === 'PublicRelation')} loading={isLoadingInv} subcategory="PublicRelation" />
        </TabsContent>

        <TabsContent value="supplychain">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Procurement" value="Sourcing | Bearing" icon={Truck} />
            <MetricCard title="Attainment" value="Provisioning | Logisting" icon={ShoppingCart} />
            <MetricCard title="Consignment" value="Listing | Vending" icon={ClipboardList} />
          </div>
          <InventorySection data={inventory?.filter(i => i.subcategory === 'PurchaseOrder')} loading={isLoadingInv} subcategory="PurchaseOrder" />
        </TabsContent>

        <TabsContent value="hr">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Enrollment" value="Recruiting | Onboarding" icon={Users} />
            <MetricCard title="Endearment" value="Training | Educating" icon={GraduationCap} />
            <MetricCard title="Engagement" value="Registering | Vacationing" icon={Heart} />
          </div>
          <EmployeeSection data={employees} loading={isLoadingEmp} />
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

function InventorySection({ data, loading, subcategory }: { data: any, loading: boolean, subcategory: string }) {
  const createMutation = useCreateInventoryItem();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(insertInventorySchema),
    defaultValues: {
      name: "",
      sku: "",
      quantity: 0,
      category: "material",
      subcategory: subcategory,
      detail: "",
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
              <Plus className="w-4 h-4 mr-2" /> Add {subcategory === 'PublicRelation' ? 'Campaign' : 'Item'}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white">
            <DialogHeader><DialogTitle>Add {subcategory === 'PublicRelation' ? 'Marketing Campaign' : 'Inventory Item'}</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({field}) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="sku" render={({field}) => (
                    <FormItem><FormLabel>SKU / ID</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                  )}/>
                  <FormField control={form.control} name="quantity" render={({field}) => (
                    <FormItem><FormLabel>Quantity / Target</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="detail" render={({field}) => (
                  <FormItem><FormLabel>Detail</FormLabel><FormControl><Input {...field} className="bg-secondary/50 border-white/10 text-white"/></FormControl><FormMessage/></FormItem>
                )}/>
                <Button type="submit" className="w-full bg-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : data?.map((item: any) => (
          <Card key={item.id} className="glass-card p-6 rounded-xl hover:border-primary/50 transition-colors">
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
            <p className="text-sm text-muted-foreground mb-4">{item.detail}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-white/5">
              <span className="capitalize">{item.category}</span>
              <span className="capitalize">{item.location || 'Unassigned'}</span>
            </div>
          </Card>
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
      subcategory: "Personnel",
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
              <Plus className="w-4 h-4 mr-2" /> Add Personnel
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white">
            <DialogHeader><DialogTitle>Add Personnel</DialogTitle></DialogHeader>
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
                  {createMutation.isPending ? "Adding..." : "Add Personnel"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : data?.map((employee: any) => (
          <Card key={employee.id} className="glass-card p-6 rounded-xl hover:border-primary/50 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              {employee.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
              <p className="text-sm text-primary">{employee.role}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{employee.department} • {employee.status}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

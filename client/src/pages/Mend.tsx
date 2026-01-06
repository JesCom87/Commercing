import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { ShoppingCart, HeartHandshake, Package, User, Truck, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Mend() {
  return (
    <Shell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white font-display">Mend</h1>
        <p className="text-muted-foreground mt-2">Sales optimization and customer support.</p>
      </header>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="bg-card border border-white/5 p-1">
          <TabsTrigger value="sales">
            <ShoppingCart className="w-4 h-4 mr-2" /> Product
          </TabsTrigger>
          <TabsTrigger value="support">
            <HeartHandshake className="w-4 h-4 mr-2" /> Customer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Inventory" value="Listing | Vending" icon={Package} />
            <MetricCard title="Fulfillment" value="Provisioning | Delivering" icon={Truck} />
            <MetricCard title="Sales" value="Trading | Commerce" icon={ShoppingCart} />
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-center justify-center border border-dashed border-white/10">
            <p className="text-muted-foreground">Sales pipeline data will appear here.</p>
          </div>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard title="Relations" value="Scanning | Auditing" icon={User} />
            <MetricCard title="Success" value="Teaching | Guiding" icon={HeartHandshake} />
            <MetricCard title="Feedback" value="Past | Future" icon={Activity} />
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-center justify-center border border-dashed border-white/10">
            <p className="text-muted-foreground">Support tickets and feedback will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}

function MetricCard({ title, value, icon: Icon }: { title: string, value: string, icon: any }) {
  return (
    <Card className="glass-card border-white/5 p-6 hover-elevate transition-all">
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

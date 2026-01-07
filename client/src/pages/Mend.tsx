import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { ShoppingCart, HeartHandshake, Package, User, Truck, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Mend() {
  return (
    <Shell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white font-display">Mend</h1>
        <p className="text-muted-foreground mt-2">Sales | Support</p>
      </header>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="bg-card border border-white/5 p-1">
          <TabsTrigger value="sales">
            <ShoppingCart className="w-4 h-4 mr-2" /> Sales
          </TabsTrigger>
          <TabsTrigger value="support">
            <HeartHandshake className="w-4 h-4 mr-2" /> Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MetricCard title="Sales" value="Product" icon={Package} />
            <div className="glass-card p-6 rounded-2xl flex items-center justify-center border border-dashed border-white/10">
              <p className="text-muted-foreground">Product listing details will appear here.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MetricCard title="Support" value="Customer" icon={User} />
            <div className="glass-card p-6 rounded-2xl flex items-center justify-center border border-dashed border-white/10">
              <p className="text-muted-foreground">Customer support interactions will appear here.</p>
            </div>
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

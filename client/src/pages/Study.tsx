import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Coins, TrendingUp, Landmark, ShieldCheck } from "lucide-react";

export default function Study() {
  return (
    <Shell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white font-display">Commercing</h1>
        <p className="text-muted-foreground mt-2">Study Layer: Foundations and Evolution.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Money" value="Money" icon={Coins} />
        <MetricCard title="Evolution" value="Cash → Accrual" icon={TrendingUp} />
        <MetricCard title="Worthability" value="Cost | Value | Price" icon={Landmark} />
        <MetricCard title="Organization" value="Mgmt | Admin" icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Commercing:</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Money</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Cash to Accrual is Evolving</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Cost|Value|Price=Worthabilty</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Management|Administration=Organization</li>
          </ul>
        </Card>
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Enterprise Framework</h3>
          <p className="text-muted-foreground leading-relaxed">
            The Commercing study layer provides the conceptual integrity for all operational sectors. 
            By organizing management and administration, we establish the structural foundation required 
            for sustainable growth and precise tracking across Office, Field, Outfit, Agenda, Score, and Mend.
          </p>
        </Card>
      </div>
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

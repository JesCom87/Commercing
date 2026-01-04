import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ComponentType<any>;
}

export function StatCard({ title, value, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:bg-primary/10" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 bg-secondary/50 rounded-xl">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold font-display tracking-tight text-white">{value}</p>
      </div>
    </div>
  );
}

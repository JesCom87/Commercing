import { Shell } from "@/components/layout/Shell";
import { StatCard } from "@/components/StatCard";
import { BarChart3, TrendingUp, Users, Package } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLedger } from "@/hooks/use-office";

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export default function Dashboard() {
  const { data: ledger } = useLedger();

  // Simple calculation for demo - in real app would use proper aggregations
  const totalRevenue = ledger?.reduce((acc, curr) => 
    curr.type === 'credit' ? acc + Number(curr.amount) : acc, 0) || 0;

  const totalExpense = ledger?.reduce((acc, curr) => 
    curr.type === 'debit' ? acc + Number(curr.amount) : acc, 0) || 0;

  return (
    <Shell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white font-display">Command Center</h1>
        <p className="text-muted-foreground mt-2">Real-time overview of enterprise performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          trend={{ value: "+12.5%", isPositive: true }}
          icon={TrendingUp}
        />
        <StatCard 
          title="Total Expenses" 
          value={`$${totalExpense.toLocaleString()}`} 
          trend={{ value: "-2.4%", isPositive: true }}
          icon={BarChart3}
        />
        <StatCard 
          title="Active Employees" 
          value="24" 
          trend={{ value: "+4", isPositive: true }}
          icon={Users}
        />
        <StatCard 
          title="Inventory Items" 
          value="156" 
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New order received</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

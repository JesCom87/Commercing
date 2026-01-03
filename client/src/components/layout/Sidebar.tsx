import { Link, useLocation } from "wouter";
import { Building2, Truck, Factory, Calendar, Coins, LayoutDashboard } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const menu = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/office", label: "Office", icon: Building2 },
    { path: "/field", label: "Field", icon: Truck },
    { path: "/outfit", label: "Outfit", icon: Factory },
    { path: "/agenda", label: "Agenda", icon: Calendar },
    { path: "/score", label: "Score", icon: Coins },
  ];

  return (
    <aside className="w-64 fixed h-screen bg-card/50 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl font-display">
          C
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white font-display">Commercing</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={`nav-item cursor-pointer ${isActive ? "active" : "text-muted-foreground"}`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/5">
        <div className="glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
              JD
            </div>
            <div>
              <p className="text-sm font-medium text-white">Jane Doe</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Office from "@/pages/Office";
import Field from "@/pages/Field";
import Outfit from "@/pages/Outfit";
import Agenda from "@/pages/Agenda";
import Score from "@/pages/Score";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/office" component={Office} />
      <Route path="/field" component={Field} />
      <Route path="/outfit" component={Outfit} />
      <Route path="/agenda" component={Agenda} />
      <Route path="/score" component={Score} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

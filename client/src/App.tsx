import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/Sidebar";
import { FloatingAqiWidget } from "@/components/FloatingAqiWidget";
import { cn } from "@/lib/utils";

// Pages
import Dashboard from "@/pages/Dashboard";
import PlantRecommendations from "@/pages/PlantRecommendations";
import YourGarden from "@/pages/YourGarden";
import SolarCalculator from "@/pages/SolarCalculator";
import BrandImpact from "@/pages/BrandImpact";
import NotFound from "@/pages/NotFound";
import { GardenProvider } from "@/hooks/use-garden";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/plants" component={PlantRecommendations} />
      <Route path="/garden" component={YourGarden} />
      <Route path="/solar" component={SolarCalculator} />
      <Route path="/brands" component={BrandImpact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainContent() {
  const { collapsed } = useSidebar();
  
  return (
    <main className={cn(
      "flex-1 relative z-10 transition-all duration-300",
      collapsed ? "md:ml-20" : "md:ml-72"
    )}>
      <div className="container mx-auto p-6 md:p-12 pt-24 md:pt-12 min-h-screen">
        <Router />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GardenProvider>
          <SidebarProvider>
            <div className="flex min-h-screen bg-[#0a1a14] text-white font-body selection:bg-primary/20 overflow-x-hidden relative">
              <FloatingAqiWidget />
              <Sidebar />
              <MainContent />
            </div>
          </SidebarProvider>
        </GardenProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FloatingAqiWidget() {
  const [aqi, setAqi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Loading...");
  const [color, setColor] = useState<string>("bg-gray-500");

  useEffect(() => {
    // Simulated AQI data for the demonstration
    // In a real app, this would fetch from an API like OpenWeather or AirVisual
    const timer = setTimeout(() => {
      const mockAqi = 42;
      setAqi(mockAqi);
      if (mockAqi <= 50) {
        setStatus("Good");
        setColor("bg-emerald-500");
      } else if (mockAqi <= 100) {
        setStatus("Moderate");
        setColor("bg-yellow-500");
      } else {
        setStatus("Unhealthy");
        setColor("bg-red-500");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[100] pointer-events-auto">
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="bg-[#0f2a20]/80 backdrop-blur-md border-[#1a3a2e] p-3 flex items-center gap-3 shadow-2xl hover:bg-[#1a3a2e]/90 transition-all duration-300 cursor-help">
            <div className={`p-2 rounded-full ${color}/20 text-white`}>
              <Wind className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">AQI Display</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white leading-none">
                  {aqi !== null ? aqi : "--"}
                </span>
                <Badge variant="outline" className={`text-[10px] h-4 px-1.5 border-none ${color} text-white`}>
                  {status}
                </Badge>
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-[#0f2a20] border-[#1a3a2e] text-white">
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3 text-primary" />
            <p className="text-xs">Real-time Air Quality Index for your current area</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

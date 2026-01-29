import { PageHeader } from "@/components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ThermometerSun, MapPin, Wind, Droplets, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Generate a grid of "heat" values with extra metadata
const GRID_SIZE = 12;
const generateHeatData = () => {
  const data = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    
    const dist1 = Math.sqrt(Math.pow(x - 4, 2) + Math.pow(y - 4, 2));
    const dist2 = Math.sqrt(Math.pow(x - 9, 2) + Math.pow(y - 9, 2));
    
    let heat = 0;
    heat += Math.max(0, 10 - dist1 * 1.5); 
    heat += Math.max(0, 8 - dist2 * 1.2);
    
    const val = Math.min(10, heat + Math.random() * 0.5);
    data.push({
      id: i,
      heat: val,
      temp: 24 + (val * 1.2),
      co2: 400 + (val * 15),
      humidity: 45 + (val * 2),
      vegetation: Math.max(0, 100 - (val * 12))
    });
  }
  return data;
};

const getHeatColor = (value: number) => {
  if (value > 8) return "bg-rose-500 shadow-rose-500/50";
  if (value > 6) return "bg-orange-500 shadow-orange-500/50";
  if (value > 4) return "bg-amber-400 shadow-amber-400/50";
  if (value > 2) return "bg-emerald-400 shadow-emerald-400/50";
  return "bg-teal-600 shadow-teal-600/50";
};

export default function HeatMap() {
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const heatData = useMemo(() => generateHeatData(), []);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <PageHeader 
        title="High-Resolution Thermal Analysis" 
        description="Real-time satellite-assisted micro-climate mapping showing urban heat signatures and environmental impact zones."
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <Card className="relative p-6 bg-black/40 border-white/5 backdrop-blur-xl overflow-hidden group">
          {/* Scanning Line Animation */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none border-t border-primary/20 bg-gradient-to-b from-primary/5 to-transparent h-[100px] w-full"
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-0 grid grid-cols-12 gap-1.5 aspect-square w-full h-full max-w-2xl mx-auto">
            {heatData.map((point, idx) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: idx * 0.002, duration: 0.4 }}
                className={cn(
                  getHeatColor(point.heat),
                  "rounded-[2px] cursor-crosshair transition-all duration-300",
                  "hover:scale-125 hover:z-20 hover:ring-2 hover:ring-white/50",
                  hoveredPoint?.id === point.id ? "scale-125 z-20 ring-2 ring-white" : "opacity-80"
                )}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                layoutId={`heat-point-${point.id}`}
              />
            ))}
          </div>

          {/* Location Markers */}
          <div className="absolute top-1/4 left-1/4 flex flex-col items-center group/marker pointer-events-none">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-white/90 shadow-2xl transition-transform group-hover/marker:scale-110">
              City Center
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent mt-1" />
          </div>

          <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center group/marker pointer-events-none">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-white/90 shadow-2xl transition-transform group-hover/marker:scale-110">
              Industrial Hub
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent mt-1" />
          </div>
        </Card>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {hoveredPoint ? (
              <motion.div
                key="data-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <Card className="p-5 bg-primary/10 border-primary/20 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Micro-Zone Analysis</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm text-white/50">Temperature</span>
                      <span className="text-2xl font-mono font-bold text-white">{hoveredPoint.temp.toFixed(1)}°C</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1 text-white/40">
                          <Wind className="w-3 h-3" />
                          <span className="text-[10px] uppercase font-bold">CO₂</span>
                        </div>
                        <span className="text-sm font-mono font-bold">{hoveredPoint.co2.toFixed(0)}ppm</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1 text-white/40">
                          <Droplets className="w-3 h-3" />
                          <span className="text-[10px] uppercase font-bold">Hum</span>
                        </div>
                        <span className="text-sm font-mono font-bold">{hoveredPoint.humidity.toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                        <span>Vegetation Density</span>
                        <span>{hoveredPoint.vegetation.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-emerald-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${hoveredPoint.vegetation}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Climate Impact
                  </h4>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {hoveredPoint.heat > 7 
                      ? "High density urban area showing significant thermal retention. Mitigation through reflective surfaces suggested."
                      : "Moderate to optimal thermal profile. Maintaining existing canopy coverage is recommended for stability."}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center text-center justify-center min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-pulse">
                  <ThermometerSun className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-sm text-white/20 font-medium">Hover over map zones to view<br />detailed environmental metrics</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="p-5 bg-white/5 border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Legend</h3>
            <div className="space-y-3">
              {[
                { label: "Critical Hotspot", color: "bg-rose-500", shadow: "shadow-rose-500/20" },
                { label: "Urban Heat", color: "bg-orange-500", shadow: "shadow-orange-500/20" },
                { label: "Moderate", color: "bg-amber-400", shadow: "shadow-amber-400/20" },
                { label: "Temperate", color: "bg-emerald-400", shadow: "shadow-emerald-400/20" },
                { label: "Cold/Vegetated", color: "bg-teal-600", shadow: "shadow-teal-600/20" }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 group cursor-default">
                  <div className={cn("w-3 h-3 rounded-full transition-all group-hover:scale-125", item.color, item.shadow)} />
                  <span className="text-[11px] font-medium text-white/40 group-hover:text-white/70 transition-colors uppercase tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


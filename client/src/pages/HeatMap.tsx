import { PageHeader } from "@/components/PageHeader";
import { motion } from "framer-motion";
import { ThermometerSun } from "lucide-react";
import { cn } from "@/lib/utils";

// Generate a grid of "heat" values
const GRID_SIZE = 10;
const generateHeatData = () => {
  const data = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    // Generate some Perlin-noise-ish clusters
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    
    // Simple distance-based heat center at (3,3) and (7,8)
    const dist1 = Math.sqrt(Math.pow(x - 3, 2) + Math.pow(y - 3, 2));
    const dist2 = Math.sqrt(Math.pow(x - 7, 2) + Math.pow(y - 8, 2));
    
    let heat = 0;
    heat += Math.max(0, 10 - dist1 * 2); 
    heat += Math.max(0, 8 - dist2 * 1.5);
    
    // Normalize roughly 0-10
    data.push(Math.min(10, heat));
  }
  return data;
};

const heatData = generateHeatData();

const getHeatColor = (value: number) => {
  if (value > 8) return "bg-red-500";
  if (value > 6) return "bg-orange-500";
  if (value > 4) return "bg-yellow-400";
  if (value > 2) return "bg-green-400";
  return "bg-emerald-600";
};

export default function HeatMap() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader 
        title="Regional Heat Map" 
        description="Visualize temperature zones and urban heat islands in your area to understand local climate micro-patterns."
      />

      <div className="solar-card solar-gradient-border p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 aspect-square max-w-xl mx-auto relative bg-white/5 rounded-xl overflow-hidden p-4 border border-white/10">
            <div className="grid grid-cols-10 grid-rows-10 gap-1 w-full h-full">
              {heatData.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.005 }}
                  className={`${getHeatColor(val)} rounded-sm shadow-sm cursor-pointer hover:brightness-125 transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                  title={`Heat Index: ${val.toFixed(1)}`}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                />
              ))}
            </div>
            
            {/* Map Labels Overlay */}
            <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold shadow-xl pointer-events-none solar-glow-text">
              Downtown
            </div>
            <div className="absolute bottom-12 right-12 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold shadow-xl pointer-events-none solar-glow-text">
              Industrial Park
            </div>
          </div>

          <div className="lg:w-72 flex flex-col justify-center space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-bold flex items-center gap-2 mb-4 solar-glow-text">
                <ThermometerSun className="w-5 h-5 text-rose-500" />
                Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="text-sm text-white/60">Extreme Heat</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                  <span className="text-sm text-white/60">High Heat</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  <span className="text-sm text-white/60">Moderate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                  <span className="text-sm text-white/60">Cool</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]" />
                  <span className="text-sm text-white/60">Optimal</span>
                </div>
              </div>
            </div>

            <div className="text-white/40 text-sm leading-relaxed">
              <p>
                <strong className="text-white/60">Analysis:</strong> The downtown area exhibits typical Urban Heat Island effects due to concrete density. 
              </p>
              <p className="mt-4">
                <strong className="text-white/60">Recommendation:</strong> Increasing green roof coverage in red zones could lower ambient temperatures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

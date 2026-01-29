import { PageHeader } from "@/components/PageHeader";
import { useGarden } from "@/hooks/use-garden";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Droplets, Trash2, Sprout } from "lucide-react";
import { Link } from "wouter";

export default function YourGarden() {
  const { garden, removeFromGarden } = useGarden();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader 
        title="Your Garden" 
        description="Your personal collection of selected plants and herbs."
        className="solar-glow-text mb-8"
      />

      {garden.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center text-center text-white/20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
          <Sprout className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg mb-4">Your garden is empty</p>
          <Link href="/plants">
            <Button variant="outline" className="border-solar-glow text-solar-glow hover:bg-solar-glow hover:text-black">
              Browse Plants
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {garden.map((plant) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="solar-card solar-gradient-border hover:bg-white/10 transition-all duration-500 flex flex-col h-full group"
              >
                <div className="p-5 flex-1 flex flex-col relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-white mb-1 group-hover:text-solar-glow transition-colors">{plant.name}</h3>
                      <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/10 text-white shadow-xl mt-2">
                        {plant.careIntensity} Care
                      </Badge>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => removeFromGarden(plant.id)}
                      className="text-white/40 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Sun className="w-4 h-4 text-solar-glow" />
                      <span className="capitalize">Sunlight: {plant.sunlight}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="capitalize">Water: {plant.watering}</span>
                    </div>
                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-xs font-bold text-solar-glow uppercase tracking-wider mb-1">Medicinal Value</p>
                      <p className="text-sm text-white/80 leading-relaxed">{plant.medicinalValue}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

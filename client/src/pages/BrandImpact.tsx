import { PageHeader } from "@/components/PageHeader";
import { useBrandScore } from "@/hooks/use-brands";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Leaf, Recycle, Award } from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { cn } from "@/lib/utils";

export default function BrandImpact() {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  
  const { data: brand, isLoading, isError } = useBrandScore(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchTerm);
  };

  const chartData = brand ? [{ name: 'Score', value: brand.score, fill: brand.score > 70 ? '#10b981' : brand.score > 40 ? '#f59e0b' : '#ef4444' }] : [];

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="Brand Impact Score" 
        description="Search for major brands to see their environmental impact rating, packaging sustainability, and eco-friendliness."
        className="solar-glow-text"
      />

      <div className="relative max-w-2xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative">
          <Input 
            className="w-full h-16 pl-6 pr-32 rounded-full shadow-2xl border border-white/10 focus:ring-solar-glow/50 text-lg bg-white/5 backdrop-blur-md transition-all solar-glow-text"
            placeholder="Search brand (e.g. Nike, Apple, Nestle)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-2 top-2 h-12 px-8 rounded-full font-bold bg-gradient-to-r from-solar-glow to-amber-500 hover:from-amber-500 hover:to-solar-glow text-black shadow-lg"
            disabled={!searchTerm}
          >
            Search
          </Button>
        </form>
      </div>

      <div className="min-h-[400px]">
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin text-solar-glow"><Search className="w-12 h-12" /></div>
            <div className="animate-pulse text-solar-glow font-bold text-xl">Analyzing Brand Data...</div>
          </div>
        )}

        {isError && (
          <div className="text-center text-white/20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">Could not find data for that brand.</p>
          </div>
        )}

        {!query && !brand && (
           <div className="text-center text-white/20 mt-20">
             <div className="inline-flex gap-4 opacity-30 mb-4">
                <Leaf className="w-12 h-12" />
                <Recycle className="w-12 h-12" />
                <Award className="w-12 h-12" />
             </div>
             <p className="text-lg">Enter a brand name to reveal its impact.</p>
           </div>
        )}

        {brand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Score Visual */}
            <div className="solar-card solar-gradient-border p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
              <h2 className="text-3xl font-display font-bold text-white mb-2 solar-glow-text">{brand.name}</h2>
              <div className="h-64 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="80%" 
                      outerRadius="100%" 
                      barSize={20} 
                      data={chartData} 
                      startAngle={90} 
                      endAngle={-270}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar
                        background={{ fill: 'rgba(255,255,255,0.05)' }}
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-6xl font-bold font-display solar-glow-text">{brand.score}</span>
                    <span className="text-sm font-medium text-white/40 uppercase tracking-widest mt-1">Eco Score</span>
                 </div>
              </div>
              <p className={cn(
                "mt-4 font-bold px-6 py-2 rounded-full shadow-lg",
                brand.score > 70 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-solar-glow/20 text-solar-glow border border-solar-glow/30'
              )}>
                {brand.ecoRating} Rating
              </p>
              
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)] pointer-events-none" />
            </div>

            {/* Details Cards */}
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="solar-card solar-gradient-border p-6 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-solar-glow/20 rounded-xl text-solar-glow shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                     <Recycle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Packaging Impact</h4>
                    <p className="text-white/40 text-sm">Materials & Recyclability</p>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed pl-16">
                  {brand.packagingImpact}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="solar-card solar-gradient-border p-6 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                     <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Eco Rating</h4>
                    <p className="text-white/40 text-sm">Overall sustainability</p>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed pl-16">
                  Rated as <strong className="text-emerald-400">{brand.ecoRating}</strong> based on carbon footprint and supply chain ethics.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

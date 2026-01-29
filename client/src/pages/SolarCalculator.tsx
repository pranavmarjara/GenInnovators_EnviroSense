import { PageHeader } from "@/components/PageHeader";
import { useSolarCalculator } from "@/hooks/use-solar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateSolarSchema, type CalculateSolarRequest } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sun, Wind, MapPin, Zap, CheckCircle2, TrendingUp, Wallet, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

function CircularGauge({ value, label }: { value: number; label: string }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Recommended Panels</span>
          <span className="text-5xl md:text-6xl font-bold solar-glow-text leading-none">5</span>
          <div className="h-px w-8 bg-white/10 my-2" />
          <span className="text-3xl md:text-4xl font-bold solar-glow-text leading-none">{value}%</span>
        </div>
      </div>
      
      {/* Label below the circle */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-center">
        <span className="text-[10px] md:text-xs text-white/80 leading-tight uppercase tracking-wider block max-w-[200px] mx-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {label}
        </span>
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-solar-glow/5 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  );
}

export default function SolarCalculator() {
  const { mutate, isPending, data: result } = useSolarCalculator();

  const form = useForm<CalculateSolarRequest>({
    resolver: zodResolver(calculateSolarSchema),
    defaultValues: {
      zip: "90210",
      dailyKwh: 25,
    },
  });

  const onSubmit = (data: CalculateSolarRequest) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#030806] text-white p-4 md:p-8 font-display">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight solar-glow-text">
              Solar Intelligence
            </h1>
            <p className="text-white/60 text-lg">
              Make smarter energy decisions for your location
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
              <Sun className="w-5 h-5 text-solar-glow" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">Sunlight: High</p>
                <TrendingUp className="w-3 h-3 text-solar-glow" />
              </div>
            </div>
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
              <Wind className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">AQI Impact:</p>
                <p className="text-xs font-semibold">Low Loss</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">Region:</p>
                <p className="text-xs font-semibold text-emerald-400">Favorable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Energy Profile Card */}
          <div className="lg:col-span-4 solar-card solar-gradient-border p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-solar-glow" />
              <h2 className="text-xl font-bold">Energy Profile</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs uppercase tracking-widest">ZIP Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="90210" 
                          {...field} 
                          className="bg-black/40 border-white/10 h-12 rounded-xl focus:ring-solar-glow/50" 
                        />
                      </FormControl>
                      <p className="text-[10px] text-white/40">Used to determine sunlight & AQI</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyKwh"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel className="text-white/60 text-xs uppercase tracking-widest">Daily Load (kWh)</FormLabel>
                        <span className="text-solar-glow font-bold">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={1}
                          max={50}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-4"
                        />
                      </FormControl>
                      <div className="flex justify-between text-[10px] text-white/40">
                        <span>1</span>
                        <span>50</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-solar-glow to-amber-500 hover:from-amber-500 hover:to-solar-glow text-black font-bold text-lg shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all duration-500 group overflow-hidden relative"
                >
                  {isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <span className="inline-block transition-all duration-300 transform group-hover:scale-95 whitespace-nowrap overflow-hidden text-ellipsis px-2 max-w-full text-[clamp(0.75rem,2.5cqi,1.125rem)]">
                      Analyze Solar Feasibility
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Results Display Card */}
          <div className="lg:col-span-8 solar-card solar-gradient-border p-8 flex flex-col items-center justify-center min-h-[450px]">
            <AnimatePresence mode="wait">
              {!result && !isPending && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                    <Sun className="w-10 h-10 text-white/20" />
                  </div>
                  <p className="text-white/40">Adjust parameters and analyze to see intelligence report</p>
                </motion.div>
              )}

              {isPending && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-solar-glow animate-spin" />
                  <p className="text-solar-glow/80 animate-pulse font-medium">Computing solar potential...</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-full flex flex-col items-center gap-8"
                >
                  <div className="flex items-center gap-3 self-start mb-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-white/90">
                      Solar installation is recommended for your location
                    </p>
                  </div>

                  <CircularGauge 
                    value={82} 
                    label="Estimated Offset of Daily Usage"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Background decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)] pointer-events-none" />
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Annual CO₂ Reduction</p>
              <p className="text-lg font-bold">~1.8 tons</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Wallet className="w-5 h-5 text-solar-glow" />
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Estimated Bill Savings</p>
              <p className="text-lg font-bold">₹61,000 / year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

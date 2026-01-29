import { Link } from "wouter";
import { ArrowRight, Leaf, Sun, BarChart3, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CARDS = [
  {
    title: "Unique experience",
    description: "We will show you the wonders of nature from an uncommon perspective.",
    href: "/plants",
    icon: Leaf,
    id: "01"
  },
  {
    title: "Comfortable setting",
    description: "Luxury eco-lodges designed for harmony and complete unity.",
    href: "/solar",
    icon: Sun,
    id: "02"
  },
  {
    title: "Vehicle free zone",
    description: "Pure environment with no vehicles, just peaceful serene atmosphere.",
    href: "/brands",
    icon: BarChart3,
    id: "03"
  }
];

export default function Dashboard() {
  return (
    <div className="w-full h-full space-y-12">
      {/* Preload Hero Image */}
      <link rel="preload" as="image" href="/images/hero-nature.png" />
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[3rem] overflow-hidden min-h-[70vh] flex flex-col justify-end p-12 md:p-20 shadow-2xl solar-gradient-border group"
      >
        <div 
          className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-105"
          style={{
            backgroundImage: 'url("/images/hero-nature.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#030806] via-[#030806]/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block text-white/50 text-xs font-bold uppercase tracking-[0.4em] mb-8 solar-glow-text">
              ABOUT US
            </span>
            <h1 className="text-6xl md:text-9xl font-display font-bold text-white mb-10 leading-[0.85] tracking-tight solar-glow-text">
              Get closer <br /> to nature
            </h1>
            <Link href="/plants" className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-all group/link text-lg font-medium">
              Check our values <ArrowRight className="w-5 h-5 transition-transform group-hover/link:translate-x-2 text-solar-glow" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <div className="grid grid-cols-1 gap-16 px-4">
        <div className="w-full">
          <div className="mb-16">
            <span className="text-solar-glow text-xs font-bold uppercase tracking-[0.4em] mb-6 block">FEATURES</span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight max-w-xl solar-glow-text">
                We make nature accessible
              </h2>
              <p className="text-white/40 max-w-[280px] text-base leading-relaxed font-medium">
                Welcome to the world of impressive beauty, harmony, and respect to nature.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {CARDS.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex"
              >
                <Link href={card.href} className="group block w-full p-6 md:p-8 lg:p-10 solar-card solar-gradient-border hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                  <span className="text-solar-glow font-display text-xl md:text-2xl font-bold mb-4 md:mb-8 block">{card.id}</span>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 md:mb-4 group-hover:text-solar-glow transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-white/40 text-sm md:text-base leading-relaxed">
                    {card.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

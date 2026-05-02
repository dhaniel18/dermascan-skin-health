import { Search, Sparkles, Target, Droplets, Shield, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const recentScans = [
  { brand: "SkinGlow", time: "2h ago", name: "Hydrating Face Serum", score: 72 },
  { brand: "CeraVe", time: "1d ago", name: "Gentle Foam Cleanser", score: 85 },
  { brand: "Klairs", time: "3d ago", name: "Vitamin C Serum", score: 68 },
];

const recommended = [
  { brand: "The Ordinary", name: "The Ordinary Niacinamide 10%", score: 95 },
  { brand: "COSRX", name: "COSRX Snail Mucin Essence", score: 88 },
  { brand: "Cetaphil", name: "Cetaphil Daily Hydrating Lotion", score: 92 },
];

const ScoreBadge = ({ score }: { score: number }) => (
  <span className="bg-periwinkle-soft text-navy text-xs font-bold px-2.5 py-1 rounded-full">
    {score}%
  </span>
);

const ProductRow = ({ brand, name, score, time }: { brand: string; name: string; score: number; time?: string }) => (
  <div className="bg-card rounded-2xl p-3 flex items-center gap-3 shadow-soft">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-periwinkle-soft to-peach-soft shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground">
        {brand}{time ? ` • ${time}` : ""}
      </div>
      <div className="font-semibold text-navy truncate text-sm">{name}</div>
    </div>
    <ScoreBadge score={score} />
  </div>
);

const Home = () => {
  return (
    <div className="px-6 pt-10 flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Hello! 👋</h1>
        <p className="text-muted-foreground mt-1">Let's find the perfect skincare for you</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input placeholder="Search products, brands, ingredients..." className="pl-11 pr-11 h-12 rounded-2xl bg-card border-border" />
        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-maroon" size={18} />
      </div>

      {/* Skin score card */}
      <div className="gradient-card rounded-3xl p-5 text-cloud shadow-card">
        <div className="text-sm font-medium opacity-90">Your Skin Score</div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-5xl font-extrabold">82</span>
          <span className="text-lg opacity-80">/100</span>
        </div>
        <p className="text-sm opacity-90 mt-2">Your routine is doing great! Keep it up.</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { icon: Target, label: "Acne Care", val: "Good" },
            { icon: Droplets, label: "Hydration", val: "Excellent" },
            { icon: Shield, label: "Protection", val: "Good" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="bg-cloud/15 rounded-xl p-2.5 backdrop-blur-sm">
                <Icon size={16} className="opacity-90" />
                <div className="text-[11px] mt-1 opacity-80">{m.label}</div>
                <div className="text-xs font-bold">{m.val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-gradient-to-r from-peach-soft to-periwinkle-soft rounded-2xl p-4 flex gap-3">
        <div className="w-10 h-10 rounded-full bg-cloud flex items-center justify-center shrink-0">
          💡
        </div>
        <div>
          <div className="font-bold text-navy">Tip of the Day</div>
          <p className="text-sm text-navy/80 mt-1">
            Niacinamide works great with most ingredients, but wait 30 minutes after using Vitamin C!
          </p>
        </div>
      </div>

      {/* Recent Scans */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-navy">Recent Scans</h2>
          <span className="text-sm text-maroon font-semibold">View All ›</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {recentScans.map((p) => (
            <ProductRow key={p.name} {...p} />
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-navy">Recommended for You</h2>
          <TrendingUp size={18} className="text-maroon" />
        </div>
        <div className="flex flex-col gap-2.5">
          {recommended.map((p) => (
            <ProductRow key={p.name} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

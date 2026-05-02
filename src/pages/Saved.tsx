import { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";

const items = [
  { brand: "The Ordinary", name: "The Ordinary Niacinamide 10%", price: "$6.50", score: 95 },
  { brand: "COSRX", name: "COSRX Snail Mucin Essence", price: "$18.00", score: 88 },
  { brand: "Paula's Choice", name: "Paula's Choice BHA Exfoliant", price: "$32.00", score: 91 },
];

const tabs = [
  { key: "wishlist", icon: Heart, label: "Wishlist" },
  { key: "products", icon: ShoppingBag, label: "Products" },
  { key: "favorites", icon: Star, label: "Favorites" },
];

const Saved = () => {
  const [active, setActive] = useState("wishlist");
  return (
    <div className="px-6 pt-10 flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Saved</h1>
        <p className="text-muted-foreground mt-1">Your wishlist, products, and favorites</p>
      </div>

      <div className="bg-card rounded-2xl p-1.5 flex gap-1 shadow-soft">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-1 h-11 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 ${
                isActive ? "gradient-primary text-cloud shadow-button" : "text-muted-foreground"
              }`}
            >
              <Icon size={16} /> 3
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((p) => (
          <div key={p.name} className="bg-card rounded-2xl p-3 flex items-center gap-3 shadow-soft">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-periwinkle-soft to-peach-soft shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">{p.brand}</div>
              <div className="font-semibold text-navy text-sm leading-tight">{p.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-navy">{p.price}</span>
                <span className="bg-periwinkle-soft text-navy text-[11px] font-bold px-2 py-0.5 rounded-full">{p.score}%</span>
              </div>
            </div>
            <Heart size={20} className="text-destructive fill-destructive" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saved;

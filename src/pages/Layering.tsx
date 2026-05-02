import BackHeader from "@/components/BackHeader";
import { CheckCircle2, AlertCircle, XCircle, Plus, X, Sun, Moon } from "lucide-react";

const selected = ["Vitamin C Serum", "Niacinamide", "Retinol Cream"];
const more = ["Hyaluronic Acid", "AHA/BHA Toner", "Sunscreen SPF 50", "Moisturizer"];

const Layering = () => {
  return (
    <div className="px-6 pt-10 flex flex-col gap-5">
      <BackHeader to="/home" />
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Layering Checker</h1>
        <p className="text-muted-foreground mt-1">Check if your products can be used together safely</p>
      </div>

      {/* Your products */}
      <div className="bg-card rounded-3xl p-5 shadow-soft">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-navy text-lg">Your Products</h2>
          <span className="text-xs text-muted-foreground bg-periwinkle-soft px-2.5 py-1 rounded-full">
            {selected.length} selected
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {selected.map((p) => (
            <div key={p} className="bg-peach-soft text-navy rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="font-medium">{p}</span>
              <X size={16} className="text-maroon cursor-pointer" />
            </div>
          ))}
        </div>
        <div className="mt-5">
          <div className="text-sm font-semibold text-navy mb-2">Add More Products</div>
          <div className="flex flex-wrap gap-2">
            {more.map((p) => (
              <button key={p} className="bg-periwinkle-soft text-navy text-sm px-3 py-2 rounded-full flex items-center gap-1 font-medium hover:bg-periwinkle/60 transition-colors">
                <Plus size={14} /> {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compatibility Results */}
      <div className="bg-card rounded-3xl p-5 shadow-soft">
        <h2 className="font-bold text-navy text-lg mb-4">Compatibility Results</h2>

        <div className="flex items-center gap-2 text-success font-bold mb-2">
          <CheckCircle2 size={20} /> Safe Combinations
        </div>
        <div className="bg-success/10 border border-success/20 rounded-xl p-3 mb-4">
          <div className="font-semibold text-navy">Niacinamide + Hyaluronic Acid</div>
          <p className="text-sm text-muted-foreground mt-1">Perfect combination for hydration and brightening</p>
        </div>

        <div className="flex items-center gap-2 text-warning font-bold mb-2">
          <AlertCircle size={20} /> Use with Caution
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 mb-4">
          <div className="font-semibold text-navy">Vitamin C + Niacinamide</div>
          <p className="text-sm text-muted-foreground mt-1">
            Can be used together, but may reduce effectiveness. Wait 30 minutes between applications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-destructive font-bold mb-2">
          <XCircle size={20} /> Avoid Together
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
          <div className="font-semibold text-navy">Retinol + AHA/BHA</div>
          <p className="text-sm text-muted-foreground mt-1">
            Too harsh together. Use on alternate nights to prevent irritation.
          </p>
        </div>
      </div>

      {/* Suggested Routine */}
      <div className="bg-card rounded-3xl p-5 shadow-soft">
        <h2 className="font-bold text-navy text-lg mb-4">Suggested Routine</h2>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-peach-soft flex items-center justify-center">
            <Sun size={18} className="text-warning" />
          </div>
          <span className="font-bold text-navy">Morning Routine</span>
        </div>
        <ol className="flex flex-col gap-2 mb-5">
          {["Vitamin C Serum", "Niacinamide", "Moisturizer", "Sunscreen SPF 50"].map((p, i) => (
            <li key={p} className="bg-periwinkle-soft/50 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-maroon text-cloud text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-navy font-medium text-sm">{p}</span>
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-periwinkle-soft flex items-center justify-center">
            <Moon size={18} className="text-navy" />
          </div>
          <span className="font-bold text-navy">Night Routine</span>
        </div>
        <ol className="flex flex-col gap-2">
          {["AHA/BHA Toner (Mon, Wed, Fri)", "Retinol Cream (Tue, Thu, Sat)", "Moisturizer"].map((p, i) => (
            <li key={p} className="bg-periwinkle-soft/50 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-navy text-cloud text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-navy font-medium text-sm">{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Layering;

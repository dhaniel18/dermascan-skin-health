import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "@/components/PhoneFrame";
import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";

type Step = 1 | 2 | 3;

const skinTypes = [
  { id: "oily", emoji: "💧", title: "Oily", desc: "Shiny skin, large pores, prone to acne" },
  { id: "dry", emoji: "🏜️", title: "Dry", desc: "Tight feeling, flaky, rough texture" },
  { id: "combination", emoji: "🌗", title: "Combination", desc: "Oily T-zone, dry cheeks" },
  { id: "normal", emoji: "✨", title: "Normal", desc: "Balanced, not too oily or dry" },
  { id: "sensitive", emoji: "🌸", title: "Sensitive", desc: "Easily irritated by products" },
];

const conditions = [
  { id: "sensitive", emoji: "🌸", title: "Sensitive Skin", desc: "Easily irritated by products" },
  { id: "acne", emoji: "🔴", title: "Acne Prone", desc: "Regular breakouts" },
  { id: "rosacea", emoji: "🌹", title: "Rosacea", desc: "Redness and visible blood vessels" },
  { id: "eczema", emoji: "🩹", title: "Eczema", desc: "Itchy, inflamed patches" },
  { id: "aging", emoji: "⏳", title: "Aging Concerns", desc: "Fine lines and wrinkles" },
];

const concerns = [
  { id: "acne", emoji: "🔴", title: "Acne & Breakouts" },
  { id: "dark", emoji: "⚫", title: "Dark Spots" },
  { id: "dullness", emoji: "☁️", title: "Dullness" },
  { id: "redness", emoji: "🌹", title: "Redness" },
  { id: "wrinkles", emoji: "📏", title: "Fine Lines & Wrinkles" },
  { id: "pores", emoji: "🔍", title: "Large Pores" },
  { id: "texture", emoji: "🏔️", title: "Uneven Texture" },
  { id: "dehydration", emoji: "💧", title: "Dehydration" },
];

const SkinSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [skinType, setSkinType] = useState<string | null>(null);
  const [conds, setConds] = useState<string[]>([]);
  const [conc, setConc] = useState<string[]>([]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, id: string) =>
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const next = () => {
    if (step === 3) navigate("/home");
    else setStep((step + 1) as Step);
  };

  return (
    <PhoneFrame>
      <main className="flex h-full min-h-0 flex-col px-6 pt-10 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] animate-fade-in">
        {/* Progress bars */}
        <div className="flex shrink-0 gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                n <= step ? "bg-maroon" : "bg-periwinkle-soft"
              }`}
            />
          ))}
        </div>

        {step > 1 ? (
          <button onClick={() => setStep((step - 1) as Step)} className="text-navy font-medium text-sm flex items-center gap-1 mb-2">
            ← Back
          </button>
        ) : (
          <BackHeader to="/" label="Back" />
        )}

        <p className="text-sm text-muted-foreground mt-4">Step {step} of 3</p>

        {step === 1 && (
          <div className="flex-1 min-h-0 flex flex-col animate-slide-up">
            <h1 className="text-3xl font-extrabold text-navy mt-1">What's your skin type?</h1>
            <p className="text-muted-foreground mt-2">This helps us recommend the right products for you</p>
            <div className="flex-1 min-h-0 flex flex-col gap-3 mt-6 overflow-y-auto scrollbar-hide pb-4">
              {skinTypes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSkinType(s.id)}
                  className={`text-left bg-card rounded-2xl p-4 flex items-center gap-4 shadow-soft border-2 transition-all ${
                    skinType === s.id ? "border-maroon bg-peach-soft/40" : "border-transparent"
                  }`}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <div className="font-bold text-navy">{s.title}</div>
                    <div className="text-sm text-muted-foreground">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 min-h-0 flex flex-col animate-slide-up">
            <h1 className="text-3xl font-extrabold text-navy mt-1">Any skin conditions?</h1>
            <p className="text-muted-foreground mt-2">Select all that apply (optional)</p>
            <div className="flex-1 min-h-0 flex flex-col gap-3 mt-6 overflow-y-auto scrollbar-hide pb-4">
              {conditions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggle(conds, setConds, c.id)}
                  className={`text-left bg-card rounded-2xl p-4 flex items-center gap-4 shadow-soft border-2 transition-all ${
                    conds.includes(c.id) ? "border-maroon bg-peach-soft/40" : "border-transparent"
                  }`}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <div>
                    <div className="font-bold text-navy">{c.title}</div>
                    <div className="text-sm text-muted-foreground">{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 min-h-0 flex flex-col animate-slide-up">
            <h1 className="text-3xl font-extrabold text-navy mt-1">What are your main concerns?</h1>
            <p className="text-muted-foreground mt-2">Select all that apply</p>
            <div className="grid flex-1 min-h-0 grid-cols-2 auto-rows-max gap-3 mt-6 overflow-y-auto scrollbar-hide pb-4">
              {concerns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggle(conc, setConc, c.id)}
                  className={`bg-card rounded-2xl p-5 flex flex-col items-center gap-2 shadow-soft border-2 transition-all ${
                    conc.includes(c.id) ? "border-maroon bg-peach-soft/40" : "border-transparent"
                  }`}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <div className="font-semibold text-navy text-center text-sm">{c.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <Button onClick={next} variant="brand" size="xl" className="mt-4 shrink-0" disabled={step === 1 && !skinType}>
          {step === 3 ? "Finish & Start Scanning" : "Continue"}
        </Button>
      </main>
    </PhoneFrame>
  );
};

export default SkinSetup;

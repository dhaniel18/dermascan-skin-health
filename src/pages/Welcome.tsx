import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import PhoneFrame from "@/components/PhoneFrame";
import { Button } from "@/components/ui/button";
import { ScanLine, ShieldCheck, Heart } from "lucide-react";

const features = [
  { icon: ScanLine, label: "Scan\nProducts", color: "bg-navy/15 text-navy" },
  { icon: ShieldCheck, label: "Safe Match", color: "bg-periwinkle/40 text-navy" },
  { icon: Heart, label: "Track Routine", color: "bg-peach-soft text-maroon" },
];

const Welcome = () => {
  return (
    <PhoneFrame>
      <main className="flex-1 flex flex-col items-center justify-between px-8 py-14 animate-fade-in">
        <div className="flex flex-col items-center gap-6 mt-10">
          <Logo size={104} />
          <h1 className="text-5xl font-extrabold text-navy tracking-tight">DermaScan</h1>
          <p className="text-center text-base text-muted-foreground leading-relaxed max-w-xs">
            Your personal skincare assistant for perfect ingredient matching
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full my-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2 shadow-soft"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${f.color}`}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <span className="text-xs font-semibold text-navy text-center whitespace-pre-line leading-tight">
                  {f.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button asChild variant="brand" size="xl">
            <Link to="/create-account">Get Started</Link>
          </Button>
          <Button asChild variant="outlineSoft" size="xl">
            <Link to="/sign-in">I Already Have an Account</Link>
          </Button>
          <p className="text-[11px] text-center text-muted-foreground mt-2 px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </PhoneFrame>
  );
};

export default Welcome;

import { Sparkles, ScanLine } from "lucide-react";

const Logo = ({ size = 96 }: { size?: number }) => {
  return (
    <div className="relative inline-block animate-scale-in">
      <div
        className="rounded-[28%] gradient-primary shadow-button flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Sparkles className="text-cloud" style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={2.5} />
      </div>
      <div
        className="absolute -top-2 -right-2 rounded-full bg-periwinkle flex items-center justify-center shadow-soft"
        style={{ width: size * 0.32, height: size * 0.32 }}
      >
        <ScanLine className="text-navy" style={{ width: size * 0.18, height: size * 0.18 }} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default Logo;

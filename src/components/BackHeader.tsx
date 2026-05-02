import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackHeader = ({ to = -1 as number | string, label = "Back" }: { to?: number | string; label?: string }) => {
  const target = typeof to === "string" ? to : undefined;
  return target ? (
    <Link to={target} className="inline-flex items-center gap-2 text-navy font-medium hover:opacity-70 transition-opacity">
      <ArrowLeft size={20} strokeWidth={2.4} />
      <span>{label}</span>
    </Link>
  ) : (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 text-navy font-medium hover:opacity-70 transition-opacity"
    >
      <ArrowLeft size={20} strokeWidth={2.4} />
      <span>{label}</span>
    </button>
  );
};

export default BackHeader;

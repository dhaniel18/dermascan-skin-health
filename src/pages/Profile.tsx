import { useNavigate } from "react-router-dom";
import { User, Mail, Clock, Settings, Bell, LogOut, ChevronRight } from "lucide-react";

const conditions = ["Sensitive Skin", "Acne Prone"];
const concerns = ["Acne & Breakouts", "Dullness", "Redness", "Acne Scars"];
const history = [
  { name: "Hydrating Face Serum", brand: "SkinGlow", time: "2 hours ago", score: 72 },
  { name: "Gentle Foam Cleanser", brand: "CeraVe", time: "Yesterday", score: 85 },
  { name: "Vitamin C Brightening Serum", brand: "Klairs", time: "3 days ago", score: 68 },
];

const Profile = () => {
  const navigate = useNavigate();
  return (
    <div className="px-6 pt-10 flex flex-col gap-5">
      {/* Profile card */}
      <div className="gradient-card rounded-3xl p-5 text-cloud shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cloud/15 flex items-center justify-center backdrop-blur-sm">
            <User size={28} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Sarah Johnson</h2>
            <div className="flex items-center gap-1.5 text-sm opacity-90 mt-0.5">
              <Mail size={14} /> sarah.johnson@email.com
            </div>
          </div>
        </div>
        <div className="bg-cloud/10 backdrop-blur-sm rounded-xl p-3 mt-4">
          <div className="text-xs opacity-80">Skin Type</div>
          <div className="font-bold text-lg">Combination</div>
        </div>
      </div>

      {/* Skin Conditions */}
      <div className="bg-card rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold text-navy mb-3">Skin Conditions</h3>
        <div className="flex flex-wrap gap-2">
          {conditions.map((c) => (
            <span key={c} className="bg-peach-soft text-maroon text-sm font-medium px-3 py-1.5 rounded-full">{c}</span>
          ))}
        </div>
      </div>

      {/* Skin Concerns */}
      <div className="bg-card rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold text-navy mb-3">Skin Concerns</h3>
        <div className="flex flex-wrap gap-2">
          {concerns.map((c) => (
            <span key={c} className="bg-periwinkle-soft text-navy text-sm font-medium px-3 py-1.5 rounded-full">{c}</span>
          ))}
        </div>
      </div>

      {/* Scan History */}
      <div className="bg-card rounded-2xl p-5 shadow-soft">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-navy" />
            <h3 className="font-bold text-navy">Scan History</h3>
          </div>
          <span className="text-xs text-muted-foreground">6 scans</span>
        </div>
        <div className="flex flex-col gap-2">
          {history.map((h) => (
            <div key={h.name} className="bg-periwinkle-soft/40 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy text-sm">{h.name}</div>
                <div className="text-xs text-muted-foreground">{h.brand} • {h.time}</div>
              </div>
              <span className="bg-cloud text-navy text-xs font-bold px-2.5 py-1 rounded-full">{h.score}%</span>
            </div>
          ))}
        </div>
        <button className="text-maroon font-semibold text-sm w-full text-center mt-3">Show all history ›</button>
      </div>

      {/* Settings */}
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        {[
          { icon: Settings, label: "Edit Profile" },
          { icon: Bell, label: "Notifications" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} className="w-full flex items-center justify-between px-5 py-4 hover:bg-periwinkle-soft/40 transition-colors border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-navy" />
                <span className="font-medium text-navy">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          );
        })}
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-destructive/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} className="text-destructive" />
            <span className="font-medium text-destructive">Logout</span>
          </div>
          <ChevronRight size={18} className="text-destructive" />
        </button>
      </div>
    </div>
  );
};

export default Profile;

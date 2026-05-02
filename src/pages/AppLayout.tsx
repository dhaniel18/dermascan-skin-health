import { NavLink, Outlet, useLocation } from "react-router-dom";
import PhoneFrame from "@/components/PhoneFrame";
import { Home, Layers, ScanLine, Heart, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/layering", label: "Layering", icon: Layers },
  { to: "/scan", label: "Scan", icon: ScanLine, center: true },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
];

const AppLayout = () => {
  const location = useLocation();
  return (
    <PhoneFrame>
      {/* Animated page area */}
      <div key={location.pathname} className="flex-1 overflow-y-auto scrollbar-hide pb-28 animate-fade-in">
        <Outlet />
      </div>

      {/* Bottom navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-2 pt-3 pb-5 shadow-card">
        <div className="flex items-end justify-around relative">
          {tabs.map(({ to, label, icon: Icon, center }) => (
            <NavLink key={to} to={to} className="flex-1 flex justify-center">
              {({ isActive }) =>
                center ? (
                  <div
                    className={`-mt-9 w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-button ${
                      isActive ? "gradient-primary scale-110" : "bg-maroon/70"
                    }`}
                  >
                    <Icon
                      className={`text-cloud transition-transform ${isActive ? "animate-tab-pop" : ""}`}
                      size={26}
                      strokeWidth={2.4}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 py-1 transition-all duration-300">
                    <Icon
                      className={`transition-all duration-300 ${
                        isActive ? "text-maroon scale-110 animate-tab-pop" : "text-muted-foreground"
                      }`}
                      size={22}
                      strokeWidth={isActive ? 2.6 : 2}
                    />
                    <span
                      className={`text-[11px] font-semibold transition-colors ${
                        isActive ? "text-maroon" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                    <span
                      className={`h-1 w-1 rounded-full transition-all duration-300 ${
                        isActive ? "bg-maroon w-6" : "bg-transparent"
                      }`}
                    />
                  </div>
                )
              }
            </NavLink>
          ))}
        </div>
      </nav>
    </PhoneFrame>
  );
};

export default AppLayout;

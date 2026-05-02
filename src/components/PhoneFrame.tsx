// Mobile-style frame to constrain to phone width on desktop
import { ReactNode } from "react";

const PhoneFrame = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-periwinkle-soft to-cloud flex items-center justify-center md:p-6">
      <div
        className={`w-full max-w-[440px] min-h-screen md:min-h-[860px] md:max-h-[860px] md:rounded-[2.5rem] bg-cloud overflow-hidden md:shadow-card relative flex flex-col ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;

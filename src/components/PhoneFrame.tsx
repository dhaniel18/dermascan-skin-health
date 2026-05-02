// Mobile-style frame to constrain to phone width on desktop
import { ReactNode } from "react";

const PhoneFrame = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-periwinkle-soft to-cloud flex items-center justify-center overflow-hidden md:p-4 lg:p-6">
      <div
        className={`w-full max-w-[440px] h-[100dvh] max-h-[100dvh] md:h-[calc(100dvh-2rem)] md:max-h-[860px] lg:h-[calc(100dvh-3rem)] lg:max-h-[860px] md:rounded-[2.5rem] bg-cloud overflow-hidden md:shadow-card relative flex flex-col ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;

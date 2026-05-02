import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Flashlight, ScanLine } from "lucide-react";

const Scan = () => {
  return (
    <div className="px-6 pt-10 flex flex-col gap-5 text-cloud min-h-full">
      {/* Dark themed scan frame */}
      <div className="-mx-6 -mt-10 px-6 pt-10 pb-6 bg-navy">
        <div className="text-cloud">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 font-medium opacity-90">
            ← Back
          </button>
          <h1 className="text-3xl font-extrabold mt-6">Scan Barcode</h1>
          <p className="opacity-80 mt-1">Position the barcode within the frame</p>
        </div>

        <div className="mt-6 relative aspect-square bg-navy/60 rounded-3xl border border-cloud/10 overflow-hidden">
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cloud/10 flex items-center justify-center text-cloud z-10">
            <Flashlight size={18} />
          </button>
          {/* Corner brackets */}
          <div className="absolute inset-10 rounded-2xl">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-cloud rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-cloud rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-cloud rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-cloud rounded-br-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine size={56} className="text-cloud/40" strokeWidth={1.5} />
            </div>
            {/* Scanning line */}
            <div className="absolute left-0 right-0 h-0.5 bg-peach shadow-[0_0_15px_hsl(var(--peach))] animate-[slide-up_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="brand" size="xl" className="w-full">
          <Camera size={20} /> Scan Now
        </Button>
        <Button variant="outlineSoft" size="xl" className="w-full bg-navy/5 text-navy">
          <Upload size={20} /> Upload Barcode Image
        </Button>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-soft text-navy">
        <h3 className="font-bold mb-3">Tips for Better Scanning</h3>
        <ul className="flex flex-col gap-2 text-sm text-navy/80">
          <li className="flex gap-2"><span className="text-maroon">•</span> Ensure good lighting on the barcode</li>
          <li className="flex gap-2"><span className="text-maroon">•</span> Hold your device steady and parallel to the barcode</li>
          <li className="flex gap-2"><span className="text-maroon">•</span> Make sure the entire barcode fits within the frame</li>
        </ul>
      </div>
    </div>
  );
};

export default Scan;

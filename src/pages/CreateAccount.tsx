import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneFrame from "@/components/PhoneFrame";
import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <PhoneFrame>
      <main className="flex-1 px-7 py-10 animate-fade-in flex flex-col">
        <BackHeader />
        <div className="mt-8">
          <h1 className="text-4xl font-extrabold text-navy">Create Account</h1>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Join us for personalized skincare recommendations
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/skin-setup");
          }}
          className="mt-8 flex flex-col gap-5 flex-1"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-navy font-semibold">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input id="name" placeholder="Sarah Johnson" className="pl-11 h-13 bg-card rounded-xl border-border" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-navy font-semibold">Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input id="email" type="email" placeholder="your.email@example.com" className="pl-11 h-13 bg-card rounded-xl border-border" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-navy font-semibold">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-11 pr-11 h-13 bg-card rounded-xl border-border"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer text-sm">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
            <span className="text-navy/80">
              I agree to the <span className="text-maroon font-semibold">Terms of Service</span> and{" "}
              <span className="text-maroon font-semibold">Privacy Policy</span>
            </span>
          </label>

          <div className="mt-auto flex flex-col gap-4">
            <Button type="submit" variant="brand" size="xl" disabled={!agreed}>
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-maroon font-semibold">Sign In</Link>
            </p>
          </div>
        </form>
      </main>
    </PhoneFrame>
  );
};

export default CreateAccount;

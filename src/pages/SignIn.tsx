import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneFrame from "@/components/PhoneFrame";
import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.5 35.4 44 30.1 44 24c0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

const SignIn = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  return (
    <PhoneFrame>
      <main className="flex-1 px-7 py-10 animate-fade-in flex flex-col">
        <BackHeader />
        <div className="mt-8">
          <h1 className="text-4xl font-extrabold text-navy">Welcome Back!</h1>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Sign in to continue your skincare journey
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
                placeholder="Enter your password"
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
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox /> <span className="text-navy/80">Remember me</span>
            </label>
            <span className="text-maroon font-semibold cursor-pointer">Forgot Password?</span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <Button type="submit" variant="brand" size="xl">Sign In</Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/create-account" className="text-maroon font-semibold">Sign Up</Link>
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outlineSoft" className="h-12 rounded-xl">
              <GoogleIcon /> <span className="ml-1">Google</span>
            </Button>
            <Button type="button" variant="outlineSoft" className="h-12 rounded-xl">
              <Github size={18} /> GitHub
            </Button>
          </div>
        </form>
      </main>
    </PhoneFrame>
  );
};

export default SignIn;

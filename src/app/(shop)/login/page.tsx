"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Mail, User, CheckCircle2, ArrowRight, Sparkles, Info } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, user } = useStore();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Inputs state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = login(email, password);
    if (success) {
      router.push("/account");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    signup(name, email, password);
    router.push("/account");
  };

  return (
    <div className="bg-muted/40 min-h-[80vh] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">

        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-serif font-bold tracking-wide text-foreground">Slmalkoha<span className="text-brand">.</span></span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground mt-2">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {tab === "login"
              ? "Access your Ceylon heritage items and order tracking."
              : "Register to enjoy global checkout priority and local discounts."}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">

          {/* Tabs header */}
          <div className="flex border-b border-border bg-muted/20">
            <button
              onClick={() => setTab("login")}
              className={cn(
                "flex-1 py-4 text-xs font-extrabold uppercase tracking-wider transition-all duration-155 border-b-2",
                tab === "login"
                  ? "border-brand text-brand bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={cn(
                "flex-1 py-4 text-xs font-extrabold uppercase tracking-wider transition-all duration-155 border-b-2",
                tab === "signup"
                  ? "border-brand text-brand bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Register
            </button>
          </div>

          {/* Form wrapper */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="buyer@Slmalkohacom"
                        className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                      <a href="#" className="text-[10px] text-brand hover:underline font-bold">Forgot?</a>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <KeyRound size={16} />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-brand text-brand-foreground py-3.5 text-xs font-extrabold uppercase tracking-wider shadow-glow hover:bg-brand-dark transition-all flex items-center justify-center gap-1.5 mt-2"
                  >
                    Sign In <ArrowRight size={14} />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={handleSignupSubmit}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Emily Carter"
                        className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="buyer@Slmalkohacom"
                        className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <KeyRound size={16} />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <KeyRound size={16} />
                      </span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-brand text-brand-foreground py-3.5 text-xs font-extrabold uppercase tracking-wider shadow-glow hover:bg-brand-dark transition-all flex items-center justify-center gap-1.5 mt-2"
                  >
                    Register Account <CheckCircle2 size={14} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Demo Credentials Alert Info Box */}
        <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 flex gap-3.5 items-start">
          <Info size={18} className="text-brand shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <h4 className="font-extrabold text-foreground mb-0.5">Demo Buyer Credentials</h4>
            <p className="mt-1 leading-relaxed">
              Use the following credentials to login with fully loaded order templates:
            </p>
            <div className="mt-2.5 space-y-1 font-mono text-[10px]">
              <div>Email: <span className="text-brand font-bold select-all">buyer@Slmalkohacom</span></div>
              <div>Password: <span className="text-brand font-bold select-all">password123</span></div>
            </div>
            <p className="mt-2.5 leading-relaxed text-[10px]">
              Or type any valid email format to login as a new user with fresh states.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

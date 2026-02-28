import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/appStore";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      setIsSubmitting(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const result = await registerUser({ name, email, password });
    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Account created successfully. Reloading and redirecting to Sign In...");
    setIsRedirecting(true);
    setIsSubmitting(false);
    setTimeout(() => {
      window.location.href = "/signin";
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="gradient-primary rounded-lg p-1.5">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">
            Fund<span className="text-primary">Forge</span>
          </span>
        </Link>

        <div className="glass-strong rounded-2xl p-8">
          <h2 className="font-display text-2xl font-bold text-center mb-2">Join FundForge</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Create your account to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                id="signup-name"
                aria-label="Full Name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-12 bg-card/50 border-border"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                id="signup-email"
                aria-label="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-card/50 border-border"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                id="signup-password"
                aria-label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-card/50 border-border"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                id="signup-confirm-password"
                aria-label="Confirm Password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-12 bg-card/50 border-border"
                required
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            {successMessage && (
              <div className="flex items-center gap-2 text-primary text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{successMessage}</span>
              </div>
            )}
            <Button type="submit" disabled={isSubmitting || isRedirecting} className="w-full h-12 gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              {isSubmitting ? "Creating..." : isRedirecting ? "Redirecting..." : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline font-medium">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;

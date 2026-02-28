import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/appStore";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successMessage = (location.state as { message?: string } | null)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await loginUser(email, password);
    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setSuccess("Signed in successfully. Reloading and redirecting...");
    setIsSubmitting(false);
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 900);
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
          <h2 className="font-display text-2xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Sign in to continue your journey</p>
          {successMessage && <p className="text-primary text-sm text-center mb-4">{successMessage}</p>}
          {success && <p className="text-primary text-sm text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                id="signin-email"
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
                id="signin-password"
                aria-label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-card/50 border-border"
                required
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" disabled={isSubmitting || Boolean(success)} className="w-full h-12 gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              {isSubmitting ? "Signing In..." : "Sign In"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;

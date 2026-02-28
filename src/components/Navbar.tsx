import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthSession, logoutUser, setThemePreference } from "@/lib/appStore";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/create", label: "Start Project" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const session = getAuthSession();

  const toggleTheme = () => {
    const nextTheme = dark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setThemePreference(nextTheme);
    setDark(!dark);
  };

  const handleLogout = () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    logoutUser();
    setTimeout(() => {
      window.location.href = "/";
    }, 900);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="gradient-primary rounded-lg p-1.5 transition-transform duration-300 group-hover:scale-110">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Fund<span className="text-primary">Forge</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground" aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {session ? (
            <Button variant="outline" size="sm" className="border-border text-foreground" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "Reloading..." : "Logout"}
            </Button>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border/50"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-2">
                <Button type="button" variant="outline" className="w-full" size="sm" onClick={toggleTheme}>
                  {dark ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
              <div className="flex gap-3 mt-2">
                {session ? (
                  <Button
                    variant="outline"
                    className="w-full border-border"
                    size="sm"
                    disabled={isLoggingOut}
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                  >
                    {isLoggingOut ? "Reloading..." : "Logout"}
                  </Button>
                ) : (
                  <>
                    <Link to="/signin" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full" size="sm">Sign In</Button>
                    </Link>
                    <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gradient-primary text-primary-foreground" size="sm">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { getProjects, syncProjectsFromServer, type StoredProject } from "@/lib/appStore";

const compactCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const compactNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const HeroSection = () => {
  const [projects, setProjects] = useState<StoredProject[]>(() => getProjects());

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        await syncProjectsFromServer();
      } catch {
        // Keep existing cached data if backend sync fails.
      } finally {
        if (mounted) {
          setProjects(getProjects());
        }
      }
    };

    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 5000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const stats = useMemo(() => {
    const totalFunded = projects.reduce((sum, project) => sum + project.raised, 0);
    const totalBackers = projects.reduce((sum, project) => sum + project.backers, 0);
    return [
      { value: compactCurrency(totalFunded), label: "Total Funded" },
      { value: compactNumber(projects.length), label: "Projects" },
      { value: compactNumber(totalBackers), label: "Backers" },
    ];
  }, [projects]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            Forge Ideas
            <br />
            <span className="gradient-text">Into Reality</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Connect with visionary creators, back groundbreaking projects, and be part of the next wave of innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <Button size="lg" className="gradient-primary text-primary-foreground font-semibold text-base px-8 h-12 hover:opacity-90 transition-opacity glow">
                Explore Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/create">
              <Button size="lg" variant="outline" className="border-border text-foreground font-semibold text-base px-8 h-12 hover:bg-secondary">
                Start a Project
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

interface FloatingIconProps {
  icon: ReactNode;
  delay: number;
  initialX: string;
  initialY: string;
  size?: number;
  color?: string;
}

const FloatingIcon = ({
  icon,
  delay,
  initialX,
  initialY,
  size = 24,
  color = "hsl(var(--primary))",
}: FloatingIconProps) => (
  <motion.div
    className="pointer-events-none absolute"
    style={{ left: initialX, top: initialY, color, width: size, height: size }}
    initial={{ opacity: 0, scale: 0.5, y: 24 }}
    animate={{
      opacity: [0, 0.9, 0.9, 0],
      scale: [0.5, 1, 1, 0.5],
      y: [24, -26, -26, 24],
      x: [0, 8, -8, 0],
      rotate: [0, 8, -8, 0],
    }}
    transition={{
      duration: 4.4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {icon}
  </motion.div>
);

const Sparkle = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    className="pointer-events-none absolute h-2 w-2 rounded-full"
    style={{ left: x, top: y, background: "hsl(var(--accent))" }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
    transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const LightningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
  </svg>
);

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimeout = window.setTimeout(() => {
      setIsVisible(false);
      window.setTimeout(onComplete, 520);
    }, 3300);

    return () => {
      window.clearTimeout(hideTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-background" />

          <motion.div
            className="absolute -left-28 top-[-20%] h-[32rem] w-[32rem] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.34), transparent 65%)" }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-12rem] top-[10%] h-[30rem] w-[30rem] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--gradient-end) / 0.3), transparent 65%)" }}
            animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-12rem] left-[20%] h-[24rem] w-[24rem] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.2), transparent 70%)" }}
            animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <FloatingIcon icon={<RocketIcon />} delay={0.2} initialX="8%" initialY="18%" size={32} color="hsl(var(--primary))" />
          <FloatingIcon icon={<StarIcon />} delay={0.9} initialX="84%" initialY="22%" size={20} color="hsl(var(--accent))" />
          <FloatingIcon icon={<HeartIcon />} delay={1.4} initialX="16%" initialY="78%" size={28} color="hsl(var(--gradient-end))" />
          <FloatingIcon icon={<LightningIcon />} delay={2} initialX="88%" initialY="70%" size={24} color="hsl(var(--primary))" />

          <Sparkle delay={0.1} x="22%" y="28%" />
          <Sparkle delay={0.6} x="74%" y="18%" />
          <Sparkle delay={1.1} x="80%" y="66%" />
          <Sparkle delay={1.6} x="35%" y="72%" />

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <motion.div
              className="glass-strong w-full max-w-2xl rounded-3xl border border-white/20 px-7 py-10 text-center md:px-10"
              initial={{ y: 22, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.h1
                className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.65 }}
              >
                <span className="mr-2">Welcome to</span>
                <span className="inline-flex items-center gap-2 align-middle">
                  <span className="gradient-primary rounded-xl p-2">
                    <Flame className="h-7 w-7 text-primary-foreground sm:h-8 sm:w-8" />
                  </span>
                  <span>
                    <span className="text-foreground">Fund</span>
                    <span className="text-primary">Forge</span>
                  </span>
                </span>
              </motion.h1>

              <motion.div
                className="mx-auto mt-8 w-full max-w-md"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
              >
                <div className="mt-4 flex items-center justify-center gap-2">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-primary/70"
                    animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                  />
                  <motion.span
                    className="h-2 w-2 rounded-full bg-primary/70"
                    animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                  />
                  <motion.span
                    className="h-2 w-2 rounded-full bg-primary/70"
                    animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

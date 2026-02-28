import { motion } from "framer-motion";
import { Lightbulb, DollarSign, Gift } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Create Project",
    description: "Share your vision, set goals, and define rewards for your backers.",
  },
  {
    icon: DollarSign,
    title: "Get Funded",
    description: "Connect with passionate backers who believe in your project.",
  },
  {
    icon: Gift,
    title: "Deliver Rewards",
    description: "Bring your project to life and reward your supporters.",
  },
];

const HowItWorks = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          How It <span className="gradient-text">Works</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Launch your project in three simple steps
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow">
              <step.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="text-sm font-semibold text-primary mb-2">Step {i + 1}</div>
            <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

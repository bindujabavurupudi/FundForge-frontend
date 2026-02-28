import { motion } from "framer-motion";
import { successStories } from "@/data/mockProjects";
import { TrendingUp } from "lucide-react";

const SuccessStories = () => (
  <section className="py-24 bg-card/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Success <span className="gradient-text">Stories</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Projects that exceeded their goals and changed the game
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {successStories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl overflow-hidden card-hover"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-primary text-sm font-semibold">
                <TrendingUp className="h-4 w-4" />
                {Math.round((story.raised / story.goal) * 100)}% funded
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold mb-1">{story.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">by {story.creator}</p>
              <div className="flex justify-between text-sm">
                <span className="text-primary font-semibold">${story.raised.toLocaleString()}</span>
                <span className="text-muted-foreground">{story.backers.toLocaleString()} backers</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SuccessStories;

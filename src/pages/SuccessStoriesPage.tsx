import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { successStories } from "@/data/mockProjects";
import { TrendingUp } from "lucide-react";

const SuccessStoriesPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 pt-24 pb-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl font-bold mb-3">
          Success <span className="gradient-text">Stories</span>
        </h1>
        <p className="text-muted-foreground">Real projects that achieved breakthrough growth on FundForge.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {successStories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl overflow-hidden card-hover"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/75 to-transparent" />
              <div className="absolute bottom-3 left-3 text-primary text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {Math.round((story.raised / story.goal) * 100)}% funded
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold mb-1">{story.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">by {story.creator}</p>
              <p className="text-primary font-semibold">${story.raised.toLocaleString()} raised</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default SuccessStoriesPage;

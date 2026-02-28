import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthSession, getProjects, getRecommendedProjects } from "@/lib/appStore";

const FeaturedProjects = () => {
  const projects = getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const session = getAuthSession();
  const recommended = session ? getRecommendedProjects(session.userId, 3) : [];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-muted-foreground">Trending projects you'll love</p>
          </div>
          <Link to="/explore">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {session && recommended.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold">
                Recommended <span className="gradient-text">For You</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;

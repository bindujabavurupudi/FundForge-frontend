import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import type { Project } from "@/data/mockProjects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const percentFunded = Math.round((project.raised / project.goal) * 100);
  const isProjectExpired = project.daysLeft <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/project/${project.id}`} className="block group">
        <div className="glass rounded-xl overflow-hidden card-hover">
          <div className="relative overflow-hidden aspect-[3/2]">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 left-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full glass text-foreground">
                {project.category}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">by {project.creator}</p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-secondary rounded-full mb-3 overflow-hidden">
              <motion.div
                className="h-full gradient-primary rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(percentFunded, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-primary">{percentFunded}% funded</span>
              <span className="text-muted-foreground">${project.raised.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {project.backers.toLocaleString()}
              </span>
              {isProjectExpired ? (
                <span className="flex items-center gap-1 text-destructive font-semibold">
                  <Clock className="h-3 w-3" /> Project Expired
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {project.daysLeft} days left
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;

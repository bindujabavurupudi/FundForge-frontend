import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAuthSession, getBackedProjectsByUser, getCreatedProjectsByUser, getRecommendedProjects } from "@/lib/appStore";

const Profile = () => {
  const session = getAuthSession();

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  const created = getCreatedProjectsByUser(session.name);
  const backed = getBackedProjectsByUser(session.userId);
  
  // AI-Powered Recommendations
  const recommendedProjects = useMemo(() => {
    return getRecommendedProjects(session.userId, 3);
  }, [session.userId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-10">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="gradient-primary text-primary-foreground">
                {session.name
                  .split(" ")
                  .map((part) => part[0] ?? "")
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl font-bold">{session.name}</h1>
              <p className="text-muted-foreground">{session.email}</p>
            </div>
          </div>
        </motion.div>

        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-4">Projects Created</h2>
          {created.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {created.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You have not created any projects yet.</p>
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold mb-4">Projects Backed</h2>
          {backed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backed.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
        <p className="text-muted-foreground">You have not backed any projects yet.</p>
          )}
        </section>

        {/* AI-Powered Recommendations */}
        {recommendedProjects.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">
                Recommended <span className="gradient-text">For You</span>
              </h2>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Projects you might like based on your activity
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

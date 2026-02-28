import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addProjectUpdate,
  getAuthSession,
  getCreatedProjectsByUserId,
  getProjects,
  getRecommendedProjects,
} from "@/lib/appStore";

const Dashboard = () => {
  const session = getAuthSession();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  const projects = useMemo(() => getProjects(), [refreshTick]);
  const createdProjects = useMemo(
    () => (session ? getCreatedProjectsByUserId(session.userId) : []),
    [session, refreshTick],
  );

  // AI-Powered Recommendations for similar projects
  const recommendedProjects = useMemo(() => {
    if (!session) return [];
    return getRecommendedProjects(session.userId, 3);
  }, [session, projects]);

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  const totalFunds = createdProjects.reduce((sum, project) => sum + project.raised, 0);
  const totalBackers = createdProjects.reduce((sum, project) => sum + project.backers, 0);
  const totalViews = createdProjects.reduce((sum, project) => sum + (project.views ?? 0), 0);
  const engagement = totalViews > 0 ? Math.round((totalBackers / totalViews) * 100) : 0;

  const chartData = projects
    .slice(0, 6)
    .map((project) => ({
      name: project.title.length > 12 ? `${project.title.slice(0, 12)}...` : project.title,
      funded: Math.round((project.raised / project.goal) * 100),
      goal: project.goal / 1000,
    }));

  const handlePublishUpdate = async () => {
    setUpdateError("");
    if (!selectedProjectId || !updateTitle.trim() || !updateContent.trim()) {
      setUpdateError("Please select a project and fill in title/content.");
      return;
    }
    try {
      await addProjectUpdate(selectedProjectId, {
        title: updateTitle.trim(),
        content: updateContent.trim(),
      });
      setUpdateTitle("");
      setUpdateContent("");
      setRefreshTick((tick) => tick + 1);
    } catch (error: unknown) {
      setUpdateError(error instanceof Error ? error.message : "Unable to publish update.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground mb-8">Track performance, engagement, and publish impact updates.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Total Funds Raised</p>
            <p className="font-display text-2xl font-bold text-primary">${totalFunds.toLocaleString()}</p>
          </div>
          <div className="glass rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Backers</p>
            <p className="font-display text-2xl font-bold">{totalBackers.toLocaleString()}</p>
          </div>
          <div className="glass rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Project Views</p>
            <p className="font-display text-2xl font-bold">{totalViews.toLocaleString()}</p>
          </div>
          <div className="glass rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Engagement</p>
            <p className="font-display text-2xl font-bold">{engagement}%</p>
          </div>
        </div>

        <div className="glass rounded-xl p-5 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Project Analytics</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="funded" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-xl p-5 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Impact Reporting</h2>
          <div className="space-y-3">
            <select
              className="w-full h-11 rounded-md bg-card border border-border px-3"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">Select project</option>
              {createdProjects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
            {createdProjects.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No creator projects found for your account yet. Create a project first.
              </p>
            )}
            <Input
              placeholder="Update title"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              className="bg-card border-border"
            />
            <Textarea
              placeholder="Share progress, outcomes, and impact..."
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
              className="bg-card border-border min-h-[120px]"
            />
            <Button className="gradient-primary text-primary-foreground" onClick={handlePublishUpdate}>
              Publish Update
            </Button>
            {updateError && <p className="text-sm text-destructive">{updateError}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

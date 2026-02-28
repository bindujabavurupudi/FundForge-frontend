import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { categories } from "@/data/mockProjects";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getProjects, getAuthSession, getRecommendedProjects } from "@/lib/appStore";

const sortOptions = ["Newest", "Most Funded", "Popular", "Ending Soon"];

const Explore = () => {
  const projects = getProjects();
  const session = getAuthSession();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Popular");
  const [goalMin, setGoalMin] = useState("");
  const [goalMax, setGoalMax] = useState("");

  // AI-Powered Recommendations for logged-in users
  const recommendedProjects = useMemo(() => {
    if (!session) return [];
    return getRecommendedProjects(session.userId, 3);
  }, [session, projects]);

  const filtered = useMemo(() => {
    let results = projects;
    if (search) {
      results = results.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      results = results.filter((p) => p.category === selectedCategory);
    }
    const min = Number(goalMin || 0);
    const max = Number(goalMax || Number.MAX_SAFE_INTEGER);
    results = results.filter((p) => p.goal >= min && p.goal <= max);
    if (selectedSort === "Most Funded") {
      results = [...results].sort((a, b) => b.raised - a.raised);
    } else if (selectedSort === "Newest") {
      results = [...results].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    } else if (selectedSort === "Ending Soon") {
      results = [...results].sort((a, b) => a.daysLeft - b.daysLeft);
    } else if (selectedSort === "Popular") {
      results = [...results].sort((a, b) => b.backers - a.backers);
    }
    return results;
  }, [search, selectedCategory, selectedSort, goalMax, goalMin, projects]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Explore <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-muted-foreground mb-8">Discover innovative projects from creators worldwide</p>

          {/* Search */}
          <div className="relative max-w-xl mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card border-border"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["All", ...categories.slice(0, 6)].map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "gradient-primary text-primary-foreground" : "border-border text-muted-foreground"}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedSort(opt)}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  selectedSort === opt
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mb-8">
            <Input
              type="number"
              placeholder="Min Goal"
              value={goalMin}
              onChange={(e) => setGoalMin(e.target.value)}
              className="bg-card border-border"
            />
            <Input
              type="number"
              placeholder="Max Goal"
              value={goalMax}
              onChange={(e) => setGoalMax(e.target.value)}
              className="bg-card border-border"
            />
          </div>
        </motion.div>

        {/* AI-Powered Recommendations */}
        {session && recommendedProjects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">
                Recommended <span className="gradient-text">For You</span>
              </h2>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Based on your interests and browsing history
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No projects found. Try a different search.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Explore;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/mockProjects";
import { Plus, Trash2 } from "lucide-react";
import { addProject, getAuthSession } from "@/lib/appStore";

interface RewardDraft {
  title: string;
  description: string;
  amount: string;
}

interface MilestoneDraft {
  title: string;
  description: string;
  targetAmount: string;
}

const CreateProject = () => {
  const navigate = useNavigate();
  const session = getAuthSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState("");
  const [rewards, setRewards] = useState<RewardDraft[]>([{ title: "", description: "", amount: "" }]);
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([{ title: "", description: "", targetAmount: "" }]);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-8 text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Sign In Required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to start creating a new project.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/signin">
                <Button className="gradient-primary text-primary-foreground">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="border-border">Sign Up</Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const addReward = () => setRewards([...rewards, { title: "", description: "", amount: "" }]);
  const removeReward = (i: number) => setRewards(rewards.filter((_, idx) => idx !== i));
  const addMilestone = () => setMilestones([...milestones, { title: "", description: "", targetAmount: "" }]);
  const removeMilestone = (i: number) => setMilestones(milestones.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!deadline) {
      setError("Please choose a project deadline.");
      return;
    }

    const parsedGoal = Number(goal);
    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      setError("Funding goal must be greater than 0.");
      return;
    }

    const parsedRewards = rewards
      .filter((reward) => reward.title && reward.amount)
      .map((reward, index) => ({
        id: `r-${index + 1}`,
        title: reward.title,
        description: reward.description || "Reward details will be shared soon.",
        amount: Number(reward.amount),
      }));

    if (parsedRewards.length === 0) {
      setError("Add at least one reward tier.");
      return;
    }

    const parsedMilestones = milestones
      .filter((milestone) => milestone.title && milestone.targetAmount)
      .map((milestone, index) => ({
        id: `m-${index + 1}`,
        title: milestone.title,
        description: milestone.description || "Milestone details coming soon.",
        targetAmount: Number(milestone.targetAmount),
        reached: false,
      }));

    if (parsedMilestones.length === 0) {
      setError("Add at least one milestone.");
      return;
    }

    try {
      const created = await addProject({
        title,
        description,
        creator: session.name,
        category,
        image:
          image ||
          "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&h=700&fit=crop",
        goal: parsedGoal,
        deadline,
        rewards: parsedRewards,
        milestones: parsedMilestones,
      });

      navigate(`/project/${created.id}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to create project right now.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Start a <span className="gradient-text">Project</span>
          </h1>
          <p className="text-muted-foreground mb-8">Share your vision with the world</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg">Project Details</h3>
              <Input placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-card/50 border-border h-12" required />
              <Textarea placeholder="Project Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-card/50 border-border min-h-[120px]" required />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-card/50 border-border h-12"><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Funding Goal ($)" value={goal} onChange={(e) => setGoal(e.target.value)} className="bg-card/50 border-border h-12" required />
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-card/50 border-border h-12" required />
              <Input placeholder="Project Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="bg-card/50 border-border h-12" />
            </div>

            {/* Rewards */}
            <div className="glass rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg">Reward Tiers</h3>
                <Button type="button" size="sm" variant="outline" onClick={addReward} className="border-border text-muted-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {rewards.map((r, i) => (
                <div key={i} className="space-y-2 p-4 rounded-lg bg-card/30 border border-border/50 relative">
                  {rewards.length > 1 && (
                    <button type="button" onClick={() => removeReward(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <Input placeholder="Reward Title" value={r.title} onChange={(e) => { const u = [...rewards]; u[i].title = e.target.value; setRewards(u); }} className="bg-card/50 border-border" />
                  <Input placeholder="Description" value={r.description} onChange={(e) => { const u = [...rewards]; u[i].description = e.target.value; setRewards(u); }} className="bg-card/50 border-border" />
                  <Input type="number" placeholder="Amount ($)" value={r.amount} onChange={(e) => { const u = [...rewards]; u[i].amount = e.target.value; setRewards(u); }} className="bg-card/50 border-border" />
                </div>
              ))}
            </div>

            {/* Milestones */}
            <div className="glass rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg">Milestones</h3>
                <Button type="button" size="sm" variant="outline" onClick={addMilestone} className="border-border text-muted-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {milestones.map((m, i) => (
                <div key={i} className="space-y-2 p-4 rounded-lg bg-card/30 border border-border/50 relative">
                  {milestones.length > 1 && (
                    <button type="button" onClick={() => removeMilestone(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <Input placeholder="Milestone Title" value={m.title} onChange={(e) => { const u = [...milestones]; u[i].title = e.target.value; setMilestones(u); }} className="bg-card/50 border-border" />
                  <Input placeholder="Description" value={m.description} onChange={(e) => { const u = [...milestones]; u[i].description = e.target.value; setMilestones(u); }} className="bg-card/50 border-border" />
                  <Input type="number" placeholder="Target Amount ($)" value={m.targetAmount} onChange={(e) => { const u = [...milestones]; u[i].targetAmount = e.target.value; setMilestones(u); }} className="bg-card/50 border-border" />
                </div>
              ))}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full h-12 gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Create Project
            </Button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateProject;

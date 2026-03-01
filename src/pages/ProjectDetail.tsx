import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Clock, Share2, Gift, Target, MessageCircle, Facebook, Twitter, Reply } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addCommentReply,
  addProjectComment,
  fetchProjectById,
  fundProject,
  getAuthSession,
  getProjectById,
  incrementProjectView,
  recordProjectFunding,
  recordProjectView,
  type StoredProject,
} from "@/lib/appStore";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<StoredProject | null>(id ? getProjectById(id) : null);
  const [fundAmount, setFundAmount] = useState("");
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const [showFundSuccess, setShowFundSuccess] = useState(false);
  const [fundError, setFundError] = useState("");
  const [isFunding, setIsFunding] = useState(false);
  const session = getAuthSession();

  const refreshProject = async () => {
    if (!id) {
      return;
    }
    const fresh = await fetchProjectById(id).catch(() => getProjectById(id));
    setProject(fresh);
  };

  useEffect(() => {
    if (!id || !project) {
      return;
    }
    incrementProjectView(id);
    if (session) {
      recordProjectView(session.userId, project);
    }
    void refreshProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const percent = useMemo(() => {
    if (!project) {
      return 0;
    }
    return Math.round((project.raised / project.goal) * 100);
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Project not found</h1>
          <Link to="/explore"><Button>Back to Explore</Button></Link>
        </div>
      </div>
    );
  }

  const isProjectOwner = session
    ? (project.creatorId ? project.creatorId === session.userId : project.creator.trim().toLowerCase() === session.name.trim().toLowerCase())
    : false;
  const remainingAmount = Math.max(project.goal - project.raised, 0);
  const isProjectExpired = project.daysLeft <= 0;
  const isFundingCompleted = remainingAmount <= 0;

  const handleFund = async () => {
    const amount = Number(fundAmount);
    setFundError("");

    if (!session) {
      navigate("/signin", { state: { message: "Sign in to back this project." } });
      return;
    }
    if (isProjectOwner) {
      setFundError("Project creators cannot contribute to their own projects.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFundError("Enter a valid contribution amount.");
      return;
    }
    if (isProjectExpired) {
      setFundError("Project is expired and no longer accepts contributions.");
      return;
    }
    if (isFundingCompleted) {
      setFundError("Funding target already reached.");
      return;
    }
    if (amount > remainingAmount) {
      setFundError(`Contribution cannot exceed remaining target of $${remainingAmount.toLocaleString()}.`);
      return;
    }
    try {
      setIsFunding(true);
      const updated = await fundProject(project.id, amount, session.userId);
      if (!updated) {
        setFundError("Unable to process this contribution.");
        return;
      }
      recordProjectFunding(session.userId, updated);
      setShowFundSuccess(true);
      setTimeout(() => setShowFundSuccess(false), 3000);
      await refreshProject();
    } catch (error: unknown) {
      setFundError(error instanceof Error ? error.message : "Unable to process this contribution.");
    } finally {
      setIsFunding(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !session) {
      return;
    }
    try {
      await addProjectComment(project.id, { user: session.name, text: comment.trim() });
      setComment("");
      await refreshProject();
    } catch {
      // No-op, could be surfaced with toast later.
    }
  };

  const handleReply = async (commentId: string) => {
    const text = replyMap[commentId]?.trim();
    if (!text || !session) {
      return;
    }
    try {
      await addCommentReply(project.id, commentId, { user: session.name, text });
      setReplyMap((prev) => ({ ...prev, [commentId]: "" }));
      await refreshProject();
    } catch {
      // No-op, could be surfaced with toast later.
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Link to="/explore" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl overflow-hidden mb-6">
                <img src={project.image} alt={project.title} className="w-full aspect-video object-cover" />
              </div>

              <span className="text-xs font-medium px-3 py-1 rounded-full glass text-primary">{project.category}</span>

              <h1 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-2">{project.title}</h1>
              <p className="text-muted-foreground mb-6">by <span className="text-foreground font-medium">{project.creator}</span></p>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="glass mb-6">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="updates">Impact Updates</TabsTrigger>
                </TabsList>

                <TabsContent value="description">
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                </TabsContent>

                <TabsContent value="rewards">
                  <div className="space-y-4">
                    {project.rewards.map((reward) => (
                      <div
                        key={reward.id}
                        onClick={() => {
                          setSelectedReward(reward.id);
                          setFundAmount(reward.amount.toString());
                        }}
                        className={`glass rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                          selectedReward === reward.id ? "border-primary glow" : "hover:border-primary/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Gift className="h-4 w-4 text-primary" />
                            {reward.title}
                          </h3>
                          <span className="text-primary font-bold">${reward.amount}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="milestones">
                  <div className="space-y-4">
                    {project.milestones.map((ms, i) => (
                      <div key={ms.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            ms.reached ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                          }`}>
                            {i + 1}
                          </div>
                          {i < project.milestones.length - 1 && (
                            <div className={`w-0.5 flex-1 my-1 ${ms.reached ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>
                        <div className="pb-6">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            {ms.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{ms.description}</p>
                          <span className="text-xs text-muted-foreground">${ms.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="comments">
                  <div className="space-y-4 mb-6">
                    {project.comments.length > 0 ? project.comments.map((c) => (
                      <div key={c.id} className="glass rounded-xl p-4">
                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                            {c.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{c.user}</span>
                              <span className="text-xs text-muted-foreground">{c.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{c.text}</p>
                            {c.replies && c.replies.length > 0 && (
                              <div className="mt-3 pl-3 border-l border-border space-y-2">
                                {c.replies.map((reply) => (
                                  <div key={reply.id} className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{reply.user}:</span> {reply.text}
                                  </div>
                                ))}
                              </div>
                            )}
                            {session && (
                              <div className="flex gap-2 mt-3">
                                <Input
                                  placeholder="Reply..."
                                  value={replyMap[c.id] ?? ""}
                                  onChange={(e) => setReplyMap((prev) => ({ ...prev, [c.id]: e.target.value }))}
                                  className="bg-card border-border h-9"
                                />
                                <Button size="sm" variant="outline" onClick={() => handleReply(c.id)}>
                                  <Reply className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-muted-foreground text-sm">No comments yet. Be the first!</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Textarea
                      placeholder={session ? "Add a comment..." : "Sign in to add a comment"}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="bg-card border-border"
                      disabled={!session}
                    />
                    <Button onClick={handleAddComment} disabled={!session} className="gradient-primary text-primary-foreground self-end">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="updates">
                  <div className="space-y-4">
                    {project.updates.length > 0 ? (
                      project.updates.map((update) => (
                        <div key={update.id} className="glass rounded-xl p-4">
                          <h3 className="font-semibold mb-1">{update.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{update.content}</p>
                          <span className="text-xs text-muted-foreground">{update.date}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No impact updates posted yet.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6 sticky top-24"
            >
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-primary font-bold text-2xl">${project.raised.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">raised of ${project.goal.toLocaleString()} goal</p>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    transition={{ duration: 1.2 }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-bold text-lg">{percent}%</div>
                    <div className="text-xs text-muted-foreground">Funded</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" /> {project.backers.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Backers</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" /> {project.daysLeft}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Left</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Pay with Cashfree (Test Mode)</label>
                <p className="text-xs text-muted-foreground mb-2">
                  A secure Cashfree checkout popup will open. Test mode only, no real charge.
                </p>
                <Input
                  type="number"
                  placeholder="Enter amount ($)"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="bg-card border-border mb-3"
                  disabled={isProjectOwner || isProjectExpired || isFundingCompleted || isFunding}
                />
                <Button
                  onClick={handleFund}
                  className="w-full gradient-primary text-primary-foreground font-semibold h-11 hover:opacity-90 transition-opacity"
                  disabled={isProjectOwner || isProjectExpired || isFundingCompleted || isFunding}
                >
                  {isFunding ? "Opening Secure Checkout..." : "Pay Securely"}
                </Button>
                {isProjectExpired && (
                  <p className="text-xs text-destructive font-semibold mt-2 text-center">
                    This project is expired and no longer accepting contributions.
                  </p>
                )}
                {isFundingCompleted && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Funding complete. This project is no longer accepting contributions.
                  </p>
                )}
                {isProjectOwner && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    You cannot contribute to your own project.
                  </p>
                )}
                {fundError && <p className="text-destructive text-sm mt-2 text-center">{fundError}</p>}
                {showFundSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary text-sm mt-2 text-center"
                  >
                    Payment successful via Cashfree test flow.
                  </motion.p>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <Share2 className="h-3 w-3" /> Share this project
                </p>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(project.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors"
                  >
                    <Facebook className="h-4 w-4 text-muted-foreground" />
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(project.title + " " + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;

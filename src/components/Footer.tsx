import { Link } from "react-router-dom";
import { Flame, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/40 mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="gradient-primary rounded-lg p-1.5">
              <Flame className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">
              Fund<span className="text-primary">Forge</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The future of crowdfunding. Connect creators with backers worldwide.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Platform</h4>
          <div className="flex flex-col gap-2">
            <Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">Explore</Link>
            <Link to="/create" className="text-sm text-muted-foreground hover:text-primary transition-colors">Start a Project</Link>
            <Link to="/success-stories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Success Stories</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Company</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">About</span>
            <span className="text-sm text-muted-foreground">Careers</span>
            <span className="text-sm text-muted-foreground">Press</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Connect</h4>
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors cursor-pointer">
              <Twitter className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors cursor-pointer">
              <Github className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors cursor-pointer">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 FundForge. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

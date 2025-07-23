import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Globe, CheckCircle, XCircle, ExternalLink } from "lucide-react";

function convertToEmbedUrl(url: string) {
  if (!url) return "";
  if (url.includes("youtube.com")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "youtube.com/embed/");
  }
  if (url.includes("vimeo.com")) {
    return url.replace("vimeo.com", "player.vimeo.com/video");
  }
  return url;
}

interface DemoVideoModalProps {
  open: boolean;
  onClose: () => void;
  project: any | null;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ open, onClose, project }) => {
  if (!project) return null;

  // Check if project is a winner
  const winnerProjects = [
    "anytype - nft gating",
    "delegit", 
    "empathy technologies",
    "hypertents",
    "papi actions",
    "propcorn",
    "ChainView"
  ];
  
  const isWinner = winnerProjects.some(winner => 
    project.projectName.toLowerCase().includes(winner.toLowerCase())
  );

  // Check milestone completion status
  const getMilestoneStatus = () => {
    if (!isWinner) return null;
    
    const completedProjects = [
      "propcorn",
      "delegit", 
      "chainview"
    ];
    
    const isCompleted = completedProjects.some(completed => 
      project.projectName.toLowerCase().includes(completed.toLowerCase())
    );
    
    return isCompleted ? "completed" : "incomplete";
  };

  const milestoneStatus = getMilestoneStatus();

  // Override demo URL for delegit to use their live site
  const getDemoUrl = () => {
    if (project.projectName.toLowerCase().includes("delegit")) {
      return "https://delegit.xyz/?network=polkadot-lc";
    }
    if (project.projectName.toLowerCase().includes("propcorn")) {
      return "https://propcorn.xyz/";
    }
    return project.demoUrl;
  };

  const demoUrl = getDemoUrl();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div className="relative aspect-video bg-black">
          {demoUrl && demoUrl !== "nan" ? (
            <iframe
              src={convertToEmbedUrl(demoUrl)}
              className="w-full h-full"
              allowFullScreen
              title="Demo Video"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <p>Demo video not available</p>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">{project.projectName}</h2>
            <div className="flex gap-2">
              {isWinner && (
                <Badge variant="secondary" className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  🏆 Winner
                </Badge>
              )}
              {milestoneStatus === "completed" && (
                <Badge variant="secondary" className="px-3 py-1 bg-green-500/20 text-green-300 border-green-500/30">
                  ☑️ Completed Milestones
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          
          <div className="flex gap-2">
            {project.githubRepo && project.githubRepo !== "nan" && (
              <Button variant="outline" asChild>
                <a href={project.githubRepo} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> View Code
                </a>
              </Button>
            )}
            {demoUrl && demoUrl !== "nan" && (
              <Button asChild>
                <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" /> Visit Site
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
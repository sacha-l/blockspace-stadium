import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Globe, CheckCircle, XCircle, ExternalLink, Heart } from "lucide-react";

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

// Category mapping for tech stack
const CATEGORY_MAP: Record<string, string> = {
  // Symmetry 2024 categories
  "Rust": "Developer Tools",
  "wasm": "Developer Tools",
  "typescript": "Developer Tools",
  "TS": "Developer Tools",
  "react": "Developer Tools",
  "NEXT": "Developer Tools",
  "Next.js": "Developer Tools",
  "NextJS": "Developer Tools",
  "Golang": "Developer Tools",
  "Python": "Developer Tools",
  "deno": "Developer Tools",
  "Solidity": "DeFi",
  "EVM": "DeFi",
  "Polkadot": "DeFi",
  "Cairo": "DeFi",
  "NFT": "NFT",
  "Figma": "NFT",
  "JavaScript": "Developer Tools",
  "JS": "Developer Tools",
  "Jetson Nano": "Gaming",
  "Substrate": "Developer Tools",
  "GraphViz": "Developer Tools",
  "Mongo": "Developer Tools",
  "mongoDB": "Developer Tools",
  "Flutter": "Developer Tools",
  "React Native": "Developer Tools",
  "Wagmi": "DeFi",
  "Viem": "DeFi",
  "Sepolia": "DeFi",
  "Blink": "DeFi",
  "Phantom Wallet": "DeFi",
  "Solana": "DeFi",
  "Web3.js": "DeFi",
  "Livepeer": "Social",
  "Langchain": "Developer Tools",
  "CSS": "Developer Tools",
  "HTML": "Developer Tools",
  "Gaming": "Gaming",
  "Social": "Social",
  "F#": "Developer Tools",
  "Flask": "Developer Tools",
  "ethers.js": "DeFi",
  "Ollama": "Developer Tools",
  "EVM Pallet": "DeFi",
  "dephy messaging layer": "Developer Tools",
  "DePHY ID": "Developer Tools",
  "Structured Causal Models": "Developer Tools",
  "Rootstock": "DeFi",
  "Cere Network": "DeFi",
  "Goldsky Subgraph": "Developer Tools",
  "SQL": "Developer Tools",
  "Nextjs": "Developer Tools",
  "Papi": "Developer Tools",
  "DotConnect": "Developer Tools",
  // Synergy 2025 categories
  "Kusama": "DeFi", 
  "ink!": "Developer Tools",
  "Other": "Other",
};

function extractCategories(techStack: string): string[] {
  return techStack
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t && t.toLowerCase() !== "nan")
    .map((t) => {
      // Try exact match first
      if (CATEGORY_MAP[t]) {
        return CATEGORY_MAP[t];
      }
      // Try case-insensitive match
      const lowerT = t.toLowerCase();
      for (const [key, value] of Object.entries(CATEGORY_MAP)) {
        if (key.toLowerCase() === lowerT) {
          return value;
        }
      }
      return t;
    });
}

const categoryIcons: Record<string, string> = {
  "Gaming": "🎮",
  "DeFi": "💰",
  "NFT": "🎨",
  "Developer Tools": "🛠️",
  "Social": "🌐",
  "Other": "🔧",
  "Winners": "🏆",
};

interface DemoVideoModalProps {
  open: boolean;
  onClose: () => void;
  project: any | null;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ open, onClose, project }) => {
  if (!project) return null;

  // Check if project is a winner - handle both data structures
  const isWinner = project.winner && project.winner !== "";

  // Check milestone completion status - 2025 winners don't have completed milestones yet
  const getMilestoneStatus = () => {
    if (!isWinner) return null;
    // For 2025 winners, milestones are not yet completed
    return "pending";
  };

  const milestoneStatus = getMilestoneStatus();

  // Extract categories from tech stack
  const projectCategories = extractCategories(project.techStack);

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
      <DialogContent className="max-w-3xl w-full p-0 mx-auto my-8">
        <div className="relative aspect-video bg-black max-h-[60vh]">
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
                  🏆 {project.winner}
                </Badge>
              )}
              {milestoneStatus === "completed" && (
                <Badge variant="secondary" className="px-3 py-1 bg-green-500/20 text-green-300 border-green-500/30">
                  ☑️ Completed Milestones
                </Badge>
              )}
              {milestoneStatus === "pending" && (
                <Badge variant="secondary" className="px-3 py-1 bg-blue-500/20 text-blue-300 border-blue-500/30">
                  ⏳ Milestones Pending
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          
          {/* Project Categories */}
          {projectCategories.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-white">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(projectCategories)).map((category, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs px-2 py-1 border-primary/30 text-primary"
                  >
                    <span className="mr-1">{categoryIcons[category] || "🔧"}</span>
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Donation Address Section */}
          {project.donationAddress && (
            <div className="mb-4 p-3 bg-gradient-to-r from-pink-500/5 to-red-500/5 rounded-md border border-pink-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-3 w-3 text-pink-500" />
                  <span className="text-xs text-pink-500 font-medium">Donate:</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {project.donationAddress.slice(0, 8)}...{project.donationAddress.slice(-6)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-pink-500 hover:bg-pink-500/10 h-6 px-2 text-xs"
                  asChild
                >
                  <a 
                    href={`https://assethub-polkadot.subscan.io/account/${project.donationAddress}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Subscan</span>
                  </a>
                </Button>
              </div>
            </div>
          )}
          
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
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProjectBubbleProps {
  project: any;
  onPlayDemo: (project: any) => void;
}

export const ProjectBubble: React.FC<ProjectBubbleProps> = ({ project, onPlayDemo }) => {
  // Check if project is a winner - handle both data structures
  const isWinner = project.winner && project.winner !== "";

  return (
    <div
      className="project-bubble group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-primary/20 to-accent/20 p-4"
    >
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-lg truncate text-white drop-shadow-sm flex-1 mr-2">{project.projectName}</h3>
            {isWinner && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                🏆 {project.winner}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2 truncate">By {project.teamLead}</p>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-3 mb-2 flex-1">{project.description}</p>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button onClick={() => onPlayDemo(project)} size="lg" className="text-lg">
          ▶️ Learn More
        </Button>
      </div>
    </div>
  );
}; 
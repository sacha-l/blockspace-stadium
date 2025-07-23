import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  project: any | null;
}

export const VideoModal: React.FC<VideoModalProps> = ({ open, onClose, project }) => {
  if (!project) return null;
  const isVideo = project.demoUrl && (project.demoUrl.endsWith(".mp4") || project.demoUrl.includes("youtube.com") || project.demoUrl.includes("vimeo.com"));
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
        <div className="bg-black">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-bold">{project.projectName} Demo</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ✖
            </Button>
          </div>
          <div className="w-full aspect-video flex items-center justify-center bg-black">
            {isVideo ? (
              project.demoUrl.includes("youtube.com") ? (
                <iframe
                  src={project.demoUrl.replace("watch?v=", "embed/")}
                  title="Demo Video"
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : project.demoUrl.includes("vimeo.com") ? (
                <iframe
                  src={project.demoUrl.replace("vimeo.com", "player.vimeo.com/video")}
                  title="Demo Video"
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video src={project.demoUrl} controls className="w-full h-full" />
              )
            ) : project.demoUrl && project.demoUrl !== "nan" ? (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Open Demo
              </a>
            ) : (
              <span className="text-muted-foreground">No demo available</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
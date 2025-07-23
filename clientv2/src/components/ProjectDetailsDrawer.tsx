import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectDetailsContent } from "@/components/ProjectDetailsContent";
import { X } from "lucide-react";

interface ProjectDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  project: any | null;
}

export const ProjectDetailsDrawer: React.FC<ProjectDetailsDrawerProps> = ({ open, onClose, project }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="fixed right-0 top-0 bottom-0 h-full w-full sm:w-[500px] max-w-full z-50 bg-background shadow-2xl overflow-y-auto p-0 transition-transform rounded-none sm:rounded-l-2xl"
        style={{ border: "none" }}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="p-2 rounded hover:bg-muted transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        {project && <ProjectDetailsContent project={project} />}
      </DialogContent>
    </Dialog>
  );
}; 